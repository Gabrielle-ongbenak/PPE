const API_BASE = import.meta.env.VITE_API_URL || '';

const getToken = () => localStorage.getItem('logicam_token');

export const apiRequest = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Erreur API');
  }
  return data;
};

export const authApi = {
  login: (email, password) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  loginAgent: (email, mot_de_passe) =>
    apiRequest('/api/auth/login/agent', {
      method: 'POST',
      body: JSON.stringify({ email, mot_de_passe }),
    }),
  registerAgent: (payload) =>
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  me: () => apiRequest('/api/auth/me'),
};

export const propertiesApi = {
  search: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/publications/recherche?${query}`);
  },
  getById: (id) => apiRequest(`/api/publications/${id}`),
  mine: () => apiRequest('/api/publications/mes-annonces'),
  create: (payload) =>
    apiRequest('/api/publications', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    apiRequest(`/api/publications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  toggleStatut: (id, statut) =>
    apiRequest(`/api/publications/${id}/statut`, {
      method: 'PUT',
      body: JSON.stringify({ statut }),
    }),
  remove: (id) =>
    apiRequest(`/api/publications/${id}`, { method: 'DELETE' }),
};

export const contactApi = {
  send: (propertyId, payload) =>
    apiRequest(`/api/contact/${propertyId}`, {
      method: 'POST',
      body: JSON.stringify({
        visitorName: payload.visitorName,
        visitorEmail: payload.visitorEmail,
        visitorPhone: payload.visitorPhone,
        message: payload.message,
      }),
    }),
};

export const subscriptionApi = {
  plans: () => apiRequest('/api/subscriptions/plans'),
  mine: () => apiRequest('/api/subscriptions/me'),
  request: (plan, referencePaiement) =>
    apiRequest('/api/subscriptions/request', {
      method: 'POST',
      body: JSON.stringify({ plan, referencePaiement }),
    }),
};

export const adminApi = {
  stats: () => apiRequest('/api/admin/stats'),
  agents: () => apiRequest('/api/admin/agents'),
  validateAgent: (id) =>
    apiRequest(`/api/admin/agents/${id}/valider`, { method: 'PUT' }),
  rejectAgent: (id) =>
    apiRequest(`/api/admin/agents/${id}/rejeter`, { method: 'PUT' }),
  createSubscription: (agentId, plan, referencePaiement) =>
    apiRequest(`/api/admin/subscriptions/agents/${agentId}`, {
      method: 'POST',
      body: JSON.stringify({ plan, referencePaiement }),
    }),
};

export const messagesApi = {
  getConversations: async () => {
    const res = await apiRequest('/api/messages');
    return { conversations: res.messages || [] };
  },
  getMessages: (userId) => apiRequest(`/api/messages/${userId}`),
  send: (userId, text) =>
    apiRequest('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ destinataire_id: userId, contenu: text }),
    }),
};

export const mapPropertyFromApi = (p) => ({
  id: p.id,
  title: p.title || p.titre || `Logement #${p.id}`,
  type: p.id_type === 2 ? 'Studio' : p.id_type === 3 ? 'Appartement' : 'Chambre',
  price: Number(p.prix),
  currency: 'FCFA',
  location: p.location || p.ville,
  region: p.region || '',
  district: p.district || p.quartier,
  rating: 4.5,
  reviews: 0,
  bedrooms: p.bedrooms || p.chambres || 1,
  bathrooms: p.bathrooms || p.salles_bain || 1,
  area: p.area || p.surface_m2 || 0,
  description: p.description || p.descriptions || '',
  amenities: ['WiFi', 'Sécurité'],
  images: (p.images && p.images.length > 0)
    ? p.images
    : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
  isFavorite: false,
  landlord: p.agent
    ? {
        name: p.agent.name,
        email: p.agent.email,
        phone: p.agent.phone,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      }
    : { name: 'Agent', phone: '', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
});
