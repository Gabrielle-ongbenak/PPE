import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await authApi.loginAdmin(email, password);

      // Décode le token JWT
      const payload = JSON.parse(atob(res.token.split('.')[1]));

      // Vérifie que c'est un admin
      if (payload.role !== 'admin') {
        throw new Error('Accès réservé aux administrateurs');
      }

      // Sauvegarde le token
      localStorage.setItem('logitech_token', res.token);

      // Redirige vers le dashboard
      toast.success('Accès admin autorisé');
      window.location.href = '/admin/dashboard';

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: 24, backgroundColor: theme.background }}>
      <h1 style={{ color: theme.text }}>Administration Logitech</h1>
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          style={input(theme)}
          type="email"
          placeholder="Email admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={input(theme)}
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={btn(theme)}>
          Connexion admin
        </button>
      </form>
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

export default AdminLogin;