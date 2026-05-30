const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// INSCRIPTION AGENT
router.post('/register/agent', (req, res) => {
    const { nom, email, mot_de_passe, telephone } = req.body;

    // 1. Vérifier que tous les champs sont remplis
    if (!nom || !email || !mot_de_passe || !telephone) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // 2. Chiffrer le mot de passe
    const hash = bcrypt.hashSync(mot_de_passe, 10);

    // 3. Insérer dans la base de données
    const sql = 'INSERT INTO agents (nom, email, mot_de_passe, telephone) VALUES (?, ?, ?, ?)';
    db.query(sql, [nom, email, hash, telephone], (err, result) => {
       if (err) {
    console.log('Erreur SQL :', err); // ajoute cette ligne
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }
    return res.status(500).json({ message: 'Erreur serveur.' });
    }
    });
});

module.exports = router;