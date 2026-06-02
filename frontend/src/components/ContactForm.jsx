import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { contactApi } from '../services/api';

const ContactForm = ({ propertyId, onSuccess, onClose }) => {
  const { theme } = useTheme();
  const [form, setForm] = useState({
    visitorName: '',
    visitorEmail: '',
    visitorPhone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await contactApi.send(propertyId, form);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    borderRadius: '10px',
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.surface,
    color: theme.text,
    fontSize: '15px',
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ margin: '0 0 16px', color: theme.text }}>Contacter l'agent</h3>
      {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>}
      <input
        style={inputStyle}
        placeholder="Votre nom"
        value={form.visitorName}
        onChange={(e) => setForm({ ...form, visitorName: e.target.value })}
        required
      />
      <input
        style={inputStyle}
        type="email"
        placeholder="Votre email"
        value={form.visitorEmail}
        onChange={(e) => setForm({ ...form, visitorEmail: e.target.value })}
        required
      />
      <input
        style={inputStyle}
        placeholder="Téléphone (optionnel)"
        value={form.visitorPhone}
        onChange={(e) => setForm({ ...form, visitorPhone: e.target.value })}
      />
      <textarea
        style={{ ...inputStyle, minHeight: '100px' }}
        placeholder="Votre message"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        required
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          border: 'none',
          borderRadius: '12px',
          backgroundColor: theme.action,
          color: '#fff',
          fontWeight: 600,
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginTop: '8px',
          boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(251, 191, 36, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.2)';
        }}
      >
        {loading ? 'Envoi...' : 'Envoyer le message'}
      </button>
    </form>
  );
};

export default ContactForm;
