import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, MD3DarkTheme } from 'react-native-paper';

export type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  paperTheme: typeof DefaultTheme;
  isDark: boolean;
}

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF', // iOS blue
    secondary: '#FF9500', // iOS orange
    tertiary: '#34C759', // iOS green
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F2F2F7',
    onSurface: '#000000',
    onBackground: '#000000',
    text: '#000000',
    error: '#FF3B30',
    outline: '#C7C7CC',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F8F8F8',
      level3: '#F0F0F0',
      level4: '#E8E8E8',
      level5: '#E0E0E0',
    },
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#0A84FF', // iOS dark mode blue
    secondary: '#FF9F0A', // iOS dark mode orange
    tertiary: '#32D74B', // iOS dark mode green
    background: '#000000',
    surface: '#1C1C1E',
    surfaceVariant: '#2C2C2E',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
    text: '#FFFFFF',
    error: '#FF453A',
    outline: '#48484A',
    elevation: {
      level0: 'transparent',
      level1: '#1C1C1E',
      level2: '#2C2C2E',
      level3: '#3A3A3C',
      level4: '#48484A',
      level5: '#58585A',
    },
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@app_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme: ThemeType = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      await AsyncStorage.setItem('@app_theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const paperTheme = theme === 'light' ? lightTheme : darkTheme;
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, paperTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
