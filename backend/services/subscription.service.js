const { Op } = require('sequelize');
const Abonnement = require('../models/Abonnement');
const Publication = require('../models/Publication');
const { getPlan } = require('../utils/subscriptionPlans');

const getActiveSubscription = async (agentId) => {
  const now = new Date();
  return Abonnement.findOne({
    where: {
      id_agent: agentId,
      statut: 'actif',
      date_fin: { [Op.gt]: now },
    },
    order: [['date_fin', 'DESC']],
  });
};

const canPublish = async (agentId) => {
  const subscription = await getActiveSubscription(agentId);
  if (!subscription) {
    return { allowed: false, reason: 'Aucun abonnement actif.' };
  }

  const plan = getPlan(subscription.plan);
  if (!plan) {
    return { allowed: false, reason: 'Plan d\'abonnement invalide.' };
  }

  const count = await Publication.count({ where: { id_agent: agentId } });
  if (count >= plan.maxListings) {
    return {
      allowed: false,
      reason: `Limite atteinte (${plan.maxListings} annonces pour le plan ${plan.name}).`,
    };
  }

  return { allowed: true, subscription, plan, currentCount: count };
};

module.exports = { getActiveSubscription, canPublish };
