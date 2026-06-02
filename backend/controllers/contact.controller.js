const ContactMessage = require('../models/ContactMessage');
const Publication = require('../models/Publication');
const Agent = require('../models/Agent');
const { sendContactEmail } = require('../services/email.service');

const envoyerMessage = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { visitorName, visitorEmail, visitorPhone, message } = req.body;

    if (!visitorName || !visitorEmail || !message) {
      return res.status(400).json({
        message: 'Nom, email et message sont obligatoires.',
      });
    }

    const property = await Publication.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Logement introuvable.' });
    }

    const agent = await Agent.findByPk(property.id_agent);
    if (!agent || agent.statut !== 'valide') {
      return res.status(404).json({ message: 'Agent non disponible pour ce logement.' });
    }

    const contactMessage = await ContactMessage.create({
      property_id: propertyId,
      agent_id: agent.id,
      visitor_name: visitorName,
      visitor_email: visitorEmail,
      visitor_phone: visitorPhone || null,
      message,
    });

    const propertyTitle = property.titre || `${property.ville} - ${property.quartier}`;

    await sendContactEmail({
      agentEmail: agent.email,
      agentName: agent.nom,
      propertyTitle,
      visitorName,
      visitorEmail,
      visitorPhone,
      message,
    });

    return res.status(201).json({
      message: 'Message envoyé avec succès. L\'agent vous contactera par email.',
      contactMessage,
    });
  } catch (error) {
    console.error('Erreur envoyerMessage:', error.message);
    return res.status(500).json({ message: 'Erreur serveur.', erreur: error.message });
  }
};

module.exports = { envoyerMessage };
