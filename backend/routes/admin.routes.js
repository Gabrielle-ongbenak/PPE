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

const { verifierToken } = require('../middleware/auth.middleware');

// Toutes les routes admin sont protégées
router.get('/agents',               verifierToken, tousLesAgents);
router.put('/agents/:id/valider',   verifierToken, validerAgent);
router.put('/agents/:id/rejeter',   verifierToken, rejeterAgent);
router.get('/logements',            verifierToken, tousLesLogements);
router.delete('/logements/:id',     verifierToken, supprimerLogement);
router.get('/stats',                verifierToken, statistiques);

module.exports = router;