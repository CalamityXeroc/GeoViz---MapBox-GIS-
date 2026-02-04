const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MapMarker = sequelize.define('MapMarker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '地点名称'
  },
  description: {
    type: DataTypes.TEXT,
    comment: '地点描述'
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false,
    comment: '经度'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false,
    comment: '纬度'
  },
  visitDate: {
    type: DataTypes.DATE,
    field: 'visit_date',
    comment: '访问日期'
  },
  category: {
    type: DataTypes.STRING(50),
    comment: '分类（如：旅行、工作、生活）'
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
  tableName: 'map_markers',
  timestamps: true
});

module.exports = MapMarker;
