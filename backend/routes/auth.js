const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth.middleware');

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

// Inscription agent (cahier des charges: register)
router.post('/register', (req, res) => {
  const {
    fullName,
    nom,
    email,
    password,
    mot_de_passe,
    phone,
    telephone,
    agencyName,
    nom_agence,
  } = req.body;

  const agentName = fullName || nom;
  const agentPassword = password || mot_de_passe;
  const agentPhone = phone || telephone;
  const agentAgency = agencyName || nom_agence || null;

  if (!agentName || !email || !agentPassword || !agentPhone) {
    return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
  }

  const hash = bcrypt.hashSync(agentPassword, 10);
  const sql =
    'INSERT INTO agents (nom, email, mot_de_passe, telephone, nom_agence, use_role, statut) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(
    sql,
    [agentName, email, hash, agentPhone, agentAgency, 'agent', 'en_attente'],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }
        return res.status(500).json({ message: 'Erreur serveur.', erreur: err.message });
      }
      return res.status(201).json({
        message: 'Inscription réussie. Votre compte est en attente de validation par l\'administrateur.',
      });
    }
  );
});

router.post('/register/agent', (req, res) => {
  req.body.fullName = req.body.fullName || req.body.nom;
  req.body.password = req.body.password || req.body.mot_de_passe;
  req.body.phone = req.body.phone || req.body.telephone;
  req.body.agencyName = req.body.agencyName || req.body.nom_agence;
  const {
    fullName,
    nom,
    email,
    password,
    mot_de_passe,
    phone,
    telephone,
    agencyName,
    nom_agence,
  } = req.body;
  const agentName = fullName || nom;
  const agentPassword = password || mot_de_passe;
  const agentPhone = phone || telephone;
  const agentAgency = agencyName || nom_agence || null;
  if (!agentName || !email || !agentPassword || !agentPhone) {
    return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
  }
  const hash = bcrypt.hashSync(agentPassword, 10);
  const sql =
    'INSERT INTO agents (nom, email, mot_de_passe, telephone, nom_agence, use_role, statut) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [agentName, email, hash, agentPhone, agentAgency, 'agent', 'en_attente'], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }
      return res.status(500).json({ message: 'Erreur serveur.', erreur: err.message });
    }
    return res.status(201).json({
      message: 'Inscription agent réussie. En attente de validation.',
    });
  });
});

// Connexion unifiée agent/admin
router.post('/login', (req, res) => {
  const { email, password, mot_de_passe } = req.body;
  const pwd = password || mot_de_passe;

  if (!email || !pwd) {
    return res.status(400).json({ message: 'Email et mot de passe obligatoires.' });
  }

  const sql = 'SELECT * FROM agents WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur.' });
    if (results.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const agent = results[0];
    if (agent.statut === 'rejete') {
      return res.status(403).json({ message: 'Compte rejeté par l\'administrateur.' });
    }

    const valid = bcrypt.compareSync(pwd, agent.mot_de_passe);
    if (!valid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const token = signToken({
      id: agent.id,
      email: agent.email,
      role: agent.use_role,
    });

    return res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: agent.id,
        fullName: agent.nom,
        email: agent.email,
        phone: agent.telephone,
        agencyName: agent.nom_agence,
        role: agent.use_role,
        status: agent.statut,
      },
    });
  });
});

router.post('/login/agent', (req, res) => {
  const { email, mot_de_passe, password } = req.body;
  const pwd = mot_de_passe || password;

  if (!email || !pwd) {
    return res.status(400).json({ message: 'Email et mot de passe obligatoires.' });
  }

  const sql = 'SELECT * FROM agents WHERE email = ? AND use_role = ?';
  db.query(sql, [email, 'agent'], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur.' });
    if (results.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const agent = results[0];
    if (agent.statut !== 'valide') {
      return res.status(403).json({
        message: 'Compte en attente de validation ou non approuvé.',
        status: agent.statut,
      });
    }

    const valid = bcrypt.compareSync(pwd, agent.mot_de_passe);
    if (!valid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const token = signToken({ id: agent.id, email: agent.email, role: 'agent' });
    return res.status(200).json({ message: 'Connexion réussie.', token, role: 'agent' });
  });
});

router.get('/me', authMiddleware, (req, res) => {
  const sql = 'SELECT id, nom, email, telephone, nom_agence, statut, use_role FROM agents WHERE id = ?';
  db.query(sql, [req.user.id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }
    const u = results[0];
    return res.status(200).json({
      user: {
        id: u.id,
        fullName: u.nom,
        email: u.email,
        phone: u.telephone,
        agencyName: u.nom_agence,
        role: u.use_role,
        status: u.statut,
      },
    });
  });
});

router.get('/test-protege', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Accès autorisé.', utilisateur: req.user });
});

module.exports = router;
