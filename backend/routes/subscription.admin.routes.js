const express = require('express');
const router = express.Router();
const verifierToken = require('../middleware/auth.middleware');
const { verifierAdmin } = require('../middleware/admin.middleware');
const {
  listerAbonnementsAgent,
  activerAbonnement,
  creerAbonnementAdmin,
  expirerAbonnement,
} = require('../controllers/subscription.controller');

router.get('/agents/:agentId', verifierToken, verifierAdmin, listerAbonnementsAgent);
router.post('/agents/:agentId', verifierToken, verifierAdmin, creerAbonnementAdmin);
router.put('/:id/activate', verifierToken, verifierAdmin, activerAbonnement);
router.put('/:id/expire', verifierToken, verifierAdmin, expirerAbonnement);

module.exports = router;
