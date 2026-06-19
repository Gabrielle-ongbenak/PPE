const express = require('express');
const router = express.Router();
const { envoyerMessage } = require('../controllers/contact.controller');

router.post('/:propertyId', envoyerMessage);

module.exports = router;
