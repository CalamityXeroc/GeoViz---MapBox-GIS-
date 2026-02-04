const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// 获取某篇博客的留言
router.get('/:blogId', commentController.getCommentsByBlogId);

// 发布新留言
router.post('/', commentController.createComment);

// 删除留言
router.delete('/:id', commentController.deleteComment);

module.exports = router;
