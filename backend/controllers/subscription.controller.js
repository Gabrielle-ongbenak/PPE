const Abonnement = require('../models/Abonnement');
const Agent = require('../models/Agent');
const { PLANS, getPlan, isValidPlan } = require('../utils/subscriptionPlans');
const { getActiveSubscription } = require('../services/subscription.service');

const listerPlans = (req, res) => {
  return res.status(200).json({ plans: PLANS });
};

const monAbonnement = async (req, res) => {
  try {
    const subscription = await getActiveSubscription(req.user.id);
    return res.status(200).json({ subscription });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', erreur: error.message });
  }
};

const demanderAbonnement = async (req, res) => {
  try {
    const { plan, referencePaiement } = req.body;
    if (!isValidPlan(plan) || !referencePaiement) {
      return res.status(400).json({
        message: 'Plan (basic, pro, premium) et référence de paiement Mobile Money requis.',
      });
    }

    const planInfo = getPlan(plan);
    const dateFin = new Date();
    dateFin.setDate(dateFin.getDate() + planInfo.durationDays);

    const abonnement = await Abonnement.create({
      id_agent: req.user.id,
      plan,
      date_fin: dateFin,
      montant: planInfo.price,
      statut: 'actif',
      reference_paiement: referencePaiement,
    });

    return res.status(201).json({
      message: 'Demande d\'abonnement enregistrée (validation manuelle du paiement).',
      abonnement,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', erreur: error.message });
  }
};

const listerAbonnementsAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const abonnements = await Abonnement.findAll({
      where: { id_agent: agentId },
      order: [['id', 'DESC']],
    });
    return res.status(200).json({ abonnements });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', erreur: error.message });
  }
};

const activerAbonnement = async (req, res) => {
  try {
    const { id } = req.params;
    const abonnement = await Abonnement.findByPk(id);
    if (!abonnement) {
      return res.status(404).json({ message: 'Abonnement introuvable.' });
    }

    const planInfo = getPlan(abonnement.plan);
    const dateFin = new Date();
    dateFin.setDate(dateFin.getDate() + (planInfo?.durationDays || 30));

    await abonnement.update({ statut: 'actif', date_fin: dateFin });

    return res.status(200).json({
      message: 'Abonnement activé.',
      abonnement,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', erreur: error.message });
  }
};

const creerAbonnementAdmin = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { plan, referencePaiement, montant } = req.body;

    if (!isValidPlan(plan)) {
      return res.status(400).json({ message: 'Plan invalide.' });
    }

    const agent = await Agent.findByPk(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Agent introuvable.' });
    }

    const planInfo = getPlan(plan);
    const dateFin = new Date();
    dateFin.setDate(dateFin.getDate() + planInfo.durationDays);

    const abonnement = await Abonnement.create({
      id_agent: agentId,
      plan,
      date_fin: dateFin,
      montant: montant || planInfo.price,
      statut: 'actif',
      reference_paiement: referencePaiement || `ADMIN-${Date.now()}`,
    });

    return res.status(201).json({
      message: 'Abonnement créé et activé.',
      abonnement,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', erreur: error.message });
  }
};

const expirerAbonnement = async (req, res) => {
  try {
    const { id } = req.params;
    const abonnement = await Abonnement.findByPk(id);
    if (!abonnement) {
      return res.status(404).json({ message: 'Abonnement introuvable.' });
    }
    await abonnement.update({ statut: 'expire' });
    return res.status(200).json({ message: 'Abonnement expiré.', abonnement });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', erreur: error.message });
  }
};

module.exports = {
  listerPlans,
  monAbonnement,
  demanderAbonnement,
  listerAbonnementsAgent,
  activerAbonnement,
  creerAbonnementAdmin,
  expirerAbonnement,
};
