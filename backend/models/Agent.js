// models/Agent.js
// Modèle de la table agents de Tcho

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Agent = sequelize.define('Agent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  nom_agence: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  photo_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  documents_path: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  statut: {
    type: DataTypes.ENUM('valide', 'rejete', 'en_attente'),
    defaultValue: 'en_attente',
  },
  use_role: {
    type: DataTypes.ENUM('agent', 'admin'),
    allowNull: false,
  },
}, {
  tableName: 'agents',
  timestamps: false,
});

module.exports = Agent;