const { Sequelize } = require('sequelize');
require('dotenv').config({
  path: process.env.ENV_FILE || '.env',
  override: false,
});

const dbHost = process.env.DB_HOST === 'localhost' ? '127.0.0.1' : process.env.DB_HOST;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: dbHost,
    dialect: 'mysql',
    port: Number(process.env.DB_PORT || 3306),
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Connexion à MySQL réussie !');
  } catch (error) {
    console.error(' Erreur de connexion à MySQL :', error.message);
  }
};

connectDB();

module.exports = sequelize;