import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/api';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    const [s, a] = await Promise.all([adminApi.stats(), adminApi.agents()]);
    setStats(s.stats);
    setAgents(a.agents || []);
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    load().catch((err) => setError(err.message));
  }, [user, navigate]);

  const validate = async (id) => {
    await adminApi.validateAgent(id);
    await adminApi.createSubscription(id, 'basic', `MM-${Date.now()}`);
    load();
  };

  return (
    <div style={{ minHeight: '100vh', padding: 20, background: theme.background, color: theme.text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Administration</h1>
        <button onClick={() => { logout(); navigate('/admin/login'); }}>Déconnexion</button>
      </div>
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
          <Card label="Agents en attente" value={stats.agents.en_attente} theme={theme} />
          <Card label="Agents validés" value={stats.agents.valides} theme={theme} />
          <Card label="Logements" value={stats.logements.total} theme={theme} />
          <Card label="Disponibles" value={stats.logements.disponibles} theme={theme} />
        </div>
      )}
      <h2 style={{ marginTop: 24 }}>Agents</h2>
      {agents.map((agent) => (
        <div key={agent.id} style={{ padding: 12, marginBottom: 8, borderRadius: 8, background: theme.surface }}>
          <div>{agent.nom} — {agent.email} — <strong>{agent.statut}</strong></div>
          {agent.statut === 'en_attente' && (
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button onClick={() => validate(agent.id)} style={{ padding: '6px 10px', border: 'none', borderRadius: 6, background: '#22c55e', color: '#fff' }}>Valider + Basic</button>
              <button onClick={() => adminApi.rejectAgent(agent.id).then(load)} style={{ padding: '6px 10px', border: 'none', borderRadius: 6, background: '#ef4444', color: '#fff' }}>Rejeter</button>
            </div>
          )}
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
