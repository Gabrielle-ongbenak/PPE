// models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // ID de celui qui envoie
  expediteur_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Est-ce un agent ou un client ?
  expediteur_type: {
    type: DataTypes.ENUM('agent', 'client'),
    allowNull: false,
  },
  // ID de celui qui reçoit
  destinataire_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Est-ce un agent ou un client ?
  destinataire_type: {
    type: DataTypes.ENUM('agent', 'client'),
    allowNull: false,
  },
  // Logement concerné par le message
  logement_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Contenu du message
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Message lu ou pas
  est_lu: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'messages',
  timestamps: false,
});

module.exports = Message;