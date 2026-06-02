import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { propertiesApi, subscriptionApi } from '../services/api';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Home, MapPin, Tag } from 'lucide-react';

const AgentDashboard = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Forms
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    titre: '', ville: '', quartier: '', region: '', prix: '', descriptions: '', chambres: 1, salles_bain: 1, surface_m2: '',
  });

  const load = async () => {
    try {
      setLoading(true);
      const [mine, sub] = await Promise.all([
        propertiesApi.mine(),
        subscriptionApi.mine().catch(() => ({ subscription: null })),
      ]);
      setListings(mine.publications || []);
      setSubscription(sub.subscription);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'agent') {
      navigate('/agent/login');
      return;
    }
    load();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        prix: Number(form.prix),
        chambres: Number(form.chambres),
        salles_bain: Number(form.salles_bain),
        surface_m2: Number(form.surface_m2),
        id_type: 3, // Default to appartement for now, can be improved
      };

      if (editingId) {
        await propertiesApi.update(editingId, payload);
      } else {
        await propertiesApi.create(payload);
      }
      
      setForm({ titre: '', ville: '', quartier: '', region: '', prix: '', descriptions: '', chambres: 1, salles_bain: 1, surface_m2: '' });
      setEditingId(null);
      setIsAdding(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (l) => {
    setForm({
      titre: l.titre || '',
      ville: l.ville || '',
      quartier: l.quartier || '',
      region: l.region || '',
      prix: l.prix || '',
      descriptions: l.descriptions || '',
      chambres: l.chambres || 1,
      salles_bain: l.salles_bain || 1,
      surface_m2: l.surface_m2 || '',
    });
    setEditingId(l.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
      try {
        await propertiesApi.remove(id);
        load();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleToggleStatut = async (id, currentStatut) => {
    try {
      const newStatut = currentStatut === 'disponible' ? 'occupe' : 'disponible';
      await propertiesApi.toggleStatut(id, newStatut);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px', background: theme.background, color: theme.text, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 'bold' }}>Dashboard Agent</h1>
          <p style={{ margin: '4px 0 0', color: theme.secondaryText }}>Bienvenue, {user?.fullName}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={() => { setIsAdding(!isAdding); if(!isAdding) { setEditingId(null); setForm({titre: '', ville: '', quartier: '', region: '', prix: '', descriptions: '', chambres: 1, salles_bain: 1, surface_m2: ''}); } }} 
            style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: theme.primary, color: '#fff', padding: '10px 20px', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            {isAdding ? 'Annuler' : <><Plus size={20} /> Nouvelle annonce</>}
          </button>
          <button onClick={() => { logout(); navigate('/agent/login'); }} style={{ border: `1px solid ${theme.border}`, background: theme.surface, color: theme.text, padding: '10px 20px', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}>Déconnexion</button>
        </div>
      </div>

      {error && <p style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: 12, borderRadius: 8, marginBottom: 20 }}>{error}</p>}

      {isAdding && (
        <section style={{ marginBottom: 32, padding: 24, borderRadius: 16, background: theme.surface, border: `1px solid ${theme.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: 20 }}>{editingId ? 'Modifier l\'annonce' : 'Créer une nouvelle annonce'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: 13, color: theme.secondaryText, marginBottom: 4 }}>Titre de l'annonce</label>
              <input placeholder="Ex: Bel appartement au centre-ville" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} required style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.background, color: theme.text }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: theme.secondaryText, marginBottom: 4 }}>Ville</label>
              <input placeholder="Ville" value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} required style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.background, color: theme.text }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: theme.secondaryText, marginBottom: 4 }}>Quartier</label>
              <input placeholder="Quartier" value={form.quartier} onChange={(e) => setForm({ ...form, quartier: e.target.value })} required style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.background, color: theme.text }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: theme.secondaryText, marginBottom: 4 }}>Prix (FCFA)</label>
              <input type="number" placeholder="Prix" value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} required style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.background, color: theme.text }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: theme.secondaryText, marginBottom: 4 }}>Surface (m²)</label>
              <input type="number" placeholder="Surface" value={form.surface_m2} onChange={(e) => setForm({ ...form, surface_m2: e.target.value })} style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.background, color: theme.text }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: 13, color: theme.secondaryText, marginBottom: 4 }}>Description</label>
              <textarea placeholder="Décrivez le logement..." value={form.descriptions} onChange={(e) => setForm({ ...form, descriptions: e.target.value })} required style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.background, color: theme.text, minHeight: 100 }} />
            </div>
            <button type="submit" style={{ gridColumn: 'span 2', padding: 14, border: 'none', borderRadius: 12, background: theme.primary, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 16 }}>
              {editingId ? 'Mettre à jour' : 'Publier l\'annonce'}
            </button>
          </form>
        </section>
      )}

      {/* Stats / Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        <div style={{ padding: 20, borderRadius: 16, background: theme.surface, border: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 14, color: theme.secondaryText, marginBottom: 4 }}>Statut du compte</div>
          <div style={{ fontSize: 18, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
            {user?.status === 'valide' ? <><CheckCircle size={20} color="#10b981" /> Certifié</> : <><XCircle size={20} color="#f59e0b" /> En attente</>}
          </div>
        </div>
        <div style={{ padding: 20, borderRadius: 16, background: theme.surface, border: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 14, color: theme.secondaryText, marginBottom: 4 }}>Abonnement</div>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>
            {subscription ? <span style={{ color: theme.primary }}>Plan {subscription.plan.toUpperCase()}</span> : 'Aucun plan actif'}
          </div>
        </div>
      </div>

      <section>
        <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><Home size={22} /> Mes annonces ({listings.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {listings.map((l) => (
            <div key={l.id} style={{ borderRadius: 16, overflow: 'hidden', background: theme.surface, border: `1px solid ${theme.border}`, transition: 'transform 0.2s' }}>
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, fontSize: 17, fontWeight: '600' }}>{l.titre || l.ville}</h4>
                  <span style={{ fontSize: 12, padding: '4px 8px', borderRadius: 8, background: l.statut === 'disponible' ? '#dcfce7' : '#fee2e2', color: l.statut === 'disponible' ? '#166534' : '#991b1b', fontWeight: 600 }}>
                    {l.statut.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, color: theme.secondaryText, fontSize: 14, marginBottom: 16 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {l.ville}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Tag size={14} /> {l.prix} FCFA</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => handleEdit(l)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.background, color: theme.text, cursor: 'pointer' }}>
                    <Edit2 size={16} /> Éditer
                  </button>
                  <button onClick={() => handleToggleStatut(l.id, l.statut)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.background, color: theme.text, cursor: 'pointer' }}>
                    {l.statut === 'disponible' ? 'Marquer Loué' : 'Marquer Dispo'}
                  </button>
                  <button onClick={() => handleDelete(l.id)} style={{ width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, border: 'none', background: '#fee2e2', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {listings.length === 0 && !loading && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: theme.secondaryText }}>
              Vous n'avez pas encore d'annonces. Cliquez sur "Nouvelle annonce" pour commencer.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AgentDashboard;
