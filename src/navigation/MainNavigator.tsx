import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import MyListScreen from '../screens/MyListScreen';
import TimetableScreen from '../screens/TimetableScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Footer from '../components/Footer';

const MainNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'mylist' | 'timetable' | 'settings'>('home');

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
