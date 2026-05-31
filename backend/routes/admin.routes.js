// routes/admin.routes.js
// Routes réservées à l'administrateur

const express = require('express');
const router = express.Router();

const {
  tousLesAgents,
  validerAgent,
  rejeterAgent,
  tousLesLogements,
  supprimerLogement,
  statistiques,
} = require('../controllers/admin.controller');

// Double protection
const verifierToken = require('../middleware/auth.middleware');
const { verifierAdmin } = require('../middleware/admin.middleware');

// Toutes les routes admin sont doublement protégées
router.get('/agents',               verifierToken, verifierAdmin, tousLesAgents);
router.put('/agents/:id/valider',   verifierToken, verifierAdmin, validerAgent);
router.put('/agents/:id/rejeter',   verifierToken, verifierAdmin, rejeterAgent);
router.get('/logements',            verifierToken, verifierAdmin, tousLesLogements);
router.delete('/logements/:id',     verifierToken, verifierAdmin, supprimerLogement);
router.get('/stats',                verifierToken, verifierAdmin, statistiques);

module.exports = router;