import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { 
  Text, 
  Card,
  Searchbar,
  Checkbox,
  Chip
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useFruitList } from '../contexts/FruitListContext';
import { fruitsData, FruitData } from '../data/fruits';

const FRUITS_PER_PAGE = 6;

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { isDark, paperTheme } = useTheme();
  const { selectedFruitIds, addFruit, removeFruit, isFruitSelected } = useFruitList();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter fruits based on search query
  const filteredFruits = useMemo(() => {
    return fruitsData.filter(fruit => 
      fruit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fruit.benefits.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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

  const renderFruitCard = ({ item }: { item: FruitData }) => (
    <Card style={[styles.fruitCard, { backgroundColor: paperTheme.colors.surface }]}>
      <Card.Content style={styles.fruitCardContent}>
        <View style={styles.fruitHeader}>
          <View style={styles.fruitTitleRow}>
            <Text style={styles.fruitEmoji}>{item.emoji}</Text>
            <Text style={[styles.fruitName, { color: paperTheme.colors.onSurface }]}>{item.name}</Text>
          </View>
          <Checkbox
            status={isFruitSelected(item.id) ? 'checked' : 'unchecked'}
            onPress={() => handleFruitToggle(item.id)}
            theme={paperTheme}
          />
        </View>
        
        <Text style={[styles.fruitBenefits, { color: paperTheme.colors.onSurface }]} numberOfLines={2}>
          {item.benefits}
        </Text>
        
        <View style={styles.nutritionInfo}>
          <Chip style={[styles.nutritionChip, { backgroundColor: paperTheme.colors.surfaceVariant }]} 
                textStyle={[styles.chipText, { color: paperTheme.colors.onSurface }]}>
            {item.calories} cal
          </Chip>
          <Chip style={[styles.nutritionChip, { backgroundColor: paperTheme.colors.surfaceVariant }]} 
                textStyle={[styles.chipText, { color: paperTheme.colors.onSurface }]}>
            {item.fiber}g fiber
          </Chip>
          <Chip style={[styles.nutritionChip, { backgroundColor: paperTheme.colors.surfaceVariant }]} 
                textStyle={[styles.chipText, { color: paperTheme.colors.onSurface }]}>
            {item.vitaminC}mg C
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
        onPress={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? '#ccc' : '#6200ee'} />
        <Text style={[styles.paginationText, currentPage === 1 && styles.disabledText]}>
          Previous
        </Text>
      </TouchableOpacity>

      <View style={styles.pageNumbers}>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = i + Math.max(1, currentPage - 2);
          if (pageNum > totalPages) return null;
          
          return (
            <TouchableOpacity
              key={pageNum}
              style={[
                styles.pageNumber,
                currentPage === pageNum && styles.activePageNumber
              ]}
              onPress={() => handlePageChange(pageNum)}
            >
              <Text style={[
                styles.pageNumberText,
                currentPage === pageNum && styles.activePageNumberText
              ]}>
                {pageNum}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
        onPress={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text style={[styles.paginationText, currentPage === totalPages && styles.disabledText]}>
          Next
        </Text>
        <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? '#ccc' : '#6200ee'} />
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
        <Text style={[styles.subtitle, { color: paperTheme.colors.onBackground }]}>Find the perfect fruits for your health</Text>

        {/* Search Bar */}
        <Searchbar
          placeholder="Search fruits..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: paperTheme.colors.surface }]}
          inputStyle={[styles.searchInput, { color: paperTheme.colors.onSurface }]}
          theme={paperTheme}
        />

        {/* Selected Fruits Counter */}
        {selectedFruitIds.length > 0 && (
          <View style={[styles.selectedCounter, { backgroundColor: paperTheme.colors.primary }]}>
            <Text style={styles.selectedText}>
              {selectedFruitIds.length} fruit{selectedFruitIds.length !== 1 ? 's' : ''} selected
            </Text>
          </View>
        )}

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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
  },
  searchInput: {
    fontSize: 16,
  },
  selectedCounter: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignSelf: 'center',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
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
    color: '#333',
    flex: 1,
  },
  fruitBenefits: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 8,
  },
  nutritionInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  nutritionChip: {
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    height: 24,
  },
  chipText: {
    fontSize: 10,
    color: '#6200ee',
    fontWeight: '600',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 4,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationText: {
    color: '#6200ee',
    fontWeight: '600',
    marginHorizontal: 4,
  },
  disabledText: {
    color: '#ccc',
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  activePageNumber: {
    backgroundColor: '#6200ee',
  },
  pageNumberText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  activePageNumberText: {
    color: '#fff',
  },
});

export default HomeScreen;
