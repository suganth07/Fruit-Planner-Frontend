import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { MedicalConditionsModal } from '../components/MedicalConditionsModal';

const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, paperTheme } = useTheme();
  const [showConditionsModal, setShowConditionsModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleConditionsUpdated = () => {
    // Force component re-render to reflect updated conditions
    setRefreshKey(prev => prev + 1);
  };

  const getConditionsDisplay = () => {
    if (!user?.conditions || user.conditions.length === 0) {
      return 'condition(s)';
    }
    return `condition(s)`;
  };

  const gradientColors: readonly [string, string] = isDark 
    ? ['#000000', '#1C1C1E'] 
    : ['#FFFFFF', '#F2F2F7'];

  const cardBackgroundColor = paperTheme.colors.surface;
  const textColor = paperTheme.colors.onSurface;
  const secondaryTextColor = isDark ? '#8E8E93' : '#6D6D70';

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: paperTheme.colors.onBackground }]}>Settings</Text>
        
        {/* User Information Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: paperTheme.colors.onBackground }]}>User Information</Text>
          <View style={[styles.userInfoContainer, { backgroundColor: cardBackgroundColor }]}>
            <View style={styles.userInfo}>
              <Ionicons name="person-circle" size={60} color={paperTheme.colors.primary} />
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: textColor }]}>
                  {user?.name || 'User'}
                </Text>
                <Text style={[styles.userEmail, { color: secondaryTextColor }]}>
                  {user?.email || 'user@email.com'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: paperTheme.colors.onBackground }]}>Appearance</Text>
          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: cardBackgroundColor }]} 
            onPress={toggleTheme}
          >
            <View style={styles.settingLeft}>
              <Ionicons 
                name={isDark ? 'moon' : 'sunny'} 
                size={24} 
                color={paperTheme.colors.primary} 
              />
              <Text style={[styles.settingText, { color: textColor }]}>Theme</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, { color: secondaryTextColor }]}>
                {isDark ? 'Dark' : 'Light'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Medical Conditions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: paperTheme.colors.onBackground }]}>Health Information</Text>
          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: cardBackgroundColor }]}
            onPress={() => setShowConditionsModal(true)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="medical" size={24} color={paperTheme.colors.primary} />
              <Text style={[styles.settingText, { color: textColor }]}>
                Medical Conditions
              </Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, { color: secondaryTextColor }]}>
                {getConditionsDisplay()}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Medical Conditions Modal */}
      <MedicalConditionsModal
        visible={showConditionsModal}
        onDismiss={() => setShowConditionsModal(false)}
        onConditionsUpdated={handleConditionsUpdated}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    paddingLeft: 4,
  },
  userInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  settingItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});

export default SettingsScreen;
