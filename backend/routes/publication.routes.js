const express = require('express');
const router = express.Router();
const {
  creerPublication,
  mesPublications,
  voirPublication,
  modifierPublication,
  supprimerPublication,
  changerStatut,
  rechercherLogements,
} = require('../controllers/publication.controller');
const { publicationValidation } = require('../middleware/validation.middleware');
const verifierToken = require('../middleware/auth.middleware');
const { verifierAgent } = require('../middleware/agent.middleware');
const { verifierAbonnementActif } = require('../middleware/subscription.middleware');

// Route publique de recherche
router.get('/recherche', rechercherLogements);

// Routes protégées pour les agents
router.post('/', verifierToken, verifierAgent, verifierAbonnementActif, publicationValidation, creerPublication);
router.get('/mes-annonces', verifierToken, verifierAgent, mesPublications);
router.put('/:id', verifierToken, verifierAgent, publicationValidation, modifierPublication);
router.delete('/:id', verifierToken, verifierAgent, supprimerPublication);
router.put('/:id/statut', verifierToken, verifierAgent, changerStatut);

// Route publique pour voir une publication
router.get('/:id', voirPublication);

module.exports = router;