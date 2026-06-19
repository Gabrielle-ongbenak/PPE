import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { messagesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ContactForm = ({ propertyId, agentId, onSuccess, onClose }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await messagesApi.send({
        destinataire_id: agentId,
        destinataire_type: 'agent',
        logement_id: propertyId,
        contenu: form.message,
      });
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
      {!user && <p style={{ color: theme.secondaryText, fontSize: '14px', marginBottom: '16px' }}>Vous devez être connecté pour envoyer un message.</p>}
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
          marginTop: '16px',
          boxShadow: '0 8px 20px rgba(251, 191, 36, 0.4)',
          border: '2px solid rgba(255,255,255,0.2)',
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
