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

    // Logements disponibles
    const logementsDisponibles = await Publication.count({
      where: { statut: 'disponible' }
    });

    // Logements occupés
    const logementsOccupes = await Publication.count({
      where: { statut: 'occupe' }
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
  supprimerLogement,
  statistiques,
};