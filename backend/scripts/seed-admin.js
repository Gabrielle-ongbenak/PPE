const bcrypt = require('bcryptjs');
const db = require('../config/db');

const email = process.env.ADMIN_EMAIL || 'admin@logicam.cm';
const password = process.env.ADMIN_PASSWORD || 'Admin@123';
const name = process.env.ADMIN_NAME || 'Administrateur LogiCam';

const hash = bcrypt.hashSync(password, 10);

const sql = `INSERT INTO agents (nom, email, mot_de_passe, telephone, use_role, statut)
VALUES (?, ?, ?, ?, 'admin', 'valide')
ON DUPLICATE KEY UPDATE nom = VALUES(nom), mot_de_passe = VALUES(mot_de_passe), statut = 'valide'`;

db.query(sql, [name, email, hash, '600000000'], (err) => {
  if (err) {
    console.error('Seed admin error:', err.message);
    process.exit(1);
  }
  console.log(`Admin prêt: ${email} / ${password}`);
  process.exit(0);
});
