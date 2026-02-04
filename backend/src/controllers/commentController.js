const Comment = require('../models/Comment');

// 获取指定博客的所有留言
exports.getCommentsByBlogId = async (req, res) => {
  try {
    const blogId = parseInt(req.params.blogId, 10);
    if (Number.isNaN(blogId)) {
      return res.status(400).json({ success: false, message: '无效的 blogId' });
    }

    const comments = await Comment.findAll({
      where: { blogId },
      order: [['createdAt', 'DESC']] // 按时间倒序排列，最新的在前面
    });
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('获取留言失败:', error);
    res.status(500).json({
      success: false,
      message: '获取留言失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 验证 email 简单函数
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // 简单的正则校验，避免 Sequelize 抛错导致无法定位原因
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

// 创建新留言
exports.createComment = async (req, res) => {
  try {
    let { blogId, nickname, email, content } = req.body;

    // 基本校验
    blogId = parseInt(blogId, 10);
    if (Number.isNaN(blogId) || !nickname || !email || !content) {
      return res.status(400).json({
        success: false,
        message: '所有字段都是必填的，且 blogId 必须为数字'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: '请输入有效的邮箱地址'
      });
    }

    // 创建留言
    const newComment = await Comment.create({
      blogId,
      nickname: String(nickname).trim(),
      email: String(email).trim(),
      content: String(content).trim()
    });

    res.status(201).json({
      success: true,
      data: newComment,
      message: '留言发布成功'
    });
  } catch (error) {
    console.error('发布留言失败:', error);
    // 如果是 Sequelize 验证错误，返回友好错误信息
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: error.errors && error.errors.length ? error.errors[0].message : '数据验证失败'
      });
    }

    res.status(500).json({
      success: false,
      message: '发布留言失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 删除留言
exports.deleteComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.id, 10);
    if (Number.isNaN(commentId)) {
      return res.status(400).json({ success: false, message: '无效的 commentId' });
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: '留言不存在' });
    }

    await comment.destroy();

    res.json({
      success: true,
      message: '留言删除成功'
    });
  } catch (error) {
    console.error('删除留言失败:', error);
    res.status(500).json({
      success: false,
      message: '删除留言失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
