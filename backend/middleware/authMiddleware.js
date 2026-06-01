const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {

    // 1. Récupérer le token dans le header
    const token = req.headers['authorization']?.split(' ')[1];

    // 2. Si pas de token → accès refusé
    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    // 3. Vérifier que le token est valide
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // on attache l'utilisateur à la requête
        next();             // ✅ tout bon → on laisse passer
    } catch (err) {
        res.status(401).json({ message: 'Token invalide ou expiré.' });
    }
};

module.exports = authMiddleware;