import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Divider, Button, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useFruitList } from '../contexts/FruitListContext';
import { planService, WeeklyPlan, DailyPlan } from '../services/planService';

const TimetableScreen: React.FC = () => {
  const { user } = useAuth();
  const { isDark, paperTheme } = useTheme();
  const { selectedFruitIds } = useFruitList();
  const [currentPlan, setCurrentPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchCurrentPlan();
    }
  }, [user?.id]);

  const fetchCurrentPlan = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const plan = await planService.getCurrentWeekPlan(parseInt(user.id));
      setCurrentPlan(plan);
    } catch (error) {
      console.error('Error fetching current plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPlan = async () => {
    if (!user?.id) return;

    setGenerating(true);
    try {
      const result = await planService.generateWeeklyPlan({
        userId: parseInt(user.id),
        selectedFruits: selectedFruitIds,
        preferences: {
          mealsPerDay: 3,
          servingsPerMeal: 1,
          variety: true
        }
      });

      setCurrentPlan(result.plan);
      Alert.alert('Success!', 'Your new weekly plan has been generated!');
    } catch (error) {
      console.error('Error generating plan:', error);
      Alert.alert('Error', 'Failed to generate weekly plan. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const renderDayPlan = (dayPlan: DailyPlan) => (
    <View key={dayPlan.day} style={styles.dayPlan}>
      <Text style={[styles.dayTitle, { color: paperTheme.colors.onSurface }]}>{dayPlan.dayName}</Text>
      <View style={styles.dayFruits}>
        {dayPlan.fruits.map((fruit, index) => (
          <View key={index} style={styles.fruitItem}>
            <Text style={[styles.fruitInfo, { color: paperTheme.colors.onSurface }]}>
              {planService.getTimeOfDayDisplay(fruit.timeOfDay)}: {fruit.fruitName} x{fruit.quantity}
            </Text>
            <Text style={[styles.fruitBenefits, { color: paperTheme.colors.onSurface }]}>{fruit.benefits}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      
      <LinearGradient colors={['#777982ff', '#0f0716ff']} style={styles.container}>
    
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={[styles.loadingText, { color: paperTheme.colors.onBackground }]}>Loading your weekly plan...</Text>
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
        <Text style={[styles.title, { color: paperTheme.colors.onBackground }]}>Weekly Meal Planner</Text>
        <Text style={[styles.subtitle, { color: paperTheme.colors.onBackground }]}>AI-powered recommendations for {user?.name}</Text>
        
        {currentPlan ? (
          <>
            {/* Current Plan */}
            <Card style={[styles.weeklyCard, { backgroundColor: paperTheme.colors.surface }]}>
              <Card.Content>
                <View style={styles.planHeader}>
                  <View style={styles.planTitleSection}>
                    <Text style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>📅 This Week's Plan</Text>
                    <Text style={[styles.planDate, { color: paperTheme.colors.onSurface }]}>
                      Week {currentPlan.week}, {currentPlan.year}
                    </Text>
                    <Text style={[styles.lastUpdated, { color: paperTheme.colors.onSurface }]}>
                      Last updated: {new Date(currentPlan.updatedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Button
                    mode="outlined"
                    compact
                    icon="refresh"
                    onPress={fetchCurrentPlan}
                    loading={loading}
                    disabled={loading}
                    style={styles.refreshButtonInline}
                    labelStyle={styles.refreshButtonLabel}
                  >
                    Refresh
                  </Button>
                </View>
                <Divider style={styles.divider} />
                
                {currentPlan.planData.map(renderDayPlan)}
              </Card.Content>
            </Card>


            {/* Nutritional Summary */}
            <Card style={[styles.nutritionCard, { backgroundColor: paperTheme.colors.surface }]}>
              <Card.Content>
                <Text style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>📊 Weekly Nutrition</Text>
                <Divider style={styles.divider} />
                <Text style={[styles.nutritionText, { color: paperTheme.colors.onSurface }]}>
                  {planService.formatNutritionalSummary(currentPlan.nutritionalSummary)}
                </Text>
              </Card.Content>
            </Card>
          </>
        ) : (
          /* No Plan Available */
          <Card style={[styles.noPlanCard, { backgroundColor: paperTheme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.noPlanTitle, { color: paperTheme.colors.onSurface }]}>No Plan Available</Text>
              <Text style={[styles.noPlanText, { color: paperTheme.colors.onSurface }]}>
                Generate your first AI-powered weekly meal plan based on your selected fruits and medical conditions.
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Generate Current Plan Button */}
        <Card style={[styles.generateCard, { backgroundColor: paperTheme.colors.surface }]}>
          <Card.Content>
            <Text style={styles.sectionTitle}>� Generate Current Plan</Text>
            <Divider style={styles.divider} />
            <Text style={[styles.actionText, { color: paperTheme.colors.onSurface }]}>
              Create a new AI-powered weekly meal plan using your selected fruits and medical conditions.
            </Text>
            <Text style={[styles.actionSubtext, { color: paperTheme.colors.onSurface }]}>
              {selectedFruitIds.length > 0 
                ? `✅ Ready to generate with ${selectedFruitIds.length} selected fruits`
                : '⚠️ Select fruits from the Home tab first'
              }
            </Text>
            <Button 
              mode="contained" 
              style={styles.generateButton}
              buttonColor="#4CAF50"
              icon="plus-circle"
              onPress={generateNewPlan}
              loading={generating}
              disabled={generating || selectedFruitIds.length === 0}
            >
              {currentPlan ? 'Generate New Plan' : 'Create My First Plan'}
            </Button>
          </Card.Content>
        </Card>
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
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  recommendationsCard: {
    marginBottom: 20,
    borderRadius: 16,
  },
  weeklyCard: {
    marginBottom: 20,
    borderRadius: 16,
  },
  explanationCard: {
    marginBottom: 20,
    borderRadius: 16,
  },
  nutritionCard: {
    marginBottom: 20,
    borderRadius: 16,
  },
  noPlanCard: {
    marginBottom: 20,
    borderRadius: 16,
  },
  actionCard: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
  },
  generateCard: {
    marginBottom: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  statsCard: {
    marginBottom: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  divider: {
    marginBottom: 16,
  },
  planDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  planTitleSection: {
    flex: 1,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
  refreshButtonInline: {
    borderColor: '#2196F3',
    marginLeft: 16,
  },
  refreshButtonLabel: {
    fontSize: 12,
    color: '#2196F3',
  },
  fruitItem: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  fruitInfo: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  fruitBenefits: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  fruitText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  explanationText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  nutritionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  noPlanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  noPlanText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  dayPlan: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  dayFruits: {
    marginLeft: 10,
  },
  dayFruit: {
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
    color: '#333',
  },
  actionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  actionSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  generateButton: {
    marginBottom: 12,
    borderRadius: 8,
  },
  refreshButton: {
    borderRadius: 8,
    borderColor: '#6200ee',
  },
  customizeButton: {
    borderRadius: 8,
    borderColor: '#6200ee',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default TimetableScreen;
