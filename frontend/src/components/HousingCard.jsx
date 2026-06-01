import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Heart, MapPin, Star, Bed, Bath, Maximize } from 'lucide-react';

const HousingCard = ({ housing, onPress, onFavoriteToggle }) => {
  const { theme } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % housing.images.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + housing.images.length) % housing.images.length);
  };

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    onFavoriteToggle(housing.id);
  };

  return (
    <div
      onClick={() => onPress(housing.id)}
      style={{
        backgroundColor: theme.surface,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Image Slider */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={housing.images[currentImageIndex]}
          alt={housing.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        
        {/* Navigation Arrows */}
        {housing.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              ‹
            </button>
            <button
              onClick={handleNextImage}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              ›
            </button>
          </>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Heart
            size={20}
            fill={housing.isFavorite ? theme.primary : 'none'}
            color={housing.isFavorite ? theme.primary : theme.secondaryText}
          />
        </button>

        {/* Image Dots Indicator */}
        {housing.images.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
            }}
          >
            {housing.images.map((_, index) => (
              <div
                key={index}
                style={{
                  width: index === currentImageIndex ? '8px' : '6px',
                  height: index === currentImageIndex ? '8px' : '6px',
                  borderRadius: '50%',
                  backgroundColor: index === currentImageIndex ? theme.primary : 'rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: theme.text,
              flex: 1,
            }}
          >
            {housing.title}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
          <MapPin size={14} color={theme.secondaryText} />
          <span style={{ fontSize: '13px', color: theme.secondaryText }}>
            {housing.location}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
          <Star size={14} color={theme.accent} fill={theme.accent} />
          <span style={{ fontSize: '13px', color: theme.text, fontWeight: '500' }}>
            {housing.rating}
          </span>
          <span style={{ fontSize: '12px', color: theme.secondaryText }}>
            ({housing.reviews} avis)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bed size={14} color={theme.secondaryText} />
            <span style={{ fontSize: '12px', color: theme.secondaryText }}>
              {housing.bedrooms} {housing.bedrooms === 1 ? 'chambre' : 'chambres'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bath size={14} color={theme.secondaryText} />
            <span style={{ fontSize: '12px', color: theme.secondaryText }}>
              {housing.bathrooms} {housing.bathrooms === 1 ? 'salle de bain' : 'salles de bain'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Maximize size={14} color={theme.secondaryText} />
            <span style={{ fontSize: '12px', color: theme.secondaryText }}>
              {housing.area} m²
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: theme.accent }}>
              {housing.price.toLocaleString()} {housing.currency}
            </span>
            <span style={{ fontSize: '12px', color: theme.secondaryText, marginLeft: '4px' }}>
              /mois
            </span>
          </div>
          <span
            style={{
              fontSize: '12px',
              padding: '4px 12px',
              backgroundColor: theme.primary + '20',
              color: theme.primary,
              borderRadius: '12px',
              fontWeight: '500',
            }}
          >
            {housing.type}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HousingCard;
