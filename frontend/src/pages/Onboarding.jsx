import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import { Home, Search, Shield, ArrowRight, X } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      icon: Home,
      title: 'Trouvez votre logement idéal',
      description: 'Parcourez des centaines de logements dans tout le Cameroun. Studios, appartements, villas - trouvez ce qui vous convient.',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    },
    {
      icon: Search,
      title: 'Recherche intelligente',
      description: 'Filtrez par région, ville, prix et type de logement. Notre système vous aide à trouver exactement ce que vous cherchez.',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    },
    {
      icon: Shield,
      title: 'Sécurité garantie',
      description: 'Tous nos logements sont vérifiés. Communiquez directement avec les propriétaires et réservez en toute confiance.',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
    }
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/login');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  const currentStepData = onboardingSteps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.background,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Logo size={32} />
        <button
          onClick={handleSkip}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          <X size={24} color={theme.secondaryText} />
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        {/* Image */}
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            height: '250px',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '32px',
          }}
        >
          <img
            src={currentStepData.image}
            alt={currentStepData.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: theme.primary + '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <Icon size={32} color={theme.primary} />
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: theme.text,
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          {currentStepData.title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: '16px',
            color: theme.secondaryText,
            textAlign: 'center',
            lineHeight: '1.6',
            maxWidth: '400px',
            marginBottom: '48px',
          }}
        >
          {currentStepData.description}
        </p>

        {/* Dots indicator */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '32px',
          }}
        >
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentStep ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: index === currentStep ? theme.primary : theme.border,
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          style={{
            backgroundColor: theme.action,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 48px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
            transition: 'all 0.2s',
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
          {currentStep === onboardingSteps.length - 1 ? 'Commencer' : 'Suivant'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
