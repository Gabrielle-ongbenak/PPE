import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';

const Splash = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      navigate('/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: theme.background,
        transition: 'opacity 0.5s ease-out',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <Logo size={80} showText={false} />
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: theme.text,
          marginTop: '24px',
          letterSpacing: '2px',
        }}
      >
        Logicam
      </h1>
      <p
        style={{
          fontSize: '14px',
          color: theme.secondaryText,
          marginTop: '8px',
        }}
      >
        Trouvez votre logement idéal
      </p>
      
      {/* Loading indicator */}
      <div
        style={{
          marginTop: '48px',
          display: 'flex',
          gap: '8px',
        }}
      >
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: theme.primary,
              animation: `pulse 1.5s ease-in-out infinite`,
              animationDelay: `${index * 0.2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default Splash;
