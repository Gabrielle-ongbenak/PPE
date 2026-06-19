const { body, validationResult } = require('express-validator');

// Middleware de validation générique
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Erreur de validation',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Middleware pour normaliser les champs d'inscription (FR <-> EN)
 * Le frontend envoie 'password', le backend mappe vers 'mot_de_passe' pour la DB.
 */
const normalizeRegistrationFields = (req, res, next) => {
  if (req.body) {
    req.body.nom = req.body.nom || req.body.fullName || req.body.name;
    req.body.password = req.body.password || req.body.mot_de_passe;
    req.body.mot_de_passe = req.body.password;
    req.body.telephone = req.body.telephone || req.body.phone;
    req.body.nom_agence = req.body.nom_agence || req.body.agencyName;
  }
  next();
};

// Validation pour l'inscription
const registerValidation = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 255 }).withMessage('Le nom doit contenir entre 2 et 255 caractères')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('telephone')
    .trim()
    .notEmpty().withMessage('Le téléphone est requis')
    .isMobilePhone('any', { strict: false }).withMessage('Numéro de téléphone invalide'),
  validateRequest
];

// Validation pour la connexion
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty().withMessage('Le mot de passe est requis'),
  validateRequest
];

// Validation pour la création de publication
const publicationValidation = [
  body('titre')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Le titre ne doit pas dépasser 255 caractères')
    .escape(),
  body('ville')
    .trim()
    .notEmpty().withMessage('La ville est requise')
    .isLength({ max: 60 }).withMessage('La ville ne doit pas dépasser 60 caractères')
    .escape(),
  body('quartier')
    .trim()
    .notEmpty().withMessage('Le quartier est requis')
    .isLength({ max: 60 }).withMessage('Le quartier ne doit pas dépasser 60 caractères')
    .escape(),
  body('prix')
    .notEmpty().withMessage('Le prix est requis')
    .isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('chambres')
    .optional()
    .isInt({ min: 0 }).withMessage('Le nombre de chambres doit être un entier positif'),
  body('salles_bain')
    .optional()
    .isInt({ min: 0 }).withMessage('Le nombre de salles de bain doit être un entier positif'),
  body('surface_m2')
    .optional()
    .isFloat({ min: 0 }).withMessage('La surface doit être un nombre positif'),
  validateRequest
];

module.exports = {
  validateRequest,
  registerValidation,
  loginValidation,
  publicationValidation,
  normalizeRegistrationFields
};
