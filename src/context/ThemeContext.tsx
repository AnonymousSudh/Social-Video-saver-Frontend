// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export const LightColors = {
  background: '#F3F4F6', // Light gray background (Gray-100)
  surface: '#FFFFFF', // Solid white
  surfaceLight: '#E5E7EB', // Medium light gray (Gray-200)
  primary: '#FF006E',
  primaryGradientStart: '#FF4D6D',
  primaryGradientEnd: '#FF006E',
  secondaryAccent: '#8338EC',
  success: '#06D6A0',
  text: '#111827', // Dark text (Gray-900)
  textSecondary: '#4B5563', // Muted dark text (Gray-600)
  textMuted: '#9CA3AF', // Gray-400
  border: '#E5E7EB',
  glassBackground: 'rgba(255, 255, 255, 0.9)',
  glassBorder: 'rgba(0, 0, 0, 0.06)',
  error: '#FF4D6D',
  warning: '#FFBE0B',
};

export const DarkColors = {
  background: '#0F1115',
  surface: '#1A1D24',
  surfaceLight: '#252932',
  primary: '#FF006E',
  primaryGradientStart: '#FF4D6D',
  primaryGradientEnd: '#FF006E',
  secondaryAccent: '#8338EC',
  success: '#06D6A0',
  text: '#FFFFFF',
  textSecondary: '#B5B5B5',
  textMuted: '#6D7480',
  border: 'rgba(255, 255, 255, 0.08)',
  glassBackground: 'rgba(26, 29, 36, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.06)',
  error: '#FF4D6D',
  warning: '#FFBE0B',
};

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: typeof DarkColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const colors = isDarkMode ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};
