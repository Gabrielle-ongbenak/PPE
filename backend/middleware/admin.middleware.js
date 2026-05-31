// middleware/admin.middleware.js
// Vérifie que l'utilisateur connecté est bien un admin

const Agent = require('../models/Agent');

const verifierAdmin = async (req, res, next) => {
  try {
    // On récupère l'ID depuis le token de Tcho
    const id = req.user.id;

    // On cherche l'agent en BD
    const agent = await Agent.findByPk(id);

    // Il n'existe pas
    if (!agent) {
      return res.status(404).json({
        message: ' Utilisateur introuvable',
      });
    }

    // Il n'est pas admin
    // Tcho utilise "role" dans le token
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: ' Accès réservé aux administrateurs',
      });
    }

    // C'est bien un admin → on laisse passer
    next();

  } catch (error) {
    console.error('Erreur verifierAdmin :', error.message);
    return res.status(500).json({
      message: ' Erreur serveur',
      erreur: error.message,
    });
  }
};

module.exports = { verifierAdmin };