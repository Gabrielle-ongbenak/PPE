const Publication = require('../models/Publication');
const Photo = require('../models/Photo');
const Agent = require('../models/Agent');
const { getActiveAgentIds } = require('../utils/activeAgents');

const mapPublication = async (publication) => {
  const plain = publication.toJSON ? publication.toJSON() : publication;
  const photos = await Photo.findAll({ where: { publication_id: plain.id } });
  const agent = await Agent.findByPk(plain.id_agent, {
    attributes: ['id', 'nom', 'email', 'telephone', 'nom_agence'],
  });
  return {
    ...plain,
    title: plain.titre || `${plain.ville} - ${plain.quartier}`,
    description: plain.descriptions,
    location: plain.ville,
    region: plain.region,
    district: plain.quartier,
    bedrooms: plain.chambres,
    bathrooms: plain.salles_bain,
    area: plain.surface_m2,
    images: photos.map((p) => p.url_media),
    agent: agent ? {
      id: agent.id,
      name: agent.nom,
      email: agent.email,
      phone: agent.telephone,
      agencyName: agent.nom_agence,
    } : null,
  };
};

// CRÉER une publication
const creerPublication = async (req, res) => {
  try {
    const id_agent = req.user.id;
    const {
      titre,
      title,
      id_type,
      ville,
      quartier,
      region,
      adresse_map,
      prix,
      descriptions,
      description,
      chambres,
      salles_bain,
      surface_m2,
    } = req.body;

    const publication = await Publication.create({
      id_agent,
      titre: titre || title,
      id_type: id_type || 1,
      ville,
      quartier,
      region,
      adresse_map,
      prix,
      descriptions: descriptions || description,
      chambres: chambres || 1,
      salles_bain: salles_bain || 1,
      surface_m2,
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

    const activeAgentIds = await getActiveAgentIds();
    if (!activeAgentIds.includes(publication.id_agent)) {
      return res.status(404).json({ message: ' Logement non disponible' });
    }

    const mapped = await mapPublication(publication);
    return res.status(200).json({ message: ' Logement trouvé', publication: mapped });
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

    if (req.query.region) {
      conditions.region = { [Op.like]: `%${req.query.region}%` };
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

    const activeAgentIds = await getActiveAgentIds();
    if (activeAgentIds.length === 0) {
      return res.status(200).json({
        message: 'Résultats de recherche',
        total: 0,
        logements: [],
      });
    }
    conditions.id_agent = { [Op.in]: activeAgentIds };

    const logements = await Publication.findAll({
      where: conditions,
      order: [['id', 'DESC']],
    });

    const mapped = await Promise.all(logements.map((l) => mapPublication(l)));

    return res.status(200).json({
      message: 'Résultats de recherche',
      total: mapped.length,
      logements: mapped,
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