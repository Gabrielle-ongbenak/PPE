const { canPublish } = require('../services/subscription.service');

const verifierAbonnementActif = async (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }

  try {
    const result = await canPublish(req.user.id);
    if (!result.allowed) {
      return res.status(403).json({ message: result.reason });
    }
    req.subscription = result.subscription;
    req.plan = result.plan;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', erreur: error.message });
  }
};

module.exports = { verifierAbonnementActif };
