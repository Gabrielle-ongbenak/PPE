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
// Route publique de recherche
router.get('/recherche', rechercherLogements);
const verifierToken = require('../middleware/auth.middleware');
const { verifierAgent } = require('../middleware/agent.middleware');
const { verifierAbonnementActif } = require('../middleware/subscription.middleware');

router.post('/',              verifierToken, verifierAgent, verifierAbonnementActif, creerPublication);
router.get('/mes-annonces',   verifierToken, verifierAgent, mesPublications);
router.put('/:id',            verifierToken, verifierAgent, modifierPublication);
router.delete('/:id',         verifierToken, verifierAgent, supprimerPublication);
router.put('/:id/statut',     verifierToken, verifierAgent, changerStatut);
router.get('/:id',            voirPublication);

module.exports = router;