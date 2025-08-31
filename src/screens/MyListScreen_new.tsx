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
        { 
          color: activeTab === tab 
            ? paperTheme.colors.primary 
            : paperTheme.colors.onSurface 
        }
      ]}>
        {title} ({count})
      </Text>
    </TouchableOpacity>
  );

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

  const renderFruitItem = ({ item }: { item: any }, isRecommended = false) => (
    <Card style={[styles.fruitCard, { backgroundColor: paperTheme.colors.surface }]}>
      <Card.Content>
        <View style={styles.fruitHeader}>
          <Text style={[styles.fruitName, { color: paperTheme.colors.onSurface }]}>{item.name}</Text>
          <IconButton
            icon={selectedFruitIds.includes(item.id) ? "minus-circle" : "plus-circle"}
            size={24}
            iconColor={selectedFruitIds.includes(item.id) ? "#ff4444" : paperTheme.colors.primary}
            onPress={() => {
              if (selectedFruitIds.includes(item.id)) {
                removeFruit(item.id);
              } else {
                addFruit(item.id);
              }
            }}
          />
        </View>
        
        {isRecommended && item.recommendationLevel && (
          <View style={styles.recommendationContainer}>
            <Chip 
              style={[styles.recommendationChip, { backgroundColor: '#4CAF50' }]}
              textStyle={{ color: '#FFF', fontSize: 12 }}
            >
              RECOMMENDED
            </Chip>
          </View>
        )}
        
        <Text style={[styles.fruitBenefits, { color: paperTheme.colors.onSurfaceVariant }]}>
          {item.benefits}
        </Text>
        
        {isRecommended && item.reasons && item.reasons.length > 0 && (
          <View style={styles.reasonsContainer}>
            <Text style={[styles.reasonsTitle, { color: paperTheme.colors.primary }]}>
              Medical Advice:
            </Text>
            {item.reasons.map((reason: string, index: number) => (
              <Text key={index} style={[styles.reasonText, { color: paperTheme.colors.onSurfaceVariant }]}>
                • {reason}
              </Text>
            ))}
          </View>
        )}
        
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

  const renderFruitsList = (fruits: any[], isRecommended = false) => (
    <FlatList
      data={fruits}
      renderItem={(itemInfo) => renderFruitItem(itemInfo, isRecommended)}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.fruitsList}
    />
  );

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
            {selectedFruits.length > 0 ? (
              renderFruitsList(selectedFruits, false)
            ) : (
              <Card style={[styles.emptyCard, { backgroundColor: paperTheme.colors.surface }]}>
                <Card.Content style={styles.emptyContent}>
                  <Ionicons name="basket-outline" size={60} color={isDark ? '#FFFFFF' : '#666'} />
                  <Text style={[styles.emptyTitle, { color: paperTheme.colors.onSurface }]}>
                    Your list is empty
                  </Text>
                  <Text style={[styles.emptyText, { color: paperTheme.colors.onSurfaceVariant }]}>
                    Add fruits from the Home page to see them here
                  </Text>
                </Card.Content>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* Recommended List Content */}
            {(!user?.conditions || user.conditions.length === 0) ? (
              <Card style={[styles.emptyCard, { backgroundColor: paperTheme.colors.surface }]}>
                <Card.Content style={styles.emptyContent}>
                  <Ionicons name="medical-outline" size={60} color={isDark ? '#FFFFFF' : '#666'} />
                  <Text style={[styles.emptyTitle, { color: paperTheme.colors.onSurface }]}>
                    No Medical Conditions Set
                  </Text>
                  <Text style={[styles.emptyText, { color: paperTheme.colors.onSurfaceVariant }]}>
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
                  <>
                    <View style={styles.actionButtons}>
                      <Button
                        mode="outlined"
                        onPress={addAllRecommended}
                        style={styles.actionButton}
                      >
                        Add All
                      </Button>
                      <Button
                        mode="outlined"
                        onPress={clearAllRecommended}
                        style={styles.actionButton}
                      >
                        Remove All
                      </Button>
                    </View>
                    {renderFruitsList(recommendedFruits, true)}
                  </>
                ) : (
                  <Card style={[styles.emptyCard, { backgroundColor: paperTheme.colors.surface }]}>
                    <Card.Content style={styles.emptyContent}>
                      <Ionicons name="medical-outline" size={60} color={isDark ? '#FFFFFF' : '#666'} />
                      <Text style={[styles.emptyTitle, { color: paperTheme.colors.onSurface }]}>
                        No recommendations available
                      </Text>
                      <Text style={[styles.emptyText, { color: paperTheme.colors.onSurfaceVariant }]}>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  conditionsCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  nutritionCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  nutritionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionButton: {
    flex: 0.45,
  },
  fruitsList: {
    paddingBottom: 20,
  },
  fruitCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  fruitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fruitName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  fruitBenefits: {
    fontSize: 14,
    marginBottom: 8,
  },
  recommendationContainer: {
    marginBottom: 8,
  },
  recommendationChip: {
    alignSelf: 'flex-start',
  },
  reasonsContainer: {
    marginBottom: 8,
  },
  reasonsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 12,
    marginBottom: 2,
  },
  nutritionInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nutritionChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  chipText: {
    fontSize: 12,
  },
  emptyCard: {
    borderRadius: 12,
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default MyListScreen;
