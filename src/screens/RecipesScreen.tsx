import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  Modal,
  Portal,
  ActivityIndicator,
  Divider,
  IconButton
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { saladRecipes, SaladRecipe } from '../data/salads';
import { youtubeService, YouTubeVideo } from '../services/youtubeService';

const { width } = Dimensions.get('window');

const RecipesScreen: React.FC = () => {
  const { isDark, paperTheme } = useTheme();
  const { user } = useAuth();
  const [selectedSalad, setSelectedSalad] = useState<SaladRecipe | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoData, setVideoData] = useState<YouTubeVideo | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Recipes', icon: '🥗' },
    { key: 'fruit', label: 'Fruit Salads', icon: '🍓' },
    { key: 'green', label: 'Green Salads', icon: '🥬' },
    { key: 'mixed', label: 'Mixed Salads', icon: '🥒' },
    { key: 'protein', label: 'Protein Bowls', icon: '🍲' }
  ];

  const filteredRecipes = selectedCategory === 'all' 
    ? saladRecipes 
    : saladRecipes.filter(recipe => recipe.type === selectedCategory);

  const handleSaladPress = (salad: SaladRecipe) => {
    setSelectedSalad(salad);
  };

  const handleVideoPress = async (salad: SaladRecipe) => {
    setLoadingVideo(true);
    try {
      const videos = await youtubeService.searchVideos(salad.youtubeSearchQuery, 1);
      if (videos.length > 0) {
        setVideoData(videos[0]);
        setShowVideo(true);
      } else {
        Alert.alert('No Video Found', 'Sorry, no video found for this recipe.');
      }
    } catch (error) {
      console.error('Error loading video:', error);
      Alert.alert('Error', 'Failed to load video. Please try again.');
    } finally {
      setLoadingVideo(false);
    }
  };

  const closeModal = () => {
    setSelectedSalad(null);
    setShowVideo(false);
    setVideoData(null);
  };

  const getMedicalBenefitsForUser = (salad: SaladRecipe) => {
    if (!user?.conditions) return [];
    return salad.medicalBenefits.filter(benefit => 
      user.conditions?.includes(benefit.condition)
    );
  };

  const renderSaladCard = (salad: SaladRecipe) => (
    <TouchableOpacity
      key={salad.id}
      onPress={() => handleSaladPress(salad)}
      style={styles.cardContainer}
    >
      <Card style={[styles.saladCard, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.emojiContainer}>
              <Text style={styles.saladEmoji}>{salad.image}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.saladName, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                {salad.name}
              </Text>
              <Text style={[styles.saladDescription, { color: isDark ? '#CCCCCC' : '#666666' }]}>
                {salad.description}
              </Text>
            </View>
          </View>
          
          <View style={styles.cardDetails}>
            <View style={styles.detailsRow}>
              <Chip 
                style={[styles.chip, { backgroundColor: isDark ? '#444444' : 'rgba(98, 0, 238, 0.1)' }]}
                textStyle={[styles.chipText, { color: isDark ? '#FFFFFF' : '#6200ee' }]}
              >
                {salad.prepTime} min
              </Chip>
              <Chip 
                style={[styles.chip, { backgroundColor: isDark ? '#444444' : 'rgba(98, 0, 238, 0.1)' }]}
                textStyle={[styles.chipText, { color: isDark ? '#FFFFFF' : '#6200ee' }]}
              >
                {salad.servings} servings
              </Chip>
              <Chip 
                style={[styles.chip, { backgroundColor: isDark ? '#444444' : 'rgba(98, 0, 238, 0.1)' }]}
                textStyle={[styles.chipText, { color: isDark ? '#FFFFFF' : '#6200ee' }]}
              >
                {salad.difficulty}
              </Chip>
            </View>
            
            {user?.conditions && getMedicalBenefitsForUser(salad).length > 0 && (
              <Chip 
                style={[styles.benefitChip, { backgroundColor: isDark ? '#2D5A2D' : '#E8F5E8' }]}
                textStyle={[styles.chipText, { color: isDark ? '#90EE90' : '#2E7D32' }]}
                icon="check-circle"
              >
                Recommended for you
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderDetailModal = () => (
    <Portal>
      <Modal
        visible={!!selectedSalad && !showVideo}
        onDismiss={closeModal}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {selectedSalad && (
            <>
              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <Text style={styles.modalEmoji}>{selectedSalad.image}</Text>
                  <View style={styles.modalTitleContainer}>
                    <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                      {selectedSalad.name}
                    </Text>
                    <Text style={[styles.modalSubtitle, { color: isDark ? '#CCCCCC' : '#666666' }]}>
                      {selectedSalad.description}
                    </Text>
                  </View>
                </View>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={closeModal}
                  iconColor={isDark ? '#FFFFFF' : '#000000'}
                />
              </View>

              {/* Quick Info */}
              <View style={styles.quickInfo}>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: isDark ? '#CCCCCC' : '#666666' }]}>
                    Prep Time
                  </Text>
                  <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    {selectedSalad.prepTime} min
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: isDark ? '#CCCCCC' : '#666666' }]}>
                    Servings
                  </Text>
                  <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    {selectedSalad.servings}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: isDark ? '#CCCCCC' : '#666666' }]}>
                    Difficulty
                  </Text>
                  <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    {selectedSalad.difficulty}
                  </Text>
                </View>
              </View>

              <Divider style={{ marginVertical: 16 }} />

              {/* Medical Benefits for User */}
              {user?.conditions && getMedicalBenefitsForUser(selectedSalad).length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    🏥 Health Benefits for You
                  </Text>
                  {getMedicalBenefitsForUser(selectedSalad).map((benefit, index) => (
                    <View key={index} style={[styles.benefitItem, { backgroundColor: isDark ? '#2D5A2D' : '#E8F5E8' }]}>
                      <Text style={[styles.benefitText, { color: isDark ? '#90EE90' : '#2E7D32' }]}>
                        • {benefit.benefit}
                      </Text>
                    </View>
                  ))}
                  <Divider style={{ marginVertical: 16 }} />
                </>
              )}

              {/* Ingredients */}
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                🛒 Ingredients
              </Text>
              {selectedSalad.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={[styles.ingredientText, { color: isDark ? '#CCCCCC' : '#333333' }]}>
                    • {ingredient.name}: {ingredient.amount}
                    {ingredient.optional && (
                      <Text style={[styles.optionalText, { color: isDark ? '#888888' : '#999999' }]}>
                        {' '}(optional)
                      </Text>
                    )}
                  </Text>
                </View>
              ))}

              <Divider style={{ marginVertical: 16 }} />

              {/* Instructions */}
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                👩‍🍳 Instructions
              </Text>
              {selectedSalad.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <Text style={[styles.instructionNumber, { color: paperTheme.colors.primary }]}>
                    {index + 1}.
                  </Text>
                  <Text style={[styles.instructionText, { color: isDark ? '#CCCCCC' : '#333333' }]}>
                    {instruction}
                  </Text>
                </View>
              ))}

              <Divider style={{ marginVertical: 16 }} />

              {/* General Benefits */}
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                ✨ Health Benefits
              </Text>
              {selectedSalad.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitGeneralItem}>
                  <Text style={[styles.benefitGeneralText, { color: isDark ? '#CCCCCC' : '#333333' }]}>
                    • {benefit}
                  </Text>
                </View>
              ))}

              {/* Video Button */}
              <View style={styles.videoButtonContainer}>
                <Button
                  mode="contained"
                  onPress={() => handleVideoPress(selectedSalad)}
                  loading={loadingVideo}
                  disabled={loadingVideo}
                  style={styles.videoButton}
                  theme={paperTheme}
                  icon="play-circle"
                >
                  {loadingVideo ? 'Loading Video...' : 'Watch Recipe Video'}
                </Button>
              </View>
            </>
          )}
        </ScrollView>
      </Modal>
    </Portal>
  );

  const renderVideoModal = () => (
    <Portal>
      <Modal
        visible={showVideo}
        onDismiss={closeModal}
        contentContainerStyle={[
          styles.videoModalContainer,
          { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }
        ]}
      >
        <View style={styles.videoHeader}>
          <Text style={[styles.videoTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {videoData?.title}
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={closeModal}
            iconColor={isDark ? '#FFFFFF' : '#000000'}
          />
        </View>
        
        {videoData && (
          <YoutubePlayer
            height={200}
            width={width - 40}
            videoId={videoData.id}
            play={true}
            onChangeState={(state: string) => {
              console.log('Video state:', state);
            }}
          />
        )}
        
        {videoData && (
          <View style={styles.videoInfo}>
            <Text style={[styles.videoChannel, { color: isDark ? '#CCCCCC' : '#666666' }]}>
              By: {videoData.channelTitle}
            </Text>
            <Text style={[styles.videoDescription, { color: isDark ? '#CCCCCC' : '#666666' }]} numberOfLines={3}>
              {videoData.description}
            </Text>
          </View>
        )}
      </Modal>
    </Portal>
  );

  return (
    <LinearGradient
      colors={isDark ? ['#1C1C1E', '#2C2C2E'] : [paperTheme.colors.primary, paperTheme.colors.secondary]}
      style={styles.container}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🥗 Healthy Salad Recipes</Text>
          <Text style={styles.subtitle}>
            Discover delicious and nutritious salad recipes tailored for your health
          </Text>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category.key
                    ? paperTheme.colors.primary
                    : (isDark ? '#3A3A3C' : '#FFFFFF')
                }
              ]}
            >
              <Text style={styles.categoryEmoji}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category.key
                      ? '#FFFFFF'
                      : (isDark ? '#FFFFFF' : '#333333')
                  }
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recipes Grid */}
        <View style={styles.recipesContainer}>
          {filteredRecipes.map(renderSaladCard)}
        </View>
      </ScrollView>

      {/* Modals */}
      {renderDetailModal()}
      {renderVideoModal()}
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
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recipesContainer: {
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 16,
  },
  saladCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  emojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  saladEmoji: {
    fontSize: 30,
  },
  cardInfo: {
    flex: 1,
  },
  saladName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  saladDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardDetails: {
    marginTop: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    height: 28,
    borderRadius: 14,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  benefitChip: {
    alignSelf: 'flex-start',
    height: 28,
    borderRadius: 14,
  },
  modalContainer: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  benefitItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ingredientItem: {
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 14,
    lineHeight: 20,
  },
  optionalText: {
    fontStyle: 'italic',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
    width: 20,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  benefitGeneralItem: {
    marginBottom: 6,
  },
  benefitGeneralText: {
    fontSize: 14,
    lineHeight: 20,
  },
  videoButtonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  videoButton: {
    borderRadius: 12,
    elevation: 2,
  },
  videoModalContainer: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  videoInfo: {
    marginTop: 16,
  },
  videoChannel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default RecipesScreen;
