import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { 
  Text, 
  Card,
  Searchbar,
  Checkbox,
  Chip,
  ActivityIndicator
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useFruitList } from '../contexts/FruitListContext';
import { getFruitEmoji, getRecommendationStyle } from '../utils/fruitUtils';

const FRUITS_PER_PAGE = 6;

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { isDark, paperTheme } = useTheme();
  const { 
    selectedFruitIds, 
    allFruits, 
    isLoadingFruits,
    addFruit, 
    removeFruit, 
    isFruitSelected 
  } = useFruitList();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter fruits based on search query only
  const filteredFruits = useMemo(() => {
    return allFruits.filter(fruit => 
      fruit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fruit.benefits.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allFruits]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredFruits.length / FRUITS_PER_PAGE);
  const startIndex = (currentPage - 1) * FRUITS_PER_PAGE;
  const paginatedFruits = filteredFruits.slice(startIndex, startIndex + FRUITS_PER_PAGE);

  const handleFruitToggle = (fruitId: number) => {
    if (isFruitSelected(fruitId)) {
      removeFruit(fruitId);
    } else {
      addFruit(fruitId);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderFruitCard = ({ item }: { item: any }) => {
    const emoji = getFruitEmoji(item.name);
    
    return (
      <Card style={[styles.fruitCard, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
        <Card.Content style={styles.fruitCardContent}>
          <View style={styles.fruitHeader}>
            <View style={styles.fruitTitleRow}>
              <Text style={styles.fruitEmoji}>{emoji}</Text>
              <Text style={[styles.fruitName, { color: isDark ? '#FFFFFF' : '#333333' }]}>{item.name}</Text>
            </View>
            <Checkbox
              status={isFruitSelected(item.id) ? 'checked' : 'unchecked'}
              onPress={() => handleFruitToggle(item.id)}
              theme={paperTheme}
            />
          </View>
          
          <Text style={[styles.fruitBenefits, { color: isDark ? '#CCCCCC' : '#666666' }]} numberOfLines={2}>
            {item.benefits}
          </Text>
          
          <View style={styles.nutritionInfo}>
            <Chip style={[styles.nutritionChip, { backgroundColor: isDark ? '#444444' : 'rgba(98, 0, 238, 0.1)' }]} 
                  textStyle={[styles.chipText, { color: isDark ? '#FFFFFF' : '#6200ee' }]}>
              {item.calories} cal
            </Chip>
            <Chip style={[styles.nutritionChip, { backgroundColor: isDark ? '#444444' : 'rgba(98, 0, 238, 0.1)' }]} 
                  textStyle={[styles.chipText, { color: isDark ? '#FFFFFF' : '#6200ee' }]}>
              {item.fiber}g fiber
            </Chip>
            <Chip style={[styles.nutritionChip, { backgroundColor: isDark ? '#444444' : 'rgba(98, 0, 238, 0.1)' }]} 
                  textStyle={[styles.chipText, { color: isDark ? '#FFFFFF' : '#6200ee' }]}>
              {item.vitaminC}mg C
            </Chip>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderPagination = () => (
    <View style={styles.paginationWrapper}>
      {/* Previous Button */}
      <TouchableOpacity
        style={[
          styles.navButton,
          currentPage === 1 && styles.navButtonDisabled
        ]}
        onPress={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Ionicons 
          name="chevron-back" 
          size={2} 
          color={currentPage === 1 ? '#666' : '#FFF'} 
        />
        <Text style={[
          styles.navButtonText,
          currentPage === 1 && styles.navButtonTextDisabled
        ]}>
          Prev
        </Text>
      </TouchableOpacity>

      {/* Page Info */}
      <View style={styles.pageInfo}>
        <Text style={styles.pageInfoText}>
          {currentPage} of {totalPages}
        </Text>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.navButton,
          currentPage === totalPages && styles.navButtonDisabled
        ]}
        onPress={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text style={[
          styles.navButtonText,
          currentPage === totalPages && styles.navButtonTextDisabled
        ]}>
          Next
        </Text>
        <Ionicons 
          name="chevron-forward" 
          size={2} 
          color={currentPage === totalPages ? '#666' : '#FFF'} 
        />
      </TouchableOpacity>
    </View>
  );

  const gradientColors: readonly [string, string] = isDark 
    ? ['#000000', '#1C1C1E'] 
    : ['#FFFFFF', '#F2F2F7'];

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: paperTheme.colors.onBackground }]}>Discover Fruits</Text>
        <Text style={[styles.subtitle, { color: paperTheme.colors.onBackground }]}>
          Browse and add fruits to your personal list
        </Text>

        {/* Search Bar */}
        <Searchbar
          placeholder="Search fruits..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}
          inputStyle={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#333333' }]}
          iconColor={isDark ? '#FFFFFF' : '#666666'}
          placeholderTextColor={isDark ? '#999999' : '#666666'}
          theme={paperTheme}
        />

        {/* Selected Fruits Counter */}
        {selectedFruitIds.length > 0 && (
          <View style={[styles.selectedCounter, { backgroundColor: isDark ? '#6200ee' : 'rgba(98, 0, 238, 0.9)' }]}>
            <Text style={styles.selectedText}>
              {selectedFruitIds.length} fruit{selectedFruitIds.length !== 1 ? 's' : ''} selected
            </Text>
          </View>
        )}

        {/* Loading State */}
        {isLoadingFruits ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={paperTheme.colors.primary} />
            <Text style={[styles.loadingText, { color: paperTheme.colors.onBackground }]}>
              Loading fruits...
            </Text>
          </View>
        ) : (
          <>
            {/* Fruits List */}
            <FlatList
              data={paginatedFruits}
              renderItem={renderFruitCard}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.fruitsList}
              showsVerticalScrollIndicator={false}
            />

            {/* Pagination */}
            {totalPages > 1 && renderPagination()}
          </>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBar: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  searchInput: {
    fontSize: 16,
  },
  selectedCounter: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  fruitsList: {
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
  fruitCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fruitCardContent: {
    padding: 12,
  },
  fruitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fruitTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fruitEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  fruitName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  fruitBenefits: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  nutritionInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  nutritionChip: {
    height: 26,
    marginRight: 4,
    marginBottom: 2,
    borderRadius: 13,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  paginationWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginHorizontal: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 80,
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  navButtonDisabled: {
    backgroundColor: '#444',
    elevation: 1,
    shadowOpacity: 0.1,
  },
  navButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: '#888',
  },
  pageInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageInfoText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  recommendationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 10,
    fontWeight: '600',
  },
  medicalReason: {
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 12,
  },
});

export default HomeScreen;
