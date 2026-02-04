const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const https = require('https');
require('dotenv').config();

const { testConnection } = require('./config/database');
const blogRoutes = require('./routes/blogRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;  // 默认端口改为 5000，与测试环境一致

// 中间件
app.use(cors()); // 允许跨域请求
app.use(express.json({ limit: '50mb' })); // 解析 JSON 请求体，支持大文件
app.use(express.urlencoded({ limit: '50mb', extended: true })); // 解析 URL 编码请求体
app.use(morgan('dev')); // 请求日志

// --- 调试中间件：打印所有请求路径，用于排查 Nginx 代理错误 ---
app.use((req, res, next) => {
  // 忽略 Vite 的心跳请求日志
  if (req.url === '/__vite_ping') return next();
  console.log(`🔍 [收到请求] ${req.method} ${req.url}`);
  next();
});

// 静态文件服务（上传的图片）
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 天地图瓦片代理接口 (通用版支持不同图层)
// layer: img_w (卫星), cia_w (卫星注记), vec_w (矢量), cva_w (矢量注记)
app.get('/api/tdt/:layer/:z/:x/:y', (req, res) => {
  const { layer, z, x, y } = req.params;
  // 从环境变量获取天地图 Key
  const TDT_KEY = process.env.TDT_KEY || '';
  
  if (!TDT_KEY) {
    return res.status(500).json({ error: '天地图 Key 未配置' });
  }
  
  // 简单的参数校验
  if (!/^[a-z0-9_]+$/.test(layer)) {
    return res.status(400).json({ error: '无效的图层名称' });
  }

  // 构建天地图URL (始终使用 Web Mercator 投影 w)
  // 注意：如果是 img_w 或 vec_w，URL pattern 是一致的
  // 随机服务器 t0-t7
  const subDomain = `t${Math.floor(Math.random() * 8)}`;
  const tileUrl = `https://${subDomain}.tianditu.gov.cn/${layer}/wmts?tk=${TDT_KEY}&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layer.split('_')[0]}&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL=${x}&TILEROW=${y}&TILEMATRIX=${z}`;
  
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  };

  // 代理请求
  https.get(tileUrl, options, (tiledRes) => {
    // 检查上游响应状态
    if (tiledRes.statusCode !== 200) {
      // 这里的错误日志在开发时很有用
      // console.error(`天地图返回错误 [${layer}]: ${tiledRes.statusCode}`);
      return res.status(tiledRes.statusCode || 500).json({ error: '天地图上游错误' });
    }

    // CRITICAL FIX: 不要转发 Content-Type，让浏览器自动嗅探。
    // 天地图经常返回 PNG 但标记为 image/jpeg，导致 Mapbox 解码失败。
    // res.setHeader('Content-Type', tiledRes.headers['content-type']); 
    
    // 依然设置缓存头
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 缓存24小时
    
    tiledRes.pipe(res);
  }).on('error', (err) => {
    console.error('天地图请求失败:', err);
    res.status(500).json({ error: '获取瓦片失败' });
  });
});

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: '🎉 个人网站 API 服务正在运行',
    version: '1.0.0',
    endpoints: {
      blogs: '/api/blog',
      upload: '/api/upload',
      'tdt-tile': '/api/tdt/tile/:z/:x/:y'
    }
  });
});

// API 路由
app.use('/api/blog', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/comments', commentRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '请求的资源不存在'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await testConnection();
    
    // 强制监听 0.0.0.0 以允许外部访问（容器/服务器环境必要）
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 服务器成功启动！`);
      console.log(`📡 监听地址: http://0.0.0.0:${PORT}`);
      console.log(`📝 本地访问: http://localhost:${PORT}`);
      console.log(`📦 当前环境: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

startServer();
