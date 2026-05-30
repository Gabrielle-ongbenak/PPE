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

// CONNEXION AGENT
router.post('/login/agent', (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ message: 'Email et mot de passe obligatoires.' });
    }

    const sql = 'SELECT * FROM agents WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur.' });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const agent = results[0];

        if (agent.statut !== 'valide') {
            return res.status(403).json({ message: 'Compte en attente de validation par l\'admin.' });
        }

        const motDePasseValide = bcrypt.compareSync(mot_de_passe, agent.mot_de_passe);
        if (!motDePasseValide) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const token = jwt.sign(
            { id: agent.id, email: agent.email, role: agent.use_role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ message: 'Connexion réussie !', token });
    });
});

// INSCRIPTION CLIENT
router.post('/register/client', (req, res) => {
    const { nom, email, mot_de_passe, telephone } = req.body;

    if (!nom || !email || !mot_de_passe) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    const hash = bcrypt.hashSync(mot_de_passe, 10);

    const sql = 'INSERT INTO clients (nom, email, mot_de_passe, telephone) VALUES (?, ?, ?, ?)';
    db.query(sql, [nom, email, hash, telephone], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
            }
            return res.status(500).json({ message: 'Erreur serveur.' });
        }
        res.status(201).json({ message: 'Compte client créé avec succès !' });
    });
});

// CONNEXION CLIENT
router.post('/login/client', (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ message: 'Email et mot de passe obligatoires.' });
    }

    const sql = 'SELECT * FROM clients WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur.' });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const client = results[0];

        const motDePasseValide = bcrypt.compareSync(mot_de_passe, client.mot_de_passe);
        if (!motDePasseValide) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const token = jwt.sign(
            { id: client.id, email: client.email, role: 'client' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ message: 'Connexion réussie !', token });
    });
});

const authMiddleware = require('../middleware/authMiddleware');

// ROUTE PROTEGEE - TEST
router.get('/test-protege', authMiddleware, (req, res) => {
    res.status(200).json({ 
        message: 'Tu as accès !',
        utilisateur: req.user 
    });
});
module.exports = router;