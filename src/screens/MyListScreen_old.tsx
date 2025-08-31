import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { 
  Text, 
  Card,
  Button,
  Chip,
  IconButton
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useFruitList } from '../contexts/FruitListContext';

const MyListScreen: React.FC = () => {
  const { user } = useAuth();
  const { isDark, paperTheme } = useTheme();
  const { 
    selectedFruitIds, 
    personalizedFruits, 
    allFruits,
    removeFruit, 
    clearAllFruits, 
    addFruit 
  } = useFruitList();
  const [activeTab, setActiveTab] = useState<'myList' | 'recommended'>('myList');

  const selectedFruits = allFruits.filter(fruit => selectedFruitIds.includes(fruit.id));

  const getRecommendedFruits = () => {
    // Use personalized fruits from API that are marked as 'recommended'
    return personalizedFruits.filter(fruit => fruit.recommendationLevel === 'recommended');
  };

  const clearAllRecommended = () => {
    const recommendedFruits = getRecommendedFruits();
    recommendedFruits.forEach(fruit => {
      if (selectedFruitIds.includes(fruit.id)) {
        removeFruit(fruit.id);
      }
    });
  };

  const addAllRecommended = () => {
    const recommendedFruits = getRecommendedFruits();
    recommendedFruits.forEach(fruit => {
      if (!selectedFruitIds.includes(fruit.id)) {
        addFruit(fruit.id);
      }
    });
  };

  const getTotalNutrition = (fruits = selectedFruits) => {
    return fruits.reduce(
      (total, fruit) => ({
        calories: total.calories + fruit.calories,
        fiber: total.fiber + fruit.fiber,
        vitaminC: total.vitaminC + fruit.vitaminC,
        potassium: total.potassium + fruit.potassium
      }),
      { calories: 0, fiber: 0, vitaminC: 0, potassium: 0 }
    );
  };

  const recommendedFruits = getRecommendedFruits();
  const totalNutrition = getTotalNutrition();
  const recommendedNutrition = getTotalNutrition(recommendedFruits);

  const renderTabButton = (tab: 'myList' | 'recommended', title: string, count: number) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[
        styles.tabText, 
        { color: activeTab === tab ? '#6200ee' : paperTheme.colors.onBackground },
        activeTab === tab && styles.activeTabText
      ]}>
        {title}
      </Text>
      {count > 0 && (
        <View style={[styles.tabBadge, activeTab === tab && styles.activeTabBadge]}>
          <Text style={[styles.tabBadgeText, activeTab === tab && styles.activeTabBadgeText]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderRecommendedInfo = () => {
    if (!user?.conditions || user.conditions.length === 0) {
      return (
        <Card style={[styles.infoCard, { backgroundColor: paperTheme.colors.surface }]}>
          <Card.Content style={styles.infoCardContent}>
            <MaterialIcons name="info" size={48} color={paperTheme.colors.primary} />
            <Text style={[styles.infoTitle, { color: paperTheme.colors.onSurface }]}>
              No Medical Conditions Set
            </Text>
            <Text style={[styles.infoSubtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
              To get personalized fruit recommendations, please add your medical conditions in Settings.
            </Text>
            <Button
              mode="contained"
              onPress={() => {/* Navigate to settings - implement navigation */}}
              style={styles.infoButton}
            >
              Go to Settings
            </Button>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={[styles.infoCard, { backgroundColor: paperTheme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>
            🩺 Based on Your Conditions
          </Text>
          <Text style={[styles.infoSubtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
            Recommendations for: {user.conditions.map(c => c.replace(/_/g, ' ')).join(', ')}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  const renderNutritionCard = (title: string, nutrition: any, count: number) => (
    <Card style={[styles.nutritionCard, { backgroundColor: paperTheme.colors.surface }]}>
      <Card.Content>
        <Text style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>📊 {title}</Text>
        <Text style={[styles.nutritionSubtitle, { color: paperTheme.colors.onSurface }]}>
          {count} fruit{count !== 1 ? 's' : ''} • Total nutrition per serving
        </Text>
        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionNumber}>{nutrition.calories}</Text>
            <Text style={styles.nutritionLabel}>Calories</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionNumber}>{nutrition.fiber.toFixed(1)}g</Text>
            <Text style={styles.nutritionLabel}>Fiber</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionNumber}>{nutrition.vitaminC.toFixed(1)}mg</Text>
            <Text style={styles.nutritionLabel}>Vitamin C</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionNumber}>{nutrition.potassium}</Text>
            <Text style={styles.nutritionLabel}>Potassium</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderFruitsList = (fruits: any[], isRecommended = false) => (
    <Card style={[styles.fruitsCard, { backgroundColor: paperTheme.colors.surface }]}>
      <Card.Content>
        <View style={styles.fruitsHeader}>
          <Text style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>
            {isRecommended ? '💊 Recommended Fruits' : '🍎 Selected Fruits'}
          </Text>
          <Button 
            mode="text" 
            textColor="#e74c3c"
            onPress={isRecommended ? clearAllRecommended : clearAllFruits}
          >
            Clear All
          </Button>
        </View>
        
        {isRecommended && selectedDiseases.length > 0 && (
          <View style={styles.recommendationInfo}>
            <Text style={[styles.recommendationText, { color: '#000' }]}>
              Based on: {selectedDiseases.join(', ')}
            </Text>
            <Button
              mode="contained"
              style={styles.addAllButton}
              buttonColor="#4CAF50"
              onPress={addAllRecommended}
            >
              Add All to My List
            </Button>
          </View>
        )}
        
        {fruits.map((fruit) => (
          <View key={fruit.id} style={styles.fruitItem}>
            <View style={styles.fruitInfo}>
              <View style={styles.fruitHeader}>
                <Text style={styles.fruitEmoji}>{fruit.emoji}</Text>
                <Text style={[styles.fruitName, { color: paperTheme.colors.onSurface }]}>{fruit.name}</Text>
                {isRecommended && selectedFruitIds.includes(fruit.id) && (
                  <Chip style={styles.addedChip} textStyle={styles.addedChipText}>
                    Added
                  </Chip>
                )}
              </View>
              <Text style={[styles.fruitBenefits, { color: paperTheme.colors.onSurface }]} numberOfLines={2}>
                {fruit.benefits}
              </Text>
              <View style={styles.fruitNutrition}>
                <Chip style={styles.nutritionChip} textStyle={styles.chipText}>
                  {fruit.calories} cal
                </Chip>
                <Chip style={styles.nutritionChip} textStyle={styles.chipText}>
                  {fruit.fiber}g fiber
                </Chip>
                <Chip style={styles.nutritionChip} textStyle={styles.chipText}>
                  {fruit.vitaminC}mg C
                </Chip>
              </View>
            </View>
            {isRecommended ? (
              <IconButton
                icon={selectedFruitIds.includes(fruit.id) ? "check" : "plus"}
                iconColor={selectedFruitIds.includes(fruit.id) ? "#4CAF50" : "#6200ee"}
                size={24}
                onPress={() => {
                  if (selectedFruitIds.includes(fruit.id)) {
                    removeFruit(fruit.id);
                  } else {
                    addFruit(fruit.id);
                  }
                }}
              />
            ) : (
              <IconButton
                icon="close"
                iconColor="#e74c3c"
                size={20}
                onPress={() => removeFruit(fruit.id)}
              />
            )}
          </View>
        ))}
      </Card.Content>
    </Card>
  );

  if (selectedFruits.length === 0 && activeTab === 'myList') {
    return (
      <LinearGradient colors={['#777982ff', '#0f0716ff']} style={styles.container}>
        <View style={styles.emptyContent}>
          <View style={styles.tabContainer}>
            {renderTabButton('myList', 'My List', selectedFruits.length)}
            {renderTabButton('recommended', 'Recommended', recommendedFruits.length)}
          </View>
          <View style={styles.emptyContainer}>
            <Ionicons name="basket-outline" size={80} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.emptyTitle}>Your fruit list is empty</Text>
            <Text style={styles.emptyText}>
              Go to the Home tab to discover and add fruits to your personalized list
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  const gradientColors: readonly [string, string] = isDark 
    ? ['#000000', '#1C1C1E'] 
    : ['#FFFFFF', '#F2F2F7'];

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: paperTheme.colors.onBackground }]}>My Fruit Center</Text>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {renderTabButton('myList', 'My List', selectedFruits.length)}
          {renderTabButton('recommended', 'Recommended', recommendedFruits.length)}
        </View>

        {activeTab === 'myList' ? (
          <>
            {/* My List Content */}
            {renderNutritionCard('My Nutrition Summary', totalNutrition, selectedFruits.length)}
            {renderFruitsList(selectedFruits, false)}
          </>
        ) : (
          <>
            {/* Recommended List Content */}
            {(!user?.conditions || user.conditions.length === 0) ? (
              <Card style={[styles.emptyRecommendationCard, { backgroundColor: paperTheme.colors.surface }]}>
                <Card.Content style={styles.emptyRecommendationContent}>
                  <Ionicons name="medical-outline" size={60} color={isDark ? '#FFFFFF' : '#666'} />
                  <Text style={[styles.emptyRecommendationTitle, { color: paperTheme.colors.onSurface }]}>
                    No Medical Conditions Set
                  </Text>
                  <Text style={[styles.emptyRecommendationText, { color: paperTheme.colors.onSurface }]}>
                    To get personalized fruit recommendations, please add your medical conditions in Settings.
                  </Text>
                </Card.Content>
              </Card>
            ) : (
              <>
                {/* Show current conditions */}
                <Card style={[styles.conditionsCard, { backgroundColor: paperTheme.colors.surface }]}>
                  <Card.Content>
                    <Text style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>
                      🩺 Your Medical Conditions
                    </Text>
                    <Text style={[styles.subtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
                      Recommendations based on: {user.conditions.map(c => c.replace(/_/g, ' ')).join(', ')}
                    </Text>
                  </Card.Content>
                </Card>
                
                {renderNutritionCard('Recommended Nutrition', recommendedNutrition, recommendedFruits.length)}
                {recommendedFruits.length > 0 ? (
                  renderFruitsList(recommendedFruits, true)
                ) : (
                  <Card style={[styles.emptyRecommendationCard, { backgroundColor: paperTheme.colors.surface }]}>
                    <Card.Content style={styles.emptyRecommendationContent}>
                      <Ionicons name="medical-outline" size={60} color={isDark ? '#FFFFFF' : '#666'} />
                      <Text style={[styles.emptyRecommendationTitle, { color: paperTheme.colors.onSurface }]}>
                        No recommendations available
                      </Text>
                      <Text style={[styles.emptyRecommendationText, { color: paperTheme.colors.onSurface }]}>
                        We're working to provide better fruit recommendations for your selected conditions.
                      </Text>
                    </Card.Content>
                  </Card>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
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
  conditionsCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  emptyContent: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  // Tab Navigation Styles
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 21,
  },
  activeTabButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#6200ee',
  },
  tabBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  activeTabBadge: {
    backgroundColor: '#6200ee',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  activeTabBadgeText: {
    color: '#fff',
  },
  // Disease Selector Styles
  diseaseSelectorCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  diseaseSearchBar: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  diseaseSearchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diseaseSearchPlaceholder: {
    marginLeft: 8,
    color: '#666',
    fontSize: 16,
  },
  selectedDiseasesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  diseaseChip: {
    backgroundColor: '#e3f2fd',
    marginRight: 8,
    marginBottom: 8,
  },
  diseaseChipText: {
    color: '#1976d2',
    fontSize: 14,
  },
  // Modal Styles
  modalCard: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchBar: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  diseaseList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  modalCloseButton: {
    borderColor: '#6200ee',
  },
  // Empty States
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyRecommendationCard: {
    marginBottom: 20,
    borderRadius: 16,
  },
  emptyRecommendationContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyRecommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyRecommendationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Cards
  nutritionCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  fruitsCard: {
    marginBottom: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  nutritionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  // Fruits List
  fruitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recommendationInfo: {
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  recommendationText: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 8,
  },
  addAllButton: {
    borderRadius: 8,
  },
  fruitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fruitInfo: {
    flex: 1,
  },
  fruitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fruitEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  fruitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  addedChip: {
    backgroundColor: '#e8f5e8',
    height: 24,
  },
  addedChipText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  fruitBenefits: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  fruitNutrition: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  nutritionChip: {
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    height: 28,
  },
  chipText: {
    fontSize: 12,
    color: '#6200ee',
    fontWeight: '600',
  },
});

export default MyListScreen;
