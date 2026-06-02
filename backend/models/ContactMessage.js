const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContactMessage = sequelize.define('ContactMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  agent_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  visitor_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  visitor_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  visitor_phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'contact_messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = ContactMessage;
