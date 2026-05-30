const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Photo = sequelize.define('Photo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  publication_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  url_media: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type_media: {
    type: DataTypes.ENUM('photo', 'video'),
    defaultValue: 'photo',
  },
}, {
  tableName: 'medias',
  timestamps: false,
});

module.exports = Photo;