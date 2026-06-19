import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const AgentLogin = () => {
  const { theme } = useTheme();
  const { loginAgent } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginAgent(email, password);
      toast.success('Bienvenue Agent');
      navigate('/agent/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: 24, backgroundColor: theme.background }}>
      <Logo size={48} />
      <h1 style={{ color: theme.text }}>Espace Agent</h1>
      <p style={{ color: theme.secondaryText }}>Connectez-vous pour gérer vos annonces</p>
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input style={input(theme)} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input style={input(theme)} placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={btn(theme)}>Connexion agent</button>
      </form>
      <button type="button" onClick={() => navigate('/agent/register')} style={{ ...btn(theme), background: 'transparent', color: theme.primary, marginTop: 12 }}>
        Créer un compte agent
      </button>
      <button type="button" onClick={() => navigate('/home')} style={{ ...btn(theme), background: 'transparent', color: theme.secondaryText, marginTop: 8 }}>
        Retour visiteur
      </button>
    </div>
  );
};

const input = (theme) => ({
  width: '100%', padding: 14, marginBottom: 12, borderRadius: 10,
  border: `1px solid ${theme.border}`, background: theme.surface, color: theme.text,
});

const btn = (theme) => ({
  width: '100%', padding: 14, border: 'none', borderRadius: 10,
  background: theme.action, color: '#fff', fontWeight: 600, cursor: 'pointer',
});

export default AgentLogin;
