import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import BottomNavigation from '../components/BottomNavigation';
import HousingCard from '../components/HousingCard';
import { mockHousingData } from '../data/mockHousingData';
import { propertiesApi, mapPropertyFromApi } from '../services/api';
import { cameroonRegions, getCitiesByRegion } from '../data/cameroonRegions';
import { ArrowLeft, Search as SearchIcon, SlidersHorizontal, ChevronDown, X } from 'lucide-react';

const Search = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredHousing, setFilteredHousing] = useState(mockHousingData);

  const availableCities = selectedRegion ? getCitiesByRegion(selectedRegion) : [];
  const housingTypes = ['Tous', 'Studio', 'Appartement', 'Villa', 'Chambre', 'Duplex'];

  const typeToId = { Chambre: 1, Studio: 2, Appartement: 3, Villa: 4, Duplex: 5 };

  const applyFilters = async () => {
    const params = {};
    if (selectedCity) params.ville = selectedCity;
    else if (searchQuery) params.ville = searchQuery;
    
    if (selectedRegion) params.region = selectedRegion;
    if (selectedType && selectedType !== 'Tous') params.type = typeToId[selectedType];
    if (priceRange.min) params.prix_min = priceRange.min;
    if (priceRange.max) params.prix_max = priceRange.max;

    try {
      const res = await propertiesApi.search(params);
      const items = (res.logements || []).map(mapPropertyFromApi);
      setFilteredHousing(items.length ? items : []);
    } catch {
      let filtered = mockHousingData;
      if (searchQuery) {
        filtered = filtered.filter((h) =>
          h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (selectedRegion) filtered = filtered.filter((h) => h.region === selectedRegion);
      if (selectedCity) filtered = filtered.filter((h) => h.location === selectedCity);
      if (selectedType && selectedType !== 'Tous') filtered = filtered.filter((h) => h.type === selectedType);
      if (priceRange.min) filtered = filtered.filter((h) => h.price >= parseInt(priceRange.min, 10));
      if (priceRange.max) filtered = filtered.filter((h) => h.price <= parseInt(priceRange.max, 10));
      setFilteredHousing(filtered);
    }
  };

  useEffect(() => {
    applyFilters();
  }, []);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('');
    setSelectedCity('');
    setSelectedType('');
    setPriceRange({ min: '', max: '' });
    setFilteredHousing(mockHousingData);
  };

  const handleCardPress = (id) => {
    navigate(`/housing/${id}`);
  };

  const handleFavoriteToggle = (id) => {
    setFilteredHousing(prevData =>
      prevData.map(housing =>
        housing.id === id
          ? { ...housing, isFavorite: !housing.isFavorite }
          : housing
      )
    );
  };

  React.useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedRegion, selectedCity, selectedType, priceRange]);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/home')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <ArrowLeft size={24} color={theme.text} />
            </button>
            <Logo size={28} />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
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
            <SlidersHorizontal size={20} color={theme.primary} />
          </button>
        </div>

        {/* Search Bar */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SearchIcon
            size={18}
            color={theme.secondaryText}
            style={{
              position: 'absolute',
              left: '14px',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un logement..."
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
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={18} color={theme.secondaryText} />
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div
          style={{
            padding: '20px',
            backgroundColor: theme.surface,
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: theme.text }}>
              Filtres
            </h3>
            <button
              onClick={resetFilters}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: theme.primary,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Réinitialiser
            </button>
          </div>

          {/* Region Filter */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>
              Région
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedCity('');
                }}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 12px',
                  fontSize: '14px',
                  backgroundColor: theme.background,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.text,
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">Toutes les régions</option>
                {cameroonRegions.map((region) => (
                  <option key={region.name} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} color={theme.secondaryText} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* City Filter */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>
              Ville
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedRegion}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 12px',
                  fontSize: '14px',
                  backgroundColor: selectedRegion ? theme.background : theme.border + '40',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: selectedRegion ? theme.text : theme.secondaryText,
                  outline: 'none',
                  appearance: 'none',
                  cursor: selectedRegion ? 'pointer' : 'not-allowed',
                }}
              >
                <option value="">Toutes les villes</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} color={theme.secondaryText} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Type Filter */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>
              Type de logement
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 12px',
                  fontSize: '14px',
                  backgroundColor: theme.background,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.text,
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                }}
              >
                {housingTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} color={theme.secondaryText} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.text, marginBottom: '6px' }}>
              Prix (XAF)
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  backgroundColor: theme.background,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.text,
                  outline: 'none',
                }}
              />
              <span style={{ color: theme.secondaryText }}>-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  backgroundColor: theme.background,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.text,
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: theme.text }}>
            {filteredHousing.length} résultat{filteredHousing.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {filteredHousing.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: theme.secondaryText,
            }}
          >
            <SearchIcon size={48} color={theme.border} style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '16px' }}>Aucun logement trouvé</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {filteredHousing.map((housing) => (
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

export default Search;
