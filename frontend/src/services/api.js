// frontend/src/services/api.js
// Configuration complète de l'API Logitech

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Ton backend

// ─────────────────────────────────────────
// RÉCUPÉRER LE TOKEN
// ─────────────────────────────────────────
const getToken = () => localStorage.getItem('logitech_token');

// ─────────────────────────────────────────
// REQUÊTE GÉNÉRIQUE
// ─────────────────────────────────────────
const apiRequest = async (path, options = {}, baseUrl = API_BASE) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let url = `${baseUrl}${path}`;
  if (!options.method || options.method === 'GET') {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}_t=${Date.now()}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Erreur API');
  }
  return data;
};

// ─────────────────────────────────────────
// AUTH API
// ─────────────────────────────────────────
export const authApi = {
  // Connexion client
  login: (email, mot_de_passe) =>
    apiRequest('/api/auth/login/client', {
      method: 'POST',
      body: JSON.stringify({ email, mot_de_passe }),
    }),

  // Connexion agent
  loginAgent: (email, mot_de_passe) =>
    apiRequest('/api/auth/login/agent', {
      method: 'POST',
      body: JSON.stringify({ email, mot_de_passe }),
    }),

  // Connexion admin
  loginAdmin: (email, mot_de_passe) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: mot_de_passe }),
    }),

  // Inscription client
  registerClient: (payload) =>
    apiRequest('/api/auth/register/client', {
      method: 'POST',
      body: JSON.stringify({
        nom: payload.name,
        email: payload.email,
        mot_de_passe: payload.password,
        telephone: payload.phone,
      }),
    }),

  // Inscription agent
  registerAgent: (payload) =>
    apiRequest('/api/auth/register/agent', {
      method: 'POST',
      body: JSON.stringify({
        nom: payload.fullName,
        email: payload.email,
        mot_de_passe: payload.password,
        telephone: payload.phone,
        nom_agence: payload.agencyName,
      }),
    }),

  // Profil
  updateProfile: (payload) =>
    apiRequest('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Récupérer infos utilisateur depuis le token
  me: () => apiRequest('/api/auth/me'),
};

// ─────────────────────────────────────────
// PUBLICATIONS API
// ─────────────────────────────────────────
export const propertiesApi = {
  // Rechercher avec filtres
  search: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/publications/recherche?${query}`);
  },

  // Détail d'un logement
  getById: (id) => apiRequest(`/api/publications/${id}`),

  // Mes annonces (agent connecté)
  mine: () => apiRequest('/api/publications/mes-annonces'),

  // Créer une annonce
  create: (payload) =>
    apiRequest('/api/publications', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Upload multipart (for photos)
  uploadPhotos: (id, formData) =>
    fetch(`${API_BASE}/api/publications/${id}/photos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
      body: formData,
    }).then(res => res.json()),

  // Modifier une annonce
  update: (id, payload) =>
    apiRequest(`/api/publications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Supprimer une annonce
  remove: (id) =>
    apiRequest(`/api/publications/${id}`, { method: 'DELETE' }),

  // Changer le statut (disponible/occupe)
  toggleStatut: (id, statut) =>
    apiRequest(`/api/publications/${id}/statut`, {
      method: 'PUT',
      body: JSON.stringify({ statut }),
    }),
};

// ─────────────────────────────────────────
// PHOTOS API
// ─────────────────────────────────────────
export const photosApi = {
  // Voir photos d'un logement
  getByPublication: (id) =>
    apiRequest(`/api/publications/${id}/photos`),

  // Supprimer une photo
  delete: (photoId) =>
    apiRequest(`/api/photos/${photoId}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────
// MESSAGES API
// ─────────────────────────────────────────
export const messagesApi = {
  // Envoyer un message
  send: (payload) =>
    apiRequest('/api/messages', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Voir toutes ses conversations
  getConversations: () => apiRequest('/api/messages'),

  // Voir une conversation
  getMessages: (userId) =>
    apiRequest(`/api/messages/${userId}`),

  // Supprimer un message
  delete: (id) =>
    apiRequest(`/api/messages/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────
// CONTACT API (Prive non-connecté)
// ─────────────────────────────────────────
export const contactApi = {
  send: (propertyId, payload) =>
    apiRequest(`/api/contact/${propertyId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// ─────────────────────────────────────────
// ABONNEMENTS API
// ─────────────────────────────────────────
export const subscriptionApi = {
  // Voir les plans disponibles
  plans: () => apiRequest('/api/subscriptions/plans'),

  // Mon abonnement actif
  mine: () => apiRequest('/api/subscriptions/me'),

  // Demander un abonnement
  request: (plan, referencePaiement) =>
    apiRequest('/api/subscriptions/request', {
      method: 'POST',
      body: JSON.stringify({ plan, referencePaiement }),
    }),
};

// ─────────────────────────────────────────
// ADMIN API
// ─────────────────────────────────────────
export const adminApi = {
  // Statistiques globales
  stats: () => apiRequest('/api/admin/stats'),

  // Liste des agents
  agents: () => apiRequest('/api/admin/agents'),

  // Valider un agent
  validateAgent: (id) =>
    apiRequest(`/api/admin/agents/${id}/valider`, { method: 'PUT' }),

  // Rejeter un agent
  rejectAgent: (id) =>
    apiRequest(`/api/admin/agents/${id}/rejeter`, { method: 'PUT' }),

  // Créer abonnement pour un agent
  createSubscription: (agentId, plan, referencePaiement) =>
    apiRequest(`/api/admin/subscriptions/agents/${agentId}`, {
      method: 'POST',
      body: JSON.stringify({ plan, referencePaiement }),
    }),

  // PUBLICATIONS (LOGEMENTS)
  getPendingPublications: () => apiRequest('/api/admin/logements/en-attente'),
  validerLogement: (id) => apiRequest(`/api/admin/logements/${id}/valider`, { method: 'PUT' }),
  rejeterLogement: (id) => apiRequest(`/api/admin/logements/${id}/rejeter`, { method: 'PUT' }),
};

// ─────────────────────────────────────────
// MAPPER LES DONNÉES API → FORMAT FRONTEND
// ─────────────────────────────────────────
export const mapPropertyFromApi = (p) => ({
  id: p.id,
  title: p.title || p.descriptions || `Logement #${p.id}`,
  type: p.id_type === 2 ? 'Studio' : p.id_type === 3 ? 'Appartement' : 'Chambre',
  price: Number(p.prix),
  currency: 'FCFA',
  location: p.ville,
  region: p.region || '',
  district: p.quartier,
  rating: p.note_avis || p.note || 0,
  reviews: 0,
  bedrooms: p.chambres || 1,
  bathrooms: p.salles_bain || 1,
  area: p.surface_m2 || 0,
  description: p.descriptions || '',
  amenities: p.amenities || ['WiFi', 'Sécurité'],
  images: (p.images && p.images.length > 0) ? p.images : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
  isFavorite: false,
  statut: p.statut,
  landlord: {
    id: p.id_agent || p.agent?.id || 1,
    name: p.agent?.name || p.agent?.nom || 'Agent Logitech',
    phone: p.agent?.phone || p.agent?.telephone || '',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  },
});

// ─────────────────────────────────────────
// ASSISTANT IA API
// ─────────────────────────────────────────
export const aiApi = {
  chat: async (messages) => {
    return apiRequest('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
  },
};