import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import MyListScreen from '../screens/MyListScreen';
import TimetableScreen from '../screens/TimetableScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RecipesScreen from '../screens/RecipesScreen';
import Footer from '../components/Footer';
import FirstTimeSetupModal from '../components/FirstTimeSetupModal';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

const MainNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'mylist' | 'timetable' | 'Recipes' | 'settings'>('home');
  const { isFirstTimeLogin, setFirstTimeLoginComplete, updateUser, user } = useAuth();

  const handleSaveConditions = async (conditions: string[]) => {
    try {
      await apiService.put('/users/conditions', { conditions });
      
      // Update user context with new conditions
      if (user) {
        await updateUser({
          ...user,
          conditions
        });
      }
      
      setFirstTimeLoginComplete();
    } catch (error) {
      console.error('Error saving conditions:', error);
      // For now, just close the modal even if there's an error
      setFirstTimeLoginComplete();
    }
  };

  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'mylist':
        return <MyListScreen />;
      case 'timetable':
        return <TimetableScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'Recipes':
        return <RecipesScreen />;  
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderCurrentScreen()}
      </View>
      <Footer activeTab={activeTab} onTabPress={setActiveTab} />
      
      {/* First Time Setup Modal */}
      <FirstTimeSetupModal
        visible={isFirstTimeLogin}
        onDismiss={() => setFirstTimeLoginComplete()}
        onSave={handleSaveConditions}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});

export default MainNavigator;
