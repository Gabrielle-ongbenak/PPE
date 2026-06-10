import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import BottomNavigation from '../components/BottomNavigation';
import ContactForm from '../components/ContactForm';
import { getHousingById } from '../data/mockHousingData';
import { propertiesApi, mapPropertyFromApi } from '../services/api';
import { ArrowLeft, Heart, Share2, MapPin, Star, Bed, Bath, Maximize, Phone, MessageCircle, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const HousingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [housing, setHousing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    propertiesApi
      .getById(id)
      .then((res) => setHousing(mapPropertyFromApi(res.publication)))
      .catch(() => setHousing(getHousingById(parseInt(id, 10))))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: theme.text }}>Chargement...</p>
      </div>
    );
  }

  if (!housing) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: theme.text }}>Logement non trouvé</p>
      </div>
    );
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % housing.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + housing.images.length) % housing.images.length);
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.background,
        paddingBottom: '80px',
      }}
    >
      {/* Image Slider */}
      <div style={{ position: 'relative', height: '350px', overflow: 'hidden' }}>
        <img
          src={housing.images[currentImageIndex]}
          alt={housing.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Header Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={20} color={theme.text} />
          </button>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleFavoriteToggle}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Heart size={20} fill={isFavorite ? theme.primary : 'none'} color={isFavorite ? theme.primary : theme.text} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Lien copié !');
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Share2 size={20} color={theme.text} />
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        {housing.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              <ChevronLeft size={24} color={theme.text} />
            </button>
            <button
              onClick={handleNextImage}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              <ChevronRight size={24} color={theme.text} />
            </button>
          </>
        )}

        {/* Image Dots */}
        {housing.images.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
            }}
          >
            {housing.images.map((_, index) => (
              <div
                key={index}
                style={{
                  width: index === currentImageIndex ? '10px' : '8px',
                  height: index === currentImageIndex ? '10px' : '8px',
                  borderRadius: '50%',
                  backgroundColor: index === currentImageIndex ? theme.primary : 'rgba(255, 255, 255, 0.6)',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {/* Title and Location */}
        <div style={{ marginBottom: '20px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: theme.text,
              marginBottom: '8px',
              lineHeight: '1.3',
            }}
          >
            {housing.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <MapPin size={16} color={theme.secondaryText} />
            <span style={{ fontSize: '15px', color: theme.secondaryText }}>
              {housing.location}, {housing.region}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={16} color={theme.accent} fill={theme.accent} />
            <span style={{ fontSize: '15px', color: theme.text, fontWeight: '500' }}>
              {housing.rating}
            </span>
            <span style={{ fontSize: '14px', color: theme.secondaryText }}>
              ({housing.reviews} avis)
            </span>
          </div>
        </div>

        {/* Price */}
        <div
          style={{
            backgroundColor: theme.surface,
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: `1px solid ${theme.border}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: theme.accent }}>
                {housing.price.toLocaleString()} {housing.currency}/mois
              </span>
            </div>
            <span
              style={{
                fontSize: '14px',
                padding: '6px 16px',
                backgroundColor: theme.primary + '20',
                color: theme.primary,
                borderRadius: '20px',
                fontWeight: '500',
              }}
            >
              {housing.type}
            </span>
          </div>
        </div>

        {/* Specifications */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: theme.text, marginBottom: '16px' }}>
            Caractéristiques
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
          >
            <div
              style={{
                backgroundColor: theme.surface,
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center',
                border: `1px solid ${theme.border}`,
              }}
            >
              <Bed size={24} color={theme.primary} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '18px', fontWeight: '600', color: theme.text }}>
                {housing.bedrooms}
              </div>
              <div style={{ fontSize: '12px', color: theme.secondaryText }}>
                {housing.bedrooms === 1 ? 'Chambre' : 'Chambres'}
              </div>
            </div>
            <div
              style={{
                backgroundColor: theme.surface,
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center',
                border: `1px solid ${theme.border}`,
              }}
            >
              <Bath size={24} color={theme.primary} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '18px', fontWeight: '600', color: theme.text }}>
                {housing.bathrooms}
              </div>
              <div style={{ fontSize: '12px', color: theme.secondaryText }}>
                {housing.bathrooms === 1 ? 'Salle de bain' : 'Salles de bain'}
              </div>
            </div>
            <div
              style={{
                backgroundColor: theme.surface,
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center',
                border: `1px solid ${theme.border}`,
              }}
            >
              <Maximize size={24} color={theme.primary} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '18px', fontWeight: '600', color: theme.text }}>
                {housing.area}
              </div>
              <div style={{ fontSize: '12px', color: theme.secondaryText }}>
                m²
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: theme.text, marginBottom: '12px' }}>
            Description
          </h3>
          <p style={{ margin: 0, fontSize: '15px', color: theme.secondaryText, lineHeight: '1.6' }}>
            {housing.description}
          </p>
        </div>

        {/* Amenities */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: theme.text, marginBottom: '12px' }}>
            Équipements
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {housing.amenities.map((amenity, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: theme.surface,
                  padding: '10px 16px',
                  borderRadius: '20px',
                  border: `1px solid ${theme.border}`,
                }}
              >
                <Check size={14} color={theme.primary} />
                <span style={{ fontSize: '14px', color: theme.text }}>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Landlord */}
        <div
          style={{
            backgroundColor: theme.surface,
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: `1px solid ${theme.border}`,
          }}
        >
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: theme.text, marginBottom: '16px' }}>
            Propriétaire
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <img
              src={housing.landlord.avatar}
              alt={housing.landlord.name}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: theme.text, marginBottom: '4px' }}>
                {housing.landlord.name}
              </div>
              <div style={{ fontSize: '14px', color: theme.secondaryText }}>
                {housing.landlord.phone}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowContact(true)}
                style={{
                  flex: 1,
                  backgroundColor: theme.action,
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <MessageCircle size={18} />
                Message
              </button>
            </div>
          </div>
        </div>

        {contactSent && (
          <p style={{ color: theme.primary, marginTop: 12, textAlign: 'center' }}>
            Message envoyé !
          </p>
        )}
      </div>

      {showContact && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'flex-end', zIndex: 200,
          }}
          onClick={() => setShowContact(false)}
        >
          <div
            style={{
              width: '100%', maxHeight: '90vh', overflowY: 'auto',
              background: theme.surface, borderRadius: '16px 16px 0 0', padding: 24,
              paddingBottom: 120, // Prevents bottom navigation from hiding the send button
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ContactForm
              propertyId={id}
              agentId={housing.landlord?.id}
              onSuccess={() => { setContactSent(true); setShowContact(false); }}
              onClose={() => setShowContact(false)}
            />
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default HousingDetail;
