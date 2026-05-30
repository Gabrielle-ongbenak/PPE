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
const { verifierToken } = require('../middleware/auth.middleware');

router.post('/',              verifierToken, creerPublication);
router.get('/mes-annonces',   verifierToken, mesPublications);
router.put('/:id',            verifierToken, modifierPublication);
router.delete('/:id',         verifierToken, supprimerPublication);
router.put('/:id/statut',     verifierToken, changerStatut);
router.get('/:id',            voirPublication);

module.exports = router;