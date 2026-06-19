const { Op } = require('sequelize');
const Agent = require('../models/Agent');
const Abonnement = require('../models/Abonnement');

const getActiveAgentIds = async () => {
  const now = new Date();

  const validAgents = await Agent.findAll({
    where: { statut: 'valide', use_role: 'agent' },
    attributes: ['id'],
  });

  const agentIds = validAgents.map((a) => a.id);
  if (agentIds.length === 0) return [];

  const activeSubscriptions = await Abonnement.findAll({
    where: {
      id_agent: { [Op.in]: agentIds },
      statut: 'actif',
      date_fin: { [Op.gt]: now },
    },
    attributes: ['id_agent'],
  });

  return [...new Set(activeSubscriptions.map((s) => s.id_agent))];
};

module.exports = { getActiveAgentIds };
