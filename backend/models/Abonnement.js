const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Abonnement = sequelize.define('Abonnement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_agent: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  plan: {
    type: DataTypes.ENUM('basic', 'pro', 'premium'),
    defaultValue: 'basic',
  },
  date_debut: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  date_fin: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  statut: {
    type: DataTypes.ENUM('actif', 'expire'),
    defaultValue: 'actif',
  },
  reference_paiement: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'abonnements',
  timestamps: false,
});

module.exports = Abonnement;
