const express = require('express');
const router = express.Router();

const {
  envoyerMessage,
  mesConversations,
  voirConversation,
  marquerLu,
  supprimerMessage,
} = require('../controllers/message.controller');

const verifierToken = require('../middleware/auth.middleware');

router.post('/',           verifierToken, envoyerMessage);
router.get('/',            verifierToken, mesConversations);
router.get('/:userId',     verifierToken, voirConversation);
router.put('/:id/lu',      verifierToken, marquerLu);
router.delete('/:id',      verifierToken, supprimerMessage);

module.exports = router;