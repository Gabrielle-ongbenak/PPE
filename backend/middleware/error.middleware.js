// Gestionnaire d'erreurs centralisé
const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);

  // Erreurs de validation Multer
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'Fichier trop volumineux. Maximum 5MB.',
        error: 'FILE_TOO_LARGE'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Trop de fichiers. Maximum 10 fichiers.',
        error: 'TOO_MANY_FILES'
      });
    }
    return res.status(400).json({
      message: 'Erreur lors de l\'upload du fichier.',
      error: 'UPLOAD_ERROR'
    });
  }

  // Erreurs de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Erreur de validation',
      errors: err.errors
    });
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token invalide.',
      error: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expiré.',
      error: 'TOKEN_EXPIRED'
    });
  }

  // Erreurs de base de données
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      message: 'Cette ressource existe déjà.',
      error: 'DUPLICATE_ENTRY'
    });
  }

  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({
      message: 'Table de base de données introuvable.',
      error: 'TABLE_NOT_FOUND'
    });
  }

  // Erreur CORS
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      message: 'Origin non autorisée par CORS.',
      error: 'CORS_ERROR'
    });
  }

  // Erreur par défaut
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur serveur interne.';

  res.status(statusCode).json({
    message,
    error: err.error || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Handler pour les routes non trouvées
const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method
  });
};

// Wrapper async pour les routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
