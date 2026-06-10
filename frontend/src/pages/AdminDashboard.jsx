import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/api';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);
  const [pendingPubs, setPendingPubs] = useState([]);

  const load = async () => {
    try {
      const [s, a, p] = await Promise.all([
        adminApi.stats(),
        adminApi.agents(),
        adminApi.getPendingPublications()
      ]);
      setStats(s.stats);
      setAgents(a.agents || []);
      setPendingPubs(p.logements || []);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    load();
  }, [user, loading, navigate]);

  const validate = async (id) => {
    try {
      await adminApi.validateAgent(id);
      await adminApi.createSubscription(id, 'basic', `MM-${Date.now()}`);
      toast.success('Agent validé');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePubAction = async (id, action) => {
    try {
      if (action === 'valider') await adminApi.validerLogement(id);
      else await adminApi.rejeterLogement(id);
      toast.success(action === 'valider' ? 'Publication validée' : 'Publication rejetée');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading || (user && !stats)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.background }}>
        <p style={{ color: theme.text }}>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: 20, background: theme.background, color: theme.text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Administration</h1>
        <button
          onClick={() => { logout(); window.location.href = '/login'; }}
          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: theme.error, color: '#fff', fontWeight: 600, cursor: 'pointer' }}
        >
          Déconnexion
        </button>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
          <Card label="Agents en attente" value={stats.agents.en_attente} theme={theme} />
          <Card label="Agents validés" value={stats.agents.valides} theme={theme} />
          <Card label="Annonces en attente" value={stats.logements.en_attente} theme={theme} />
          <Card label="Annonces validées" value={stats.logements.valides} theme={theme} />
          <Card label="Disponibles (Public)" value={stats.logements.disponibles} theme={theme} />
          <Card label="Total Logements" value={stats.logements.total} theme={theme} />
        </div>
      )}
      <h2 style={{ marginTop: 24 }}>Agents en attente</h2>
      {agents.filter(a => a.statut === 'en_attente').map((agent) => (
        <div key={agent.id} style={{ padding: 12, marginBottom: 8, borderRadius: 8, background: theme.surface, border: `1px solid ${theme.border}` }}>
          <div>{agent.nom} — {agent.email}</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button onClick={() => validate(agent.id)} style={{ padding: '6px 10px', border: 'none', borderRadius: 6, background: '#22c55e', color: '#fff', cursor: 'pointer' }}>Valider + Basic</button>
            <button onClick={() => adminApi.rejectAgent(agent.id).then(() => { toast.success('Agent rejeté'); load(); })} style={{ padding: '6px 10px', border: 'none', borderRadius: 6, background: '#ef4444', color: '#fff', cursor: 'pointer' }}>Rejeter</button>
          </div>
        </div>
      ))}

      <h2 style={{ marginTop: 24 }}>Publications en attente</h2>
      {pendingPubs.length === 0 && <p style={{ color: theme.secondaryText }}>Aucune publication en attente</p>}
      {pendingPubs.map((pub) => (
        <div key={pub.id} style={{ padding: 12, marginBottom: 8, borderRadius: 8, background: theme.surface, border: `1px solid ${theme.border}` }}>
          <div style={{ fontWeight: '600' }}>{pub.titre || pub.descriptions?.substring(0, 50)}...</div>
          <div style={{ fontSize: 13, color: theme.secondaryText }}>Agent: {pub.agent_nom} — Prix: {pub.prix} FCFA — Ville: {pub.ville}</div>
          {pub.images && pub.images.length > 0 && (
            <div style={{ display: 'flex', gap: 4, marginTop: 8, overflowX: 'auto' }}>
              {pub.images.map((img, i) => (
                <img key={i} src={img} alt="Property" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
              ))}
            </div>
          )}
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button onClick={() => handlePubAction(pub.id, 'valider')} style={{ padding: '6px 10px', border: 'none', borderRadius: 6, background: theme.primary, color: '#fff', cursor: 'pointer' }}>Valider</button>
            <button onClick={() => handlePubAction(pub.id, 'rejeter')} style={{ padding: '6px 10px', border: 'none', borderRadius: 6, background: '#ef4444', color: '#fff', cursor: 'pointer' }}>Rejeter</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const Card = ({ label, value, theme }) => (
  <div style={{ padding: 16, borderRadius: 10, background: theme.surface }}>
    <div style={{ fontSize: 12, color: theme.secondaryText }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
  </div>
);

export default AdminDashboard;
