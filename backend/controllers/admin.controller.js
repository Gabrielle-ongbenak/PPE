// controllers/admin.controller.js
// Toutes les actions de l'administrateur

const Agent = require('../models/Agent');
const Publication = require('../models/Publication');

// ─────────────────────────────────────────
// VOIR tous les agents
// GET /api/admin/agents
// ─────────────────────────────────────────
const tousLesAgents = async (req, res) => {
  try {
    const agents = await Agent.findAll({
      where: { use_role: 'agent' },
      order: [['id', 'DESC']],
    });

    return res.status(200).json({
      message: ' Liste des agents',
      total: agents.length,
      agents,
    });
  } catch (error) {
    console.error('Erreur tousLesAgents :', error.message);
    return res.status(500).json({
      message: ' Erreur serveur',
      erreur: error.message,
    });
  }
};

// ─────────────────────────────────────────
// VALIDER un agent
// PUT /api/admin/agents/:id/valider
// ─────────────────────────────────────────
const validerAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findByPk(id);
    if (!agent) {
      return res.status(404).json({ message: ' Agent introuvable' });
    }

    await agent.update({ statut: 'valide' });

    return res.status(200).json({
      message: ' Agent validé avec succès !',
      agent,
    });
  } catch (error) {
    console.error('Erreur validerAgent :', error.message);
    return res.status(500).json({
      message: ' Erreur serveur',
      erreur: error.message,
    });
  }
};

// ─────────────────────────────────────────
// REJETER un agent
// PUT /api/admin/agents/:id/rejeter
// ─────────────────────────────────────────
const rejeterAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findByPk(id);
    if (!agent) {
      return res.status(404).json({ message: ' Agent introuvable' });
    }

    await agent.update({ statut: 'rejete' });

    return res.status(200).json({
      message: ' Agent rejeté !',
      agent,
    });
  } catch (error) {
    console.error('Erreur rejeterAgent :', error.message);
    return res.status(500).json({
      message: ' Erreur serveur',
      erreur: error.message,
    });
  }
};

// ─────────────────────────────────────────
// VOIR tous les logements
// GET /api/admin/logements
// ─────────────────────────────────────────
const tousLesLogements = async (req, res) => {
  try {
    const logements = await Publication.findAll({
      order: [['id', 'DESC']],
    });

    return res.status(200).json({
      message: ' Liste des logements',
      total: logements.length,
      logements,
    });
  } catch (error) {
    console.error('Erreur tousLesLogements :', error.message);
    return res.status(500).json({
      message: ' Erreur serveur',
      erreur: error.message,
    });
  }
};

const tousLesLogementsEnAttente = async (req, res) => {
  try {
    const logements = await Publication.findAll({
      where: { publication_status: 'en_attente' },
      order: [['id', 'DESC']],
    });
    // Mapper pour inclure photos et agent
    const mapped = await Promise.all(logements.map(async (l) => {
      const photos = await Photo.findAll({ where: { publication_id: l.id } });
      const agent = await Agent.findByPk(l.id_agent, { attributes: ['nom', 'nom_agence'] });
      return {
        ...l.toJSON(),
        images: photos.map(p => p.url_media),
        agent_nom: agent?.nom || 'Inconnu',
      };
    }));

    return res.status(200).json({ total: mapped.length, logements: mapped });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', erreur: error.message });
  }
};

// ─────────────────────────────────────────
// SUPPRIMER un logement
// DELETE /api/admin/logements/:id
// ─────────────────────────────────────────
const supprimerLogement = async (req, res) => {
  try {
    const { id } = req.params;

    const logement = await Publication.findByPk(id);
    if (!logement) {
      return res.status(404).json({ message: ' Logement introuvable' });
    }

    await logement.destroy();

    return res.status(200).json({
      message: 'Logement supprimé !',
    });
  } catch (error) {
    console.error('Erreur supprimerLogement :', error.message);
    return res.status(500).json({
      message: ' Erreur serveur',
      erreur: error.message,
    });
  }
};

// ─────────────────────────────────────────
// VALIDER un logement
// PUT /api/admin/logements/:id/valider
// ─────────────────────────────────────────
const validerLogement = async (req, res) => {
  try {
    const { id } = req.params;
    const logement = await Publication.findByPk(id);
    if (!logement) {
      return res.status(404).json({ message: ' Logement introuvable' });
    }
    await logement.update({ publication_status: 'valide' });
    return res.status(200).json({ message: ' Logement validé !', logement });
  } catch (error) {
    console.error('Erreur validerLogement :', error.message);
    return res.status(500).json({ message: ' Erreur serveur', erreur: error.message });
  }
};

// ─────────────────────────────────────────
// REJETER un logement
// PUT /api/admin/logements/:id/rejeter
// ─────────────────────────────────────────
const rejeterLogement = async (req, res) => {
  try {
    const { id } = req.params;
    const logement = await Publication.findByPk(id);
    if (!logement) {
      return res.status(404).json({ message: ' Logement introuvable' });
    }
    await logement.update({ publication_status: 'rejete' });
    return res.status(200).json({ message: ' Logement rejeté !', logement });
  } catch (error) {
    console.error('Erreur rejeterLogement :', error.message);
    return res.status(500).json({ message: ' Erreur serveur', erreur: error.message });
  }
};

// ─────────────────────────────────────────
// STATISTIQUES GLOBALES
// GET /api/admin/stats
// ─────────────────────────────────────────
const statistiques = async (req, res) => {
  try {

    // Nombre total d'agents
    const totalAgents = await Agent.count({
      where: { use_role: 'agent' }
    });

    // Agents en attente de validation
    const agentsEnAttente = await Agent.count({
      where: { statut: 'en_attente' }
    });

    // Agents validés
    const agentsValides = await Agent.count({
      where: { statut: 'valide' }
    });

    // Total logements
    const totalLogements = await Publication.count();

    // Logements disponibles (validés ET dispo)
    const logementsDisponibles = await Publication.count({
      where: { statut: 'disponible', publication_status: 'valide' }
    });

    // Logements occupés
    const logementsOccupes = await Publication.count({
      where: { statut: 'occupe' }
    });

    // Logements en attente de validation
    const logementsEnAttente = await Publication.count({
      where: { publication_status: 'en_attente' }
    });

    // Logements validés (total)
    const logementsValides = await Publication.count({
      where: { publication_status: 'valide' }
    });

    return res.status(200).json({
      message: ' Statistiques globales',
      stats: {
        agents: {
          total: totalAgents,
          en_attente: agentsEnAttente,
          valides: agentsValides,
        },
        logements: {
          total: totalLogements,
          valides: logementsValides,
          en_attente: logementsEnAttente,
          disponibles: logementsDisponibles,
          occupes: logementsOccupes,
        },
      },
    });
  } catch (error) {
    console.error('Erreur statistiques :', error.message);
    return res.status(500).json({
      message: ' Erreur serveur',
      erreur: error.message,
    });
  }
};

module.exports = {
  tousLesAgents,
  validerAgent,
  rejeterAgent,
  tousLesLogements,
  tousLesLogementsEnAttente,
  supprimerLogement,
  validerLogement,
  rejeterLogement,
  statistiques,
};