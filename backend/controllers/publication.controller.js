const Publication = require('../models/Publication');

// CRÉER une publication
const creerPublication = async (req, res) => {
  try {
    const id_agent = req.user.id;
    const {
      id_type,
      ville,
      quartier,
      adresse_map,
      prix,
      descriptions,
    } = req.body;

    const publication = await Publication.create({
      id_agent,
      id_type: id_type || 1,
      ville,
      quartier,
      adresse_map,
      prix,
      descriptions,
    });

    return res.status(201).json({
      message: 'Logement publié avec succès !',
      publication,
    });
  } catch (error) {
    console.error('Erreur creerPublication :', error.message);
    return res.status(500).json({ message: ' Erreur serveur', erreur: error.message });
  }
};

// VOIR ses publications
const mesPublications = async (req, res) => {
  try {
    const id_agent = req.user.id;
    const publications = await Publication.findAll({
      where: { id_agent },
      order: [['id', 'DESC']],
    });
    return res.status(200).json({
      message: ' Publications récupérées',
      total: publications.length,
      publications,
    });
  } catch (error) {
    console.error('Erreur mesPublications :', error.message);
    return res.status(500).json({ message: ' Erreur serveur', erreur: error.message });
  }
};

// VOIR une publication
const voirPublication = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findByPk(id);
    if (!publication) {
      return res.status(404).json({ message: ' Logement introuvable' });
    }
    return res.status(200).json({ message: ' Logement trouvé', publication });
  } catch (error) {
    console.error('Erreur voirPublication :', error.message);
    return res.status(500).json({ message: ' Erreur serveur', erreur: error.message });
  }
};

// MODIFIER une publication
const modifierPublication = async (req, res) => {
  try {
    const { id } = req.params;
    const id_agent = req.user.id;
    const publication = await Publication.findByPk(id);

    if (!publication) {
      return res.status(404).json({ message: ' Logement introuvable' });
    }
    if (publication.id_agent !== id_agent) {
      return res.status(403).json({ message: ' Action non autorisée' });
    }

    await publication.update(req.body);
    return res.status(200).json({
      message: ' Logement modifié avec succès !',
      publication,
    });
  } catch (error) {
    console.error('Erreur modifierPublication :', error.message);
    return res.status(500).json({ message: ' Erreur serveur', erreur: error.message });
  }
};

// SUPPRIMER une publication
const supprimerPublication = async (req, res) => {
  try {
    const { id } = req.params;
    const id_agent = req.user.id;
    const publication = await Publication.findByPk(id);

    if (!publication) {
      return res.status(404).json({ message: ' Logement introuvable' });
    }
    if (publication.id_agent !== id_agent) {
      return res.status(403).json({ message: ' Action non autorisée' });
    }

    await publication.destroy();
    return res.status(200).json({ message: ' Logement supprimé avec succès !' });
  } catch (error) {
    console.error('Erreur supprimerPublication :', error.message);
    return res.status(500).json({ message: ' Erreur serveur', erreur: error.message });
  }
};

// CHANGER LE STATUT
const changerStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const id_agent = req.user.id;
    const { statut } = req.body;

    const statutsValides = ['disponible', 'occupe'];
    if (!statutsValides.includes(statut)) {
      return res.status(400).json({
        message: ' Statut invalide. Valeurs acceptées : disponible, occupe',
      });
    }

    const publication = await Publication.findByPk(id);
    if (!publication) {
      return res.status(404).json({ message: 'Logement introuvable' });
    }
    if (publication.id_agent !== id_agent) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    await publication.update({ statut });
    return res.status(200).json({
      message: `Statut mis à jour : ${statut}`,
      publication,
    });
  } catch (error) {
    console.error('Erreur changerStatut :', error.message);
    return res.status(500).json({ message: ' Erreur serveur', erreur: error.message });
  }
};
// ─────────────────────────────────────────
// RECHERCHER avec filtres
// Méthode : GET /api/logements/recherche
// ─────────────────────────────────────────
const rechercherLogements = async (req, res) => {
  try {
    const { Op } = require('sequelize');

    // On récupère les filtres envoyés dans l'URL
    const {
      ville,
      quartier,
      type,        // id du type : 1=chambre, 2=studio, 3=appartement
      prix_min,
      prix_max,
      statut,
    } = req.query;

    // On construit les conditions de recherche dynamiquement
    const conditions = {};

    // Filtre par ville (insensible à la casse)
    if (ville) {
      conditions.ville = { [Op.like]: `%${ville}%` };
    }

    // Filtre par quartier
    if (quartier) {
      conditions.quartier = { [Op.like]: `%${quartier}%` };
    }

    // Filtre par type de logement
    if (type) {
      conditions.id_type = type;
    }

    // Filtre par prix minimum
    if (prix_min) {
      conditions.prix = {
        ...conditions.prix,
        [Op.gte]: parseFloat(prix_min), // gte = supérieur ou égal
      };
    }

    // Filtre par prix maximum
    if (prix_max) {
      conditions.prix = {
        ...conditions.prix,
        [Op.lte]: parseFloat(prix_max), // lte = inférieur ou égal
      };
    }

    // Filtre par statut (par défaut on montre que les disponibles)
    conditions.statut = statut || 'disponible';

    // On cherche dans la BD avec les conditions
    const logements = await Publication.findAll({
      where: conditions,
      order: [['id', 'DESC']], // les plus récents en premier
    });

    return res.status(200).json({
      message: 'Résultats de recherche',
      total: logements.length,
      logements,
    });

  } catch (error) {
    console.error('Erreur rechercherLogements :', error.message);
    return res.status(500).json({
      message: ' Erreur serveur',
      erreur: error.message,
    });
  }
};

module.exports = {
  creerPublication,
  mesPublications,
  voirPublication,
  modifierPublication,
  supprimerPublication,
  changerStatut,
  rechercherLogements,
};