import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import BottomNavigation from '../components/BottomNavigation';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Settings, LogOut, Bell, Shield, HelpCircle, Moon, Sun, ArrowRight, LayoutDashboard } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { user, loading, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    agencyName: user?.agencyName || '',
    password: ''
  });

  const handleLogout = () => {
    logout();
    toast.success('Déconnecté');
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(editForm);
      toast.success('Profil mis à jour');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: theme.background }} />;

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.background, padding: '40px 20px', textAlign: 'center' }}>
        <Logo size={48} />
        <h2 style={{ color: theme.text, marginTop: 32 }}>Vous n'êtes pas connecté</h2>
        <p style={{ color: theme.secondaryText, marginBottom: 32 }}>Connectez-vous pour voir votre profil</p>
        <button
          onClick={() => navigate('/login')}
          style={{
            backgroundColor: theme.primary,
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            margin: '0 auto'
          }}
        >
          Se connecter
          <ArrowRight size={20} />
        </button>
        <BottomNavigation />
      </div>
    );
  }

  const menuItems = [
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Gérer vos préférences de notification',
      action: () => toast.success('Notifications activées'),
    },
    {
      icon: Shield,
      label: 'Sécurité',
      description: 'Mot de passe et authentification',
      action: () => setIsEditing(true),
    },
    {
      icon: HelpCircle,
      label: 'Aide et support',
      description: 'FAQ et contact du support',
      action: () => toast.success('Contactez support@logitech.cm'),
    },
    {
      icon: Settings,
      label: 'Paramètres',
      description: 'Configuration de l\'application',
      action: () => toast.success('Paramètres enregistrés'),
    },
  ];

  if (user.role === 'agent') {
    menuItems.unshift({
      icon: LayoutDashboard, // We will need to import LayoutDashboard from lucide-react
      label: 'Espace Agent',
      description: 'Accéder à mon tableau de bord immobilier',
      action: () => navigate('/agent/dashboard'),
    });
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.background,
        paddingBottom: '80px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: theme.surface,
          borderBottom: `1px solid ${theme.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Logo size={32} />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Profile Card */}
        <div
          style={{
            backgroundColor: theme.surface,
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <img
            src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"}
            alt="Profile"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: `3px solid ${theme.primary}`,
            }}
          />
          <div style={{ flex: 1 }}>
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 'bold',
                color: theme.text,
                marginBottom: '4px',
              }}
            >
              {user.fullName || user.nom || 'Utilisateur'}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                color: theme.secondaryText,
                marginBottom: '12px',
              }}
            >
              {user.email}
            </p>
            <button
              onClick={() => {
                setEditForm({
                  fullName: user.fullName || user.nom || '',
                  phone: user.phone || user.telephone || '',
                  agencyName: user.agencyName || user.nom_agence || '',
                  password: ''
                });
                setIsEditing(true);
              }}
              style={{
                backgroundColor: theme.primary + '15',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '500',
                color: theme.primary,
                cursor: 'pointer',
              }}
            >
              Modifier le profil
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div
          style={{
            backgroundColor: theme.surface,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            border: `1px solid ${theme.border}`,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: theme.text,
              marginBottom: '16px',
            }}
          >
            Informations personnelles
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <User size={20} color={theme.secondaryText} style={{ minWidth: '20px' }} />
              <div>
                <div style={{ fontSize: '13px', color: theme.secondaryText, marginBottom: '2px' }}>Nom complet</div>
                <div style={{ fontSize: '15px', color: theme.text, fontWeight: '500' }}>{user.fullName || user.nom}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={20} color={theme.secondaryText} style={{ minWidth: '20px' }} />
              <div>
                <div style={{ fontSize: '13px', color: theme.secondaryText, marginBottom: '2px' }}>Email</div>
                <div style={{ fontSize: '15px', color: theme.text, fontWeight: '500' }}>{user.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Phone size={20} color={theme.secondaryText} style={{ minWidth: '20px' }} />
              <div>
                <div style={{ fontSize: '13px', color: theme.secondaryText, marginBottom: '2px' }}>Téléphone</div>
                <div style={{ fontSize: '15px', color: theme.text, fontWeight: '500' }}>{user.phone || user.telephone || 'Non renseigné'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin size={20} color={theme.secondaryText} style={{ minWidth: '20px' }} />
              <div>
                <div style={{ fontSize: '13px', color: theme.secondaryText, marginBottom: '2px' }}>Localisation</div>
                <div style={{ fontSize: '15px', color: theme.text, fontWeight: '500' }}>{user.agencyName || 'Yaoundé, Centre'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <div
          style={{
            backgroundColor: theme.surface,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            border: `1px solid ${theme.border}`,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: theme.text,
              marginBottom: '16px',
            }}
          >
            Apparence
          </h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isDarkMode ? (
                <Moon size={20} color={theme.primary} />
              ) : (
                <Sun size={20} color={theme.primary} />
              )}
              <div>
                <div style={{ fontSize: '15px', color: theme.text, fontWeight: '500' }}>
                  Mode {isDarkMode ? 'Sombre' : 'Clair'}
                </div>
                <div style={{ fontSize: '13px', color: theme.secondaryText }}>
                  {isDarkMode ? 'Activer le thème clair' : 'Activer le thème sombre'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              style={{
                width: '52px',
                height: '28px',
                borderRadius: '14px',
                backgroundColor: isDarkMode ? theme.primary : theme.border,
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.3s',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: isDarkMode ? '26px' : '2px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  transition: 'left 0.3s',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div
          style={{
            backgroundColor: theme.surface,
            borderRadius: '16px',
            padding: '8px',
            marginBottom: '24px',
            border: `1px solid ${theme.border}`,
          }}
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={20} color={theme.secondaryText} style={{ minWidth: '20px' }} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '15px', color: theme.text, fontWeight: '500', marginBottom: '2px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '13px', color: theme.secondaryText }}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: `1px solid ${theme.error}`,
            borderRadius: '12px',
            padding: '16px',
            fontSize: '15px',
            fontWeight: '600',
            color: theme.error,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.error + '10';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }} onClick={() => setIsEditing(false)}>
          <div style={{ width: '100%', background: theme.surface, borderRadius: '24px 24px 0 0', padding: 24, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 20 }}>Modifier le profil</h3>
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: theme.secondaryText, marginBottom: 4 }}>Nom complet</label>
                <input value={editForm.fullName} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.background, color: theme.text }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: theme.secondaryText, marginBottom: 4 }}>Téléphone</label>
                <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.background, color: theme.text }} />
              </div>
              {user.role === 'agent' && (
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: theme.secondaryText, marginBottom: 4 }}>Nom de l'agence</label>
                  <input value={editForm.agencyName} onChange={e => setEditForm({ ...editForm, agencyName: e.target.value })} style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.background, color: theme.text }} />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: 13, color: theme.secondaryText, marginBottom: 4 }}>Nouveau mot de passe (optionnel)</label>
                <input type="password" value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })} placeholder="Laisser vide pour ne pas changer" style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.background, color: theme.text }} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${theme.border}`, background: 'transparent', color: theme.text, fontWeight: 600 }}>Annuler</button>
                <button type="submit" style={{ flex: 1, padding: 12, borderRadius: 10, border: 'none', background: theme.primary, color: '#fff', fontWeight: 600 }}>Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Profile;
