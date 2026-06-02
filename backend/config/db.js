const mysql= require('mysql2');
require('dotenv').config({
  path: process.env.ENV_FILE || '.env',
  override: false,
});

const dbHost = process.env.DB_HOST === 'localhost' ? '127.0.0.1' : process.env.DB_HOST;

const db = mysql.createConnection({
    host: dbHost,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
db.connect((err)=>{
    if (err){
        console.error('Erreur de connexion a la base de donnees:', err);
        return;
    }
    console.log('Connecté à la base de données logi_cam')
});

module.exports = db;