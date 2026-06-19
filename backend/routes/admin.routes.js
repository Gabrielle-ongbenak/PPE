// routes/admin.routes.js
// Routes réservées à l'administrateur

const express = require('express');
const router = express.Router();

const {
  tousLesAgents,
  validerAgent,
  rejeterAgent,
  tousLesLogements,
  tousLesLogementsEnAttente,
  supprimerLogement,
  validerLogement,
  rejeterLogement,
  statistiques,
} = require('../controllers/admin.controller');

// Double protection
const verifierToken = require('../middleware/auth.middleware');
const { verifierAdmin } = require('../middleware/admin.middleware');

// Toutes les routes admin sont doublement protégées
router.get('/agents', verifierToken, verifierAdmin, tousLesAgents);
router.put('/agents/:id/valider', verifierToken, verifierAdmin, validerAgent);
router.put('/agents/:id/rejeter', verifierToken, verifierAdmin, rejeterAgent);
router.get('/logements', verifierToken, verifierAdmin, tousLesLogements);
router.get('/logements/en-attente', verifierToken, verifierAdmin, tousLesLogementsEnAttente);
router.delete('/logements/:id', verifierToken, verifierAdmin, supprimerLogement);
router.put('/logements/:id/valider', verifierToken, verifierAdmin, validerLogement);
router.put('/logements/:id/rejeter', verifierToken, verifierAdmin, rejeterLogement);
router.get('/stats', verifierToken, verifierAdmin, statistiques);

module.exports = router;