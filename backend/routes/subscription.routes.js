const express = require('express');
const router = express.Router();
const verifierToken = require('../middleware/auth.middleware');
const { verifierAgent } = require('../middleware/agent.middleware');
const {
  listerPlans,
  monAbonnement,
  demanderAbonnement,
} = require('../controllers/subscription.controller');

router.get('/plans', listerPlans);
router.get('/me', verifierToken, verifierAgent, monAbonnement);
router.post('/request', verifierToken, verifierAgent, demanderAbonnement);

module.exports = router;
