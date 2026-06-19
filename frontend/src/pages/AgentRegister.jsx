import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { authApi } from '../services/api';

const AgentRegister = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '', agencyName: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await authApi.registerAgent(form);
      setMessage(res.message);
      setTimeout(() => navigate('/agent/login'), 2000);
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        setError(err.errors.map(e => e.message).join(', '));
      } else {
        setError(err.message);
      }
    }
  };

  const field = (key, placeholder, type = 'text') => (
    <input
      key={key}
      type={type}
      placeholder={placeholder}
      value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      required={key !== 'agencyName'}
      style={{
        width: '100%', padding: 14, marginBottom: 12, borderRadius: 10,
        border: `1px solid ${theme.border}`, background: theme.surface, color: theme.text,
      }}
    />
  );

  return (
    <div style={{ minHeight: '100vh', padding: 24, backgroundColor: theme.background }}>
      <h1 style={{ color: theme.text }}>Inscription Agent</h1>
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {message && <p style={{ color: theme.primary }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        {field('fullName', 'Nom complet')}
        {field('email', 'Email', 'email')}
        {field('phone', 'Téléphone')}
        {field('agencyName', 'Nom de l\'agence')}
        {field('password', 'Mot de passe', 'password')}
        <button type="submit" style={{ width: '100%', padding: 14, borderRadius: 10, border: 'none', background: theme.action, color: '#fff', fontWeight: 600 }}>
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default AgentRegister;
