import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFruitList } from '../contexts/FruitListContext';
import { useTheme } from '../contexts/ThemeContext';

interface FooterProps {
  activeTab: 'home' | 'mylist' | 'timetable' | 'settings';
  onTabPress: (tab: 'home' | 'mylist' | 'timetable' | 'settings') => void;
}

const Footer: React.FC<FooterProps> = ({ activeTab, onTabPress }) => {
  const { selectedFruitIds } = useFruitList();
  const { isDark, paperTheme } = useTheme();
  
  const activeColor = paperTheme.colors.primary;
  const inactiveColor = isDark ? '#8E8E93' : '#666';
  const backgroundColor = paperTheme.colors.surface;
  const borderColor = isDark ? paperTheme.colors.outline : '#e0e0e0';
  
  return (
    <View style={[styles.container, { backgroundColor, borderTopColor: borderColor }]}>
      <TouchableOpacity
        style={[
          styles.tab, 
          activeTab === 'home' && [styles.activeTab, { backgroundColor: `${activeColor}15` }]
        ]}
        onPress={() => onTabPress('home')}
      >
        <Ionicons
          name={activeTab === 'home' ? 'home' : 'home-outline'}
          size={24}
          color={activeTab === 'home' ? activeColor : inactiveColor}
        />
        <Text style={[
          styles.tabText, 
          { color: inactiveColor },
          activeTab === 'home' && [styles.activeTabText, { color: activeColor }]
        ]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab, 
          activeTab === 'mylist' && [styles.activeTab, { backgroundColor: `${activeColor}15` }]
        ]}
        onPress={() => onTabPress('mylist')}
      >
        <View style={styles.tabIconContainer}>
          <Ionicons
            name={activeTab === 'mylist' ? 'list' : 'list-outline'}
            size={24}
            color={activeTab === 'mylist' ? activeColor : inactiveColor}
          />
          {selectedFruitIds.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {selectedFruitIds.length > 99 ? '99+' : selectedFruitIds.length}
              </Text>
            </View>
          )}
        </View>
        <Text style={[
          styles.tabText, 
          { color: inactiveColor },
          activeTab === 'mylist' && [styles.activeTabText, { color: activeColor }]
        ]}>
          My List
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab, 
          activeTab === 'timetable' && [styles.activeTab, { backgroundColor: `${activeColor}15` }]
        ]}
        onPress={() => onTabPress('timetable')}
      >
        <Ionicons
          name={activeTab === 'timetable' ? 'calendar' : 'calendar-outline'}
          size={24}
          color={activeTab === 'timetable' ? activeColor : inactiveColor}
        />
        <Text style={[
          styles.tabText, 
          { color: inactiveColor },
          activeTab === 'timetable' && [styles.activeTabText, { color: activeColor }]
        ]}>
          Timetable
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab, 
          activeTab === 'settings' && [styles.activeTab, { backgroundColor: `${activeColor}15` }]
        ]}
        onPress={() => onTabPress('settings')}
      >
        <Ionicons
          name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
          size={24}
          color={activeTab === 'settings' ? activeColor : inactiveColor}
        />
        <Text style={[
          styles.tabText, 
          { color: inactiveColor },
          activeTab === 'settings' && [styles.activeTabText, { color: activeColor }]
        ]}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    // backgroundColor will be set dynamically
  },
  tabIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
});

export default Footer;
