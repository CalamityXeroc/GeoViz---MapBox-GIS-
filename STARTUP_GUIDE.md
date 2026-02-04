# MapBox 可视化编辑器 - 快速启动指南

## 双语启动脚本

### Windows 用户

#### 启动前端（`start-frontend.bat`）
```batch
@echo off
echo 启动 MapBox 前端开发服务器...
npm run dev
pause
```

#### 启动后端（`start-backend.bat`）
```batch
@echo off
echo 启动后端代理服务器...
npm run backend
pause
```

#### 启动完整系统（`start-all.bat`）
```batch
@echo off
echo 启动完整 MapBox GIS 系统...
start cmd /k "npm run backend"
start cmd /k "npm run dev"
echo 系统启动完毕！
echo 前端访问: http://localhost:3000
echo 后端地址: http://127.0.0.1:3001
pause
```

### Linux/macOS 用户

#### 启动前端（`start-frontend.sh`）
```bash
#!/bin/bash
echo "启动 MapBox 前端开发服务器..."
npm run dev
```

#### 启动后端（`start-backend.sh`）
```bash
#!/bin/bash
echo "启动后端代理服务器..."
npm run backend
```

#### 启动完整系统（`start-all.sh`）
```bash
#!/bin/bash
echo "启动完整 MapBox GIS 系统..."
npm run backend &
npm run dev
```

## 首次使用步骤

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量** （创建 `.env.local`）
   ```env
   VITE_MAPBOX_TOKEN=your_token
   VITE_TDT_TOKEN=your_token
   ```

3. **启动系统**
   - Windows: 双击 `start-all.bat`
   - Linux/macOS: 运行 `bash start-all.sh`

4. **打开浏览器**
   访问 http://localhost:3000

## 常见问题

### 端口已被占用
修改 `vite.config.js` 中的端口号，或杀死占用进程。

### 后端连接失败
确保后端服务已启动在 http://127.0.0.1:3001

### 地图不显示
检查天地图 Token 是否正确配置。

## 开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动前端开发服务器 |
| `npm run backend` | 启动后端服务器 |
| `npm run build` | 生产构建 |
| `npm run serve` | 预览生产构建 |

## 架构说明

```
客户端 (3000)
    ↓
Vite 代理
    ↓
后端服务器 (3001)
    ↓
天地图 API
    ↓
MapBox GL
```

## 相关文档

- [MapBox GL 文档](https://docs.mapbox.com/mapbox-gl-js/)
- [MapBox GL Draw](https://github.com/mapbox/mapbox-gl-draw)
- [天地图 API](https://www.tianditu.gov.cn/)
