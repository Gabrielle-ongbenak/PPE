import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import BottomNavigation from '../components/BottomNavigation';
import HousingCard from '../components/HousingCard';
import { mockHousingData } from '../data/mockHousingData';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [favorites, setFavorites] = useState(mockHousingData.filter(h => h.isFavorite));

  const handleCardPress = (id) => {
    navigate(`/housing/${id}`);
  };

  const handleFavoriteToggle = (id) => {
    setFavorites(prevData =>
      prevData.map(housing =>
        housing.id === id
          ? { ...housing, isFavorite: !housing.isFavorite }
          : housing
      ).filter(h => h.isFavorite)
    );
  };

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
        {/* Title */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: theme.text,
              marginBottom: '8px',
            }}
          >
            Mes Favoris
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: theme.secondaryText,
            }}
          >
            {favorites.length} logement{favorites.length !== 1 ? 's' : ''} enregistré{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              backgroundColor: theme.surface,
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
            }}
          >
            <Heart
              size={64}
              color={theme.border}
              style={{ marginBottom: '20px' }}
            />
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: theme.text,
                marginBottom: '8px',
              }}
            >
              Aucun favori
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: theme.secondaryText,
                marginBottom: '24px',
              }}
            >
              Commencez à ajouter des logements à vos favoris
            </p>
            <button
              onClick={() => navigate('/home')}
              style={{
                backgroundColor: theme.primary,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
              }}
            >
              Explorer les logements
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {favorites.map((housing) => (
              <HousingCard
                key={housing.id}
                housing={housing}
                onPress={handleCardPress}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Favorites;
