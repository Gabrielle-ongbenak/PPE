// controllers/message.controller.js
const Message = require('../models/Message');
const sequelize = require('../config/database');

// ─────────────────────────────────────────
// ENVOYER un message
// POST /api/messages
// ─────────────────────────────────────────
const envoyerMessage = async (req, res) => {
  try {
    const {
      destinataire_id,
      destinataire_type,
      logement_id,
      contenu
    } = req.body;

    const expediteur_id = req.user.id;
    const expediteur_type = req.user.role;

    if (!contenu) {
      return res.status(400).json({
        message: ' Le message ne peut pas être vide',
      });
    }

    const message = await Message.create({
      expediteur_id,
      expediteur_type,
      destinataire_id,
      destinataire_type,
      logement_id,
      contenu,
    });

    // Récupérer le nom de l'expéditeur
    const nomExpediteur = await getNom(expediteur_id, expediteur_type);

    return res.status(201).json({
      message: ' Message envoyé !',
      data: {
        ...message.dataValues,
        expediteur_nom: nomExpediteur,
      },
    });

  } catch (error) {
    console.error('Erreur envoyerMessage :', error.message);
    return res.status(500).json({
      message: ' Erreur serveur',
      erreur: error.message,
    });
  }
};

// ─────────────────────────────────────────
// FONCTION UTILITAIRE
// Récupérer le nom selon le type
// ─────────────────────────────────────────
const getNom = async (id, type) => {
  try {
    const table = type === 'agent' ? 'agents' : 'clients';
    const [results] = await sequelize.query(
      `SELECT nom FROM ${table} WHERE id = ${id}`
    );
    return results.length > 0 ? results[0].nom : 'Inconnu';
  } catch (error) {
    return 'Inconnu';
  }
};

// ─────────────────────────────────────────
// VOIR ses conversations
// GET /api/messages
// ─────────────────────────────────────────
const mesConversations = async (req, res) => {
  try {
    const id = req.user.id;
    const role = req.user.role;
    const { Op } = require('sequelize');

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { expediteur_id: id, expediteur_type: role },
          { destinataire_id: id, destinataire_type: role },
        ],
      },
      order: [['id', 'DESC']],
    });

    // Ajouter le nom de l'expéditeur pour chaque message
    const messagesAvecNoms = await Promise.all(
      messages.map(async (msg) => {
        const nom = await getNom(msg.expediteur_id, msg.expediteur_type);
        return {
          ...msg.dataValues,
          expediteur_nom: nom,
        };
      })
    );

    return res.status(200).json({
      message: 'Conversations récupérées',
      total: messages.length,
      messages: messagesAvecNoms,
    });

  } catch (error) {
    console.error('Erreur mesConversations :', error.message);
    return res.status(500).json({
      message: ' Erreur serveur',
      erreur: error.message,
    });
  }
};

// ─────────────────────────────────────────
// VOIR une conversation
// GET /api/messages/:userId
// ─────────────────────────────────────────
const voirConversation = async (req, res) => {
  try {
    const moi_id = req.user.id;
    const moi_role = req.user.role;
    const { userId } = req.params;
    const { Op } = require('sequelize');

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { expediteur_id: moi_id, destinataire_id: userId },
          { expediteur_id: userId, destinataire_id: moi_id },
        ],
      },
      order: [['id', 'ASC']],
    });

    // Marquer les messages reçus comme lus
    await Message.update(
      { est_lu: true },
      {
        where: {
          destinataire_id: moi_id,
          destinataire_type: moi_role,
          est_lu: false,
        },
      }
    );

    // Ajouter le nom de l'expéditeur pour chaque message
    const messagesAvecNoms = await Promise.all(
      messages.map(async (msg) => {
        const nom = await getNom(msg.expediteur_id, msg.expediteur_type);
        return {
          ...msg.dataValues,
          expediteur_nom: nom,
        };
      })
    );

    return res.status(200).json({
      message: ' Conversation récupérée',
      total: messages.length,
      messages: messagesAvecNoms,
    });

  } catch (error) {
    console.error('Erreur voirConversation :', error.message);
    return res.status(500).json({
      message: ' Erreur serveur',
      erreur: error.message,
    });
  }
};

// ─────────────────────────────────────────
// MARQUER un message comme lu
// PUT /api/messages/:id/lu
// ─────────────────────────────────────────
const marquerLu = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ message: ' Message introuvable' });
    }

    await message.update({ est_lu: true });

    return res.status(200).json({
      message: ' Message marqué comme lu',
    });

  } catch (error) {
    console.error('Erreur marquerLu :', error.message);
    return res.status(500).json({
      message: ' Erreur serveur',
      erreur: error.message,
    });
  }
};

// ─────────────────────────────────────────
// SUPPRIMER un message
// DELETE /api/messages/:id
// ─────────────────────────────────────────
const supprimerMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const expediteur_id = req.user.id;

    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({ message: ' Message introuvable' });
    }

    // Seul l'expéditeur peut supprimer son message
    if (message.expediteur_id !== expediteur_id) {
      return res.status(403).json({
        message: ' Vous ne pouvez supprimer que vos propres messages',
      });
    }

    await message.destroy();

    return res.status(200).json({
      message: ' Message supprimé !',
    });

  } catch (error) {
    console.error('Erreur supprimerMessage :', error.message);
    return res.status(500).json({
      message: ' Erreur serveur',
      erreur: error.message,
    });
  }
};

module.exports = {
  envoyerMessage,
  mesConversations,
  voirConversation,
  marquerLu,
  supprimerMessage,
};