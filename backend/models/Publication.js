const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Publication = sequelize.define('Publication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_agent: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  ville: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  quartier: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  adresse_map: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  prix: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  descriptions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  statut: {
    type: DataTypes.ENUM('disponible', 'occupe'),
    defaultValue: 'disponible',
  },
}, {
  tableName: 'logements',
  timestamps: false,
});

module.exports = Publication;