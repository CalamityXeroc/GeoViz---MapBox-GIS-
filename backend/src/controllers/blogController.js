const Blog = require('../models/Blog');

// 获取所有博客
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取博客列表失败',
      error: error.message
    });
  }
};

// 获取单篇博客
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: '博客不存在'
      });
    }
    
    // 增加浏览量
    await blog.increment('views');
    
    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取博客失败',
      error: error.message
    });
  }
};

// 创建博客
exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({
      success: true,
      message: '博客创建成功',
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建博客失败',
      error: error.message
    });
  }
};

// 更新博客
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: '博客不存在'
      });
    }
    
    await blog.update(req.body);
    res.json({
      success: true,
      message: '博客更新成功',
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新博客失败',
      error: error.message
    });
  }
};

// 删除博客
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: '博客不存在'
      });
    }
    
    await blog.destroy();
    res.json({
      success: true,
      message: '博客删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除博客失败',
      error: error.message
    });
  }
};
