import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here
    navigate('/home');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.background,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '48px',
          paddingTop: '24px',
        }}
      >
        <Logo size={48} />
      </div>

      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: theme.text,
            marginBottom: '8px',
          }}
        >
          Bienvenue
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: theme.secondaryText,
          }}
        >
          Connectez-vous à votre compte Logitech
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} style={{ flex: 1 }}>
        {/* Email Input */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: theme.text,
              marginBottom: '8px',
            }}
          >
            Email
          </label>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Mail
              size={20}
              color={theme.secondaryText}
              style={{
                position: 'absolute',
                left: '16px',
              }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                fontSize: '16px',
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: '12px',
                color: theme.text,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.border;
              }}
            />
          </div>
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: theme.text,
              marginBottom: '8px',
            }}
          >
            Mot de passe
          </label>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Lock
              size={20}
              color={theme.secondaryText}
              style={{
                position: 'absolute',
                left: '16px',
              }}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '16px 48px 16px 48px',
                fontSize: '16px',
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: '12px',
                color: theme.text,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.border;
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              {showPassword ? (
                <EyeOff size={20} color={theme.secondaryText} />
              ) : (
                <Eye size={20} color={theme.secondaryText} />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '32px',
          }}
        >
          <button
            type="button"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: theme.primary,
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Mot de passe oublié ?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: theme.action,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
            transition: 'all 0.2s',
            marginBottom: '24px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(251, 191, 36, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)';
          }}
        >
          Se connecter
          <ArrowRight size={20} />
        </button>

        {/* Register Link */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              color: theme.secondaryText,
            }}
          >
            Pas encore de compte ?{' '}
          </span>
          <button
            type="button"
            onClick={() => navigate('/register')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: theme.primary,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            S'inscrire
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
