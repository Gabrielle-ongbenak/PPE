const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // 1. Récupérer le token dans le header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  // 2. Si pas de token → accès refusé
  if (!token) {
    return res.status(401).json({ 
      message: 'Accès refusé. Token manquant.',
      error: 'NO_TOKEN'
    });
  }

  // 3. Vérifier que le token est valide
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier que le token a les champs requis
    if (!decoded.id || !decoded.email || !decoded.role) {
      return res.status(401).json({ 
        message: 'Token invalide. Champs manquants.',
        error: 'INVALID_TOKEN_FORMAT'
      });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expiré. Veuillez vous reconnecter.',
        error: 'TOKEN_EXPIRED'
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Token invalide.',
        error: 'INVALID_TOKEN'
      });
    }
    return res.status(401).json({ 
      message: 'Erreur d\'authentification.',
      error: 'AUTH_ERROR'
    });
  }
};

module.exports = authMiddleware;