import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { FruitListProvider } from './src/contexts/FruitListContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const { paperTheme, isDark } = useTheme();
  
  return (
    <PaperProvider theme={paperTheme}>
      <AuthProvider>
        <FruitListProvider>
          <AppNavigator />
          <StatusBar style={isDark ? "light" : "dark"} />
        </FruitListProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
