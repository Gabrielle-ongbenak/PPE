const Agent = require('../models/Agent');

const verifierAgent = async (req, res, next) => {
  if (!req.user || (req.user.role !== 'agent' && req.user.role !== 'admin')) {
    return res.status(403).json({ message: 'Accès réservé aux agents immobiliers.' });
  }

  if (req.user.role === 'admin') {
    return next();
  }

  try {
    const agent = await Agent.findByPk(req.user.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent introuvable.' });
    }
    if (agent.statut !== 'valide') {
      return res.status(403).json({
        message: 'Compte non approuvé. En attente de validation par l\'administrateur.',
      });
    }
    req.agent = agent;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', erreur: error.message });
  }
};

module.exports = { verifierAgent };
