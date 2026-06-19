import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import { cameroonRegions, getCitiesByRegion } from '../data/cameroonRegions';
import { User, Mail, Lock, Eye, EyeOff, MapPin, ChevronDown, ArrowRight } from 'lucide-react';
import { authApi } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const availableCities = selectedRegion ? getCitiesByRegion(selectedRegion) : [];

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas !');
      return;
    }
    try {
      await authApi.registerClient({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
      toast.success('Compte créé avec succès !');
      navigate('/login');
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        err.errors.forEach(e => toast.error(e.message));
      } else {
        toast.error(err.message);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
          marginBottom: '32px',
          paddingTop: '24px',
        }}
      >
        <Logo size={40} />
      </div>

      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: 'bold',
            color: theme.text,
            marginBottom: '8px',
          }}
        >
          Créer un compte
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: theme.secondaryText,
          }}
        >
          Rejoignez Logitech pour trouver votre logement idéal
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} style={{ flex: 1 }}>
        {/* Name Input */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: theme.text,
              marginBottom: '6px',
            }}
          >
            Nom complet
          </label>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <User
              size={18}
              color={theme.secondaryText}
              style={{
                position: 'absolute',
                left: '14px',
              }}
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Votre nom"
              required
              style={{
                width: '100%',
                padding: '14px 14px 14px 44px',
                fontSize: '15px',
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: '10px',
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

        {/* Email Input */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: theme.text,
              marginBottom: '6px',
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
              size={18}
              color={theme.secondaryText}
              style={{
                position: 'absolute',
                left: '14px',
              }}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="votre@email.com"
              required
              style={{
                width: '100%',
                padding: '14px 14px 14px 44px',
                fontSize: '15px',
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: '10px',
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

        {/* Phone Input */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: theme.text,
              marginBottom: '6px',
            }}
          >
            Téléphone
          </label>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <MapPin
              size={18}
              color={theme.secondaryText}
              style={{
                position: 'absolute',
                left: '14px',
              }}
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+237 6XX XXX XXX"
              required
              style={{
                width: '100%',
                padding: '14px 14px 14px 44px',
                fontSize: '15px',
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: '10px',
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

        {/* Region Dropdown */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: theme.text,
              marginBottom: '6px',
            }}
          >
            Région
          </label>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <MapPin
              size={18}
              color={theme.secondaryText}
              style={{
                position: 'absolute',
                left: '14px',
              }}
            />
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedCity('');
              }}
              required
              style={{
                width: '100%',
                padding: '14px 44px 14px 44px',
                fontSize: '15px',
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: '10px',
                color: theme.text,
                outline: 'none',
                transition: 'border-color 0.2s',
                appearance: 'none',
                cursor: 'pointer',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.border;
              }}
            >
              <option value="">Sélectionner une région</option>
              {cameroonRegions.map((region) => (
                <option key={region.name} value={region.name}>
                  {region.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              color={theme.secondaryText}
              style={{
                position: 'absolute',
                right: '14px',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* City Dropdown */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: theme.text,
              marginBottom: '6px',
            }}
          >
            Ville
          </label>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <MapPin
              size={18}
              color={theme.secondaryText}
              style={{
                position: 'absolute',
                left: '14px',
              }}
            />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              required
              disabled={!selectedRegion}
              style={{
                width: '100%',
                padding: '14px 44px 14px 44px',
                fontSize: '15px',
                backgroundColor: selectedRegion ? theme.surface : theme.border + '40',
                border: `1px solid ${theme.border}`,
                borderRadius: '10px',
                color: selectedRegion ? theme.text : theme.secondaryText,
                outline: 'none',
                transition: 'border-color 0.2s',
                appearance: 'none',
                cursor: selectedRegion ? 'pointer' : 'not-allowed',
              }}
              onFocus={(e) => {
                if (selectedRegion) {
                  e.currentTarget.style.borderColor = theme.primary;
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.border;
              }}
            >
              <option value="">
                {selectedRegion ? 'Sélectionner une ville' : 'D\'abord sélectionner une région'}
              </option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              color={theme.secondaryText}
              style={{
                position: 'absolute',
                right: '14px',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: theme.text,
              marginBottom: '6px',
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
              size={18}
              color={theme.secondaryText}
              style={{
                position: 'absolute',
                left: '14px',
              }}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '14px 44px 14px 44px',
                fontSize: '15px',
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: '10px',
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
                right: '14px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              {showPassword ? (
                <EyeOff size={18} color={theme.secondaryText} />
              ) : (
                <Eye size={18} color={theme.secondaryText} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: theme.text,
              marginBottom: '6px',
            }}
          >
            Confirmer le mot de passe
          </label>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Lock
              size={18}
              color={theme.secondaryText}
              style={{
                position: 'absolute',
                left: '14px',
              }}
            />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '14px 44px 14px 44px',
                fontSize: '15px',
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: '10px',
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '14px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              {showConfirmPassword ? (
                <EyeOff size={18} color={theme.secondaryText} />
              ) : (
                <Eye size={18} color={theme.secondaryText} />
              )}
            </button>
          </div>
        </div>

        {/* Register Button */}
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
            marginBottom: '20px',
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
          S'inscrire
          <ArrowRight size={20} />
        </button>

        {/* Login Link */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              color: theme.secondaryText,
            }}
          >
            Déjà inscrit ?{' '}
          </span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: theme.primary,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Se connecter
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
