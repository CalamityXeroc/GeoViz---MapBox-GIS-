const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '博客标题'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '博客内容（支持 Markdown）'
  },
  author: {
    type: DataTypes.STRING(100),
    defaultValue: '佰世铜',
    comment: '作者'
  },
  coverImage: {
    type: DataTypes.STRING(500),
    field: 'cover_image',
    comment: '封面图片URL'
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: '标签'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '浏览量'
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  }
}, {
  tableName: 'blogs',
  timestamps: true
});

module.exports = Blog;
