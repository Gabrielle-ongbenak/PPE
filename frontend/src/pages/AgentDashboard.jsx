import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { propertiesApi, subscriptionApi } from '../services/api';

const AgentDashboard = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [form, setForm] = useState({
    titre: '', ville: '', quartier: '', region: '', prix: '', descriptions: '', chambres: 1, salles_bain: 1,
  });
  const [subForm, setSubForm] = useState({ plan: 'basic', referencePaiement: '' });
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [mine, sub] = await Promise.all([
        propertiesApi.mine(),
        subscriptionApi.mine().catch(() => ({ subscription: null })),
      ]);
      setListings(mine.publications || []);
      setSubscription(sub.subscription);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'agent') {
      navigate('/agent/login');
      return;
    }
    load();
  }, [user, navigate]);

  const createListing = async (e) => {
    e.preventDefault();
    try {
      await propertiesApi.create({
        ...form,
        prix: Number(form.prix),
        chambres: Number(form.chambres),
        salles_bain: Number(form.salles_bain),
        id_type: 3,
      });
      setForm({ titre: '', ville: '', quartier: '', region: '', prix: '', descriptions: '', chambres: 1, salles_bain: 1 });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const requestSub = async (e) => {
    e.preventDefault();
    try {
      await subscriptionApi.request(subForm.plan, subForm.referencePaiement);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: 20, background: theme.background, color: theme.text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard Agent</h1>
        <button onClick={() => { logout(); navigate('/agent/login'); }} style={{ border: 'none', background: theme.primary, color: '#fff', padding: '8px 12px', borderRadius: 8 }}>Déconnexion</button>
      </div>
      <p>Bienvenue {user?.fullName} — Statut: {user?.status}</p>
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      <section style={{ marginTop: 24, padding: 16, borderRadius: 12, background: theme.surface }}>
        <h3>Abonnement</h3>
        {subscription ? (
          <p>Plan actif: {subscription.plan} — expire le {new Date(subscription.date_fin).toLocaleDateString()}</p>
        ) : (
          <form onSubmit={requestSub}>
            <select value={subForm.plan} onChange={(e) => setSubForm({ ...subForm, plan: e.target.value })} style={{ width: '100%', padding: 10, marginBottom: 8 }}>
              <option value="basic">Basic (5 annonces)</option>
              <option value="pro">Pro (15 annonces)</option>
              <option value="premium">Premium</option>
            </select>
            <input placeholder="Référence Mobile Money" value={subForm.referencePaiement} onChange={(e) => setSubForm({ ...subForm, referencePaiement: e.target.value })} required style={{ width: '100%', padding: 10, marginBottom: 8 }} />
            <button type="submit" style={{ padding: 10, border: 'none', borderRadius: 8, background: theme.action, color: '#fff' }}>Demander abonnement</button>
          </form>
        )}
      </section>

      <section style={{ marginTop: 24, padding: 16, borderRadius: 12, background: theme.surface }}>
        <h3>Nouvelle annonce</h3>
        <form onSubmit={createListing}>
          {['titre', 'ville', 'quartier', 'region', 'prix', 'descriptions'].map((f) => (
            <input key={f} placeholder={f} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} required={f !== 'region'} style={{ width: '100%', padding: 10, marginBottom: 8 }} />
          ))}
          <button type="submit" style={{ padding: 10, border: 'none', borderRadius: 8, background: theme.primary, color: '#fff' }}>Publier</button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Mes annonces ({listings.length})</h3>
        {listings.map((l) => (
          <div key={l.id} style={{ padding: 12, marginBottom: 8, borderRadius: 8, background: theme.surface }}>
            <strong>{l.titre || l.ville}</strong> — {l.prix} FCFA — {l.statut}
          </div>
        ))}
      </section>
    </div>
  );
};

export default AgentDashboard;
