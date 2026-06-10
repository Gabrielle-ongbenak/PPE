const bcrypt = require('bcryptjs');
const db = require('../config/db');

const hash = bcrypt.hashSync('Agent@123', 10);
const adminHash = bcrypt.hashSync('Admin@123', 10);

const queries = [
  [`INSERT INTO agents (nom, email, mot_de_passe, telephone, nom_agence, use_role, statut)
    VALUES ('Agent Demo', 'agent@demo.cm', ?, '699000001', 'Agence Demo', 'agent', 'valide')
    ON DUPLICATE KEY UPDATE statut='valide'`, [hash]],
  [`INSERT INTO agents (nom, email, mot_de_passe, telephone, use_role, statut)
    VALUES ('Admin Logitech', 'admin@logitech.cm', ?, '600000000', 'admin', 'valide')
    ON DUPLICATE KEY UPDATE statut='valide'`, [adminHash]],
];

const run = async () => {
  for (const [sql, params] of queries) {
    await new Promise((resolve, reject) => {
      db.query(sql, params, (err, res) => (err ? reject(err) : resolve(res)));
    });
  }

  const [[agent]] = await new Promise((resolve, reject) => {
    db.query("SELECT id FROM agents WHERE email='agent@demo.cm'", (err, rows) =>
      err ? reject(err) : resolve([rows])
    );
  });

  const dateFin = new Date();
  dateFin.setDate(dateFin.getDate() + 30);

  await new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO abonnements (id_agent, plan, date_fin, montant, statut, reference_paiement)
       SELECT ?, 'pro', ?, 15000, 'actif', 'DEMO-MM-001' FROM DUAL
       WHERE NOT EXISTS (SELECT 1 FROM abonnements WHERE id_agent=? AND statut='actif')`,
      [agent.id, dateFin, agent.id],
      (err) => (err ? reject(err) : resolve())
    );
  });

  await new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO logements (titre, id_agent, id_type, ville, quartier, region, prix, descriptions, chambres, salles_bain, surface_m2, statut)
       SELECT 'Studio Moderne Bastos', ?, 2, 'Yaoundé', 'Bastos', 'Centre', 150000, 'Studio lumineux proche commerces', 1, 1, 45, 'disponible' FROM DUAL
       WHERE NOT EXISTS (SELECT 1 FROM logements WHERE id_agent=? LIMIT 1)`,
      [agent.id, agent.id],
      (err) => (err ? reject(err) : resolve())
    );
  });

  console.log('Demo seed OK — agent@demo.cm / Agent@123 — admin@logitech.cm / Admin@123');
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
