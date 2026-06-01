import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Logo = ({ size = 40, showText = true }) => {
  const { theme } = useTheme();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Geometric hexagon shape */}
        <path 
          d="M50 5 L93.3 30 L93.3 80 L50 105 L6.7 80 L6.7 30 Z" 
          fill="none" 
          stroke={theme.primary} 
          strokeWidth="3"
          transform="translate(0, -5)"
        />
        
        {/* Inner geometric pattern */}
        <path 
          d="M50 20 L75 35 L75 65 L50 80 L25 65 L25 35 Z" 
          fill={theme.primary} 
          opacity="0.2"
          transform="translate(0, -5)"
        />
        
        {/* Central diamond */}
        <path 
          d="M50 30 L65 45 L50 60 L35 45 Z" 
          fill={theme.primary}
          transform="translate(0, -5)"
        />
        
        {/* Golden accent lines */}
        <line 
          x1="50" 
          y1="5" 
          x2="50" 
          y2="30" 
          stroke={theme.accent} 
          strokeWidth="2"
          transform="translate(0, -5)"
        />
        <line 
          x1="25" 
          y1="35" 
          x2="35" 
          y2="45" 
          stroke={theme.accent} 
          strokeWidth="2"
          transform="translate(0, -5)"
        />
        <line 
          x1="75" 
          y1="35" 
          x2="65" 
          y2="45" 
          stroke={theme.accent} 
          strokeWidth="2"
          transform="translate(0, -5)"
        />
      </svg>
      
      {showText && (
        <span
          style={{
            fontSize: size * 0.5,
            fontWeight: 'bold',
            color: theme.text,
            letterSpacing: '1px'
          }}
        >
          Logicam
        </span>
      )}
    </div>
  );
};

export default Logo;
