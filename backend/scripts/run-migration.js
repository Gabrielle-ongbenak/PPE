const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const sqlPath = path.join(__dirname, '../migrations/001_extensions.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');
const statements = sql
  .split(';')
  .map((s) => s.trim())
  .filter((s) => s && !s.startsWith('--') && !s.startsWith('USE '));

const run = async () => {
  for (const statement of statements) {
    await new Promise((resolve) => {
      db.query(statement, (err) => {
        if (err && !err.message.includes('Duplicate column') && !err.message.includes('already exists')) {
          console.warn('Migration warning:', err.message);
        }
        resolve();
      });
    });
  }
  console.log('Migration terminée');
  process.exit(0);
};

run();
