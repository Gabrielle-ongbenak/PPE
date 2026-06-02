const PLANS = {
  basic: { name: 'Basic', maxListings: 5, durationDays: 30, price: 5000 },
  pro: { name: 'Pro', maxListings: 15, durationDays: 30, price: 15000 },
  premium: { name: 'Premium', maxListings: 999, durationDays: 30, price: 30000 },
};

const getPlan = (planKey) => PLANS[planKey] || null;

const isValidPlan = (planKey) => Boolean(PLANS[planKey]);

module.exports = { PLANS, getPlan, isValidPlan };
