const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth.middleware');
const { registerValidation, loginValidation, normalizeRegistrationFields } = require('../middleware/validation.middleware');
const { uploadAgentPhoto } = require('../config/cloudinary');

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

// Helper function pour normaliser les champs
const normalizeFields = (body) => ({
  name: body.fullName || body.nom,
  email: body.email,
  password: body.password || body.mot_de_passe,
  phone: body.phone || body.telephone,
  agencyName: body.agencyName || body.nom_agence,
});

// Helper function pour créer un utilisateur
const createUser = (table, data, res) => {
  const hash = bcrypt.hashSync(data.password, 12);
  const sql = table === 'agents'
    ? 'INSERT INTO agents (nom, email, mot_de_passe, telephone, nom_agence, use_role, statut) VALUES (?, ?, ?, ?, ?, ?, ?)'
    : 'INSERT INTO clients (nom, email, mot_de_passe, telephone) VALUES (?, ?, ?, ?)';

  const params = table === 'agents'
    ? [data.name, data.email, hash, data.phone, data.agencyName || null, data.role || 'agent', 'en_attente']
    : [data.name, data.email, hash, data.phone];

  db.query(sql, params, (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }
      return res.status(500).json({ message: 'Erreur serveur.', erreur: err.message });
    }
    const message = table === 'agents'
      ? 'Inscription réussie. Votre compte est en attente de validation par l\'administrateur.'
      : 'Inscription client réussie.';
    return res.status(201).json({ message });
  });
};

// Inscription agent (route unifiée)
router.post('/register/agent', normalizeRegistrationFields, registerValidation, (req, res) => {
  const normalized = normalizeFields(req.body);
  normalized.role = 'agent';
  createUser('agents', normalized, res);
});

// Inscription client
router.post('/register/client', normalizeRegistrationFields, registerValidation, (req, res) => {
  const normalized = normalizeFields(req.body);
  createUser('clients', normalized, res);
});

// Helper function pour la connexion
const loginUser = (table, email, password, roleFilter, res) => {
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis.' });
  }

  const sql = roleFilter
    ? `SELECT * FROM ${table} WHERE email = ? AND use_role = ?`
    : `SELECT * FROM ${table} WHERE email = ?`;

  const params = roleFilter ? [email, roleFilter] : [email];

  db.query(sql, params, (err, results) => {
    if (res.headersSent) return;

    if (err) {
      console.error('[Auth] Erreur SQL login:', err.message);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const user = results[0];

    // Vérifier le statut pour les agents
    if (table === 'agents' && user.statut === 'rejete') {
      return res.status(403).json({ message: 'Compte rejeté par l\'administrateur.' });
    }

    const valid = bcrypt.compareSync(password, user.mot_de_passe);
    if (!valid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: table === 'clients' ? 'client' : user.use_role,
    });

    const userData = table === 'clients'
      ? {
        id: user.id,
        fullName: user.nom,
        email: user.email,
        phone: user.telephone,
        role: 'client',
      }
      : {
        id: user.id,
        fullName: user.nom,
        email: user.email,
        phone: user.telephone,
        agencyName: user.nom_agence,
        role: user.use_role,
        status: user.statut,
      };

    return res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: userData,
    });
  });
};

// Connexion unifiée agent/admin
router.post('/login', loginValidation, (req, res) => {
  const { email, password } = req.body;
  loginUser('agents', email, password, null, res);
});

// Connexion agent spécifique
router.post('/login/agent', loginValidation, (req, res) => {
  const { email, password } = req.body;
  loginUser('agents', email, password, 'agent', res);
});

// Connexion client
router.post('/login/client', loginValidation, (req, res) => {
  const { email, password } = req.body;
  loginUser('clients', email, password, null, res);
});

router.get('/me', authMiddleware, (req, res) => {
  if (req.user.role === 'client') {
    const sql = 'SELECT id, nom, email, telephone FROM clients WHERE id = ?';
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
          role: 'client',
        },
      });
    });
  } else {
    const sql = 'SELECT id, nom, email, telephone, nom_agence, photo_url, statut, use_role FROM agents WHERE id = ?';
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
          photoUrl: u.photo_url,
          role: u.use_role,
          status: u.statut,
        },
      });
    });
  }
});

router.put('/profile', authMiddleware, (req, res) => {
  const { fullName, phone, agencyName, password } = req.body;
  const table = req.user.role === 'client' ? 'clients' : 'agents';

  let sql = `UPDATE ${table} SET nom = ?, telephone = ?`;
  const params = [fullName, phone];

  if (req.user.role === 'agent') {
    sql += ', nom_agence = ?';
    params.push(agencyName);
  }

  if (password) {
    sql += ', mot_de_passe = ?';
    params.push(bcrypt.hashSync(password, 12));
  }

  sql += ' WHERE id = ?';
  params.push(req.user.id);

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la mise à jour du profil.' });
    return res.status(200).json({ message: 'Profil mis à jour avec succès.' });
  });
});

router.get('/test-protege', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Accès autorisé.', utilisateur: req.user });
});

// Upload photo de profil agent
router.post('/photo', authMiddleware, (req, res) => {
  uploadAgentPhoto.single('photo')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier envoyé.' });
    }

    const photoUrl = req.file.path;
    const table = req.user.role === 'client' ? 'clients' : 'agents';
    const sql = `UPDATE ${table} SET photo_url = ? WHERE id = ?`;

    db.query(sql, [photoUrl, req.user.id], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de la sauvegarde de la photo.' });
      }
      return res.status(200).json({
        message: 'Photo de profil mise à jour.',
        photo_url: photoUrl,
      });
    });
  });
});

module.exports = router;
