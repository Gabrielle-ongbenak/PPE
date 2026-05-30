// TEMPORAIRE — à remplacer par le vrai middleware JWT
const verifierToken = (req, res, next) => {
  req.user = { id: 1 }; // agent simulé
  next();
};

module.exports = { verifierToken };