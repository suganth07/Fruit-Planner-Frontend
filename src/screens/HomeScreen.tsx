import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
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

const logo = require('../../assets/images/logo.png');

const FRUITS_PER_PAGE = 5;

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
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  
  // Component for displaying fruit image with emoji fallback
  const FruitImage = ({ fruitName }: { fruitName: string }) => {
    const [imageError, setImageError] = useState(false);
    const imageUrl = `https://raw.githubusercontent.com/suganth07/fruit-images/main/${fruitName.toLowerCase().replace(/\s+/g, '-')}.png`;
    const emoji = getFruitEmoji(fruitName);
    
    if (imageError) {
      return (
        <View style={[styles.fruitImage, styles.emojiContainer, { backgroundColor: isDark ? '#444444' : '#F5F5F5' }]}>
          <Text style={styles.fruitEmoji}>{emoji}</Text>
        </View>
      );
    }
    
    return (
      <Image 
        source={{ uri: imageUrl }}
        style={styles.fruitImage}
        onError={() => setImageError(true)}
      />
    );
  };

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
    // Use online images with fallback to emoji
    const getCardImageUrl = (fruitName: string) => {
      const imageName = fruitName.toLowerCase().replace(/\s+/g, '-');
      return `https://raw.githubusercontent.com/suganth07/fruit-images/main/${imageName}-card.jpg`;
    };

    const handleImageError = (fruitName: string) => {
      console.log('Failed to load card image for:', fruitName);
      setFailedImages(prev => new Set([...prev, fruitName]));
    };

    const hasImageFailed = failedImages.has(item.name);
    
    return (
      <Card style={[styles.fruitCard, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
        {/* Card Image - Top 30% */}
        <View style={styles.cardImageContainer}>
          {!hasImageFailed ? (
            <Image 
              source={{ uri: getCardImageUrl(item.name) }}
              style={styles.cardImage}
              onError={() => handleImageError(item.name)}
            />
          ) : (
            <View style={[styles.cardImage, styles.emojiCardContainer, { backgroundColor: isDark ? '#444444' : '#F0F0F0' }]}>
              <Text style={styles.cardEmoji}>{getFruitEmoji(item.name)}</Text>
            </View>
          )}
          <View style={styles.imageOverlay}>
            <Text style={styles.cardFruitName}>{item.name}</Text>
          </View>
        </View>
        
        {/* Card Content - Bottom 70% */}
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.fruitBenefits, { color: isDark ? '#CCCCCC' : '#666666' }]} numberOfLines={2}>
              {item.benefits}
            </Text>
            <Checkbox
              status={isFruitSelected(item.id) ? 'checked' : 'unchecked'}
              onPress={() => handleFruitToggle(item.id)}
              theme={paperTheme}
            />
          </View>
          
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
      {/* Loading State */}
      {isLoadingFruits ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={paperTheme.colors.primary} />
          <Text style={[styles.loadingText, { color: paperTheme.colors.onBackground }]}>
            Loading fruits...
          </Text>
        </View>
      ) : (
        <FlatList
          data={paginatedFruits}
          renderItem={renderFruitCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          contentContainerStyle={styles.fruitsList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={styles.headerContent}>
              <Image
                source={logo}
                style={styles.logo}
              />
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
            </View>
          )}
          ListFooterComponent={() => (
            totalPages > 1 ? (
              <View style={styles.paginationContainer}>
                {renderPagination()}
              </View>
            ) : null
          )}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 40,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fruitCard: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  cardImageContainer: {
    height: 120, // 30% of typical card height
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emojiCardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  cardEmoji: {
    fontSize: 60,
    textAlign: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cardFruitName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardContent: {
    padding: 16,
    minHeight: 140, // 70% of typical card height
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fruitBenefits: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    marginRight: 12,
  },
  nutritionInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  nutritionChip: {
    height: 28,
    marginRight: 6,
    marginBottom: 4,
    borderRadius: 14,
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
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  paginationContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  paginationWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 60,
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
    color: '#130f0fff',
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
  // Legacy styles - keeping for compatibility
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  fruitCardContent: {
    padding: 16,
  },
  fruitHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fruitImageContainer: {
    marginRight: 12,
  },
  fruitImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  emojiContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  fruitEmoji: {
    fontSize: 30,
  },
  fruitDetails: {
    flex: 1,
  },
  fruitTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  fruitName: {
    fontSize: 18,
    fontWeight: 'bold',
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
