import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Home, Search, Heart, MessageSquare, User, Bot } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const navItems = [
    { path: '/home', icon: Home, label: 'Accueil' },
    { path: '/search', icon: Search, label: 'Recherche' },
    { path: '/favorites', icon: Heart, label: 'Favoris' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.surface,
        borderTop: `1px solid ${theme.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 0',
        zIndex: 1000,
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
          >
            <Icon
              size={24}
              color={active ? theme.primary : theme.secondaryText}
              fill={active ? theme.primary : 'none'}
            />
            <span
              style={{
                fontSize: '11px',
                color: active ? theme.primary : theme.secondaryText,
                fontWeight: active ? '600' : '400',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavigation;
