import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import BottomNavigation from '../components/BottomNavigation';
import HousingCard from '../components/HousingCard';
import { mockHousingData } from '../data/mockHousingData';
import { propertiesApi, mapPropertyFromApi } from '../services/api';
import { Search, SlidersHorizontal, Bot, Bell } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [housingData, setHousingData] = useState(mockHousingData);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('Tous');

  useEffect(() => {
    propertiesApi
      .search()
      .then((res) => {
        const items = (res.logements || []).map(mapPropertyFromApi);
        if (items.length > 0) setHousingData(items);
      })
      .catch(() => setHousingData(mockHousingData))
      .finally(() => setLoading(false));
  }, []);

  const handleCardPress = (id) => {
    navigate(`/housing/${id}`);
  };

  const handleFavoriteToggle = (id) => {
    setHousingData(prevData =>
      prevData.map(housing =>
        housing.id === id
          ? { ...housing, isFavorite: !housing.isFavorite }
          : housing
      )
    );
  };

  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const filteredData = selectedCategory === 'Tous'
    ? housingData
    : housingData.filter(h => h.type.includes(selectedCategory.replace('s', ''))); // Simple matches for Studio, Appartement, etc.

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
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Logo size={32} />
          <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
            <button
              onClick={() => navigate('/assistant')}
              style={{
                backgroundColor: theme.primary + '15',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={20} color={theme.primary} />
            </button>
            <button
              onClick={handleNotificationClick}
              style={{
                backgroundColor: theme.primary + '15',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Bell size={20} color={theme.primary} />
              <div
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: theme.accent,
                  borderRadius: '50%',
                }}
              />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '260px',
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  zIndex: 200,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>Notifications</span>
                  {/* <span style={{ color: theme.primary, fontSize: '12px', cursor: 'pointer' }}>Tout marquer lu</span> */}
                </div>
                <div style={{ padding: '8px 0', textAlign: 'center', color: theme.secondaryText, fontSize: '13px' }}>
                  Vous n'avez pas de nouvelles notifications pour le moment.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
          }}
        >
          <div
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={18}
              color={theme.secondaryText}
              style={{
                position: 'absolute',
                left: '14px',
              }}
            />
            <input
              type="text"
              placeholder="Rechercher un logement..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/search?q=${e.target.value}`);
                }
              }}
              style={{
                width: '100%',
                padding: '14px 14px 14px 44px',
                fontSize: '15px',
                backgroundColor: theme.background,
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
          <button
            onClick={() => navigate('/search')}
            style={{
              backgroundColor: theme.primary,
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SlidersHorizontal size={20} color="#FFFFFF" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: theme.text,
              marginBottom: '4px',
            }}
          >
            Découvrez votre logement
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: theme.secondaryText,
            }}
          >
            {filteredData.length} logements disponibles
          </p>
        </div>

        {/* Quick Filters */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '24px',
            overflowX: 'auto',
            paddingBottom: '8px',
          }}
        >
          {['Tous', 'Studios', 'Appartements', 'Villas', 'Chambres'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedCategory(filter)}
              style={{
                backgroundColor: filter === selectedCategory ? theme.primary : theme.surface,
                color: filter === selectedCategory ? '#FFFFFF' : theme.text,
                border: filter === selectedCategory ? 'none' : `1px solid ${theme.border}`,
                borderRadius: '20px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Housing Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredData.map((housing) => (
            <HousingCard
              key={housing.id}
              housing={housing}
              onPress={handleCardPress}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Home;
