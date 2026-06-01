import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const lightTheme = {
    background: '#FDFBF7',
    surface: '#FFFFFF',
    text: '#27272A',
    primary: '#10B981',
    accent: '#059669',
    border: '#E5E5E5',
    secondaryText: '#71717A',
    success: '#16A34A',
    error: '#DC2626',
    warning: '#F59E0B',
    action: '#FBBF24',
  };

  const darkTheme = {
    background: '#18181B',
    surface: '#27272A',
    text: '#F4F4F5',
    primary: '#34D399',
    accent: '#10B981',
    border: '#3F3F46',
    secondaryText: '#A1A1AA',
    success: '#22C55E',
    error: '#EF4444',
    warning: '#FBBF24',
    action: '#FCD34D',
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
