import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ToastAndroid, Platform } from 'react-native';
import { Modal, Portal, Button, Searchbar, Chip, Card, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useFruitList } from '../contexts/FruitListContext';
import { apiService } from '../services/apiService';

interface MedicalConditionsModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConditionsUpdated?: () => void;
}

const commonConditions = [
  'Diabetes Type 1',
  'Diabetes Type 2',
  'Gestational Diabetes',
  'Hypertension',
  'High Blood Pressure',
  'Heart Disease',
  'Coronary Heart Disease',
  'High Cholesterol',
  'High LDL Cholesterol',
  'Digestive Issues',
  'Acid Reflux',
  'Irritable Bowel Syndrome',
  'Constipation',
  'Immune Support',
  'Low Immunity',
  'Frequent Infections',
  'Weight Management',
  'Obesity',
  'Underweight',
  'Anemia',
  'Iron Deficiency',
  'Vitamin B12 Deficiency',
  'Bone Health',
  'Osteoporosis',
  'Calcium Deficiency',
  'Arthritis',
  'Rheumatoid Arthritis',
  'Osteoarthritis',
  'Asthma',
  'Respiratory Issues',
  'Depression',
  'Anxiety',
  'Stress',
  'Insomnia',
  'Sleep Disorders',
  'Kidney Disease',
  'Chronic Kidney Disease',
  'Kidney Stones',
  'Liver Disease',
  'Fatty Liver',
  'Thyroid Issues',
  'Hypothyroidism',
  'Hyperthyroidism',
  'Migraine',
  'Chronic Headaches',
  'Skin Problems',
  'Eczema',
  'Psoriasis',
  'Acne',
  'Cancer',
  'Breast Cancer',
  'Prostate Cancer',
  'Colorectal Cancer',
  'Pregnancy',
  'Breastfeeding',
  'Menopause',
  'PCOS',
  'Endometriosis',
  'Gout',
  'High Uric Acid',
  'Memory Issues',
  'Cognitive Decline',
  'Alzheimer\'s Disease',
  'Eye Health',
  'Macular Degeneration',
  'Cataracts',
  'Glaucoma'
];

export const MedicalConditionsModal: React.FC<MedicalConditionsModalProps> = ({ visible, onDismiss, onConditionsUpdated }) => {
  const { user, updateUser } = useAuth();
  const { clearAllFruits } = useFruitList(); // To refresh recommendations
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConditions, setFilteredConditions] = useState<string[]>(commonConditions);
  const [loading, setLoading] = useState(false);
  const [searchRecommendations, setSearchRecommendations] = useState<string[]>([]);

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', message);
    }
  };

  useEffect(() => {
    if (user?.conditions && Array.isArray(user.conditions)) {
      // Normalize conditions from database format
      const normalizedConditions = user.conditions.map(condition => 
        condition.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase())
      );
      setSelectedConditions(normalizedConditions);
    }
  }, [user?.conditions]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      // Get exact matches first, then partial matches
      const exactMatches = commonConditions.filter(condition =>
        condition.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Get related conditions based on keywords
      const keywords = searchQuery.toLowerCase().split(' ');
      const relatedMatches = commonConditions.filter(condition => {
        const conditionLower = condition.toLowerCase();
        return keywords.some(keyword => 
          keyword.length > 2 && conditionLower.includes(keyword)
        ) && !exactMatches.includes(condition);
      });

      const combinedResults = [...exactMatches, ...relatedMatches].slice(0, 10);
      setFilteredConditions(combinedResults);
      setSearchRecommendations(combinedResults.slice(0, 5));
    } else {
      setFilteredConditions(commonConditions);
      setSearchRecommendations([]);
    }
  }, [searchQuery]);

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev => {
      if (prev.includes(condition)) {
        return prev.filter(c => c !== condition);
      } else {
        return [...prev, condition];
      }
    });
  };

  const removeCondition = (condition: string) => {
    setSelectedConditions(prev => prev.filter(c => c !== condition));
  };

  const addConditionFromSearch = (condition: string) => {
    if (!selectedConditions.includes(condition)) {
      setSelectedConditions(prev => [...prev, condition]);
      setSearchQuery(''); // Clear search after adding
    }
  };

  const saveConditions = async () => {
    setLoading(true);
    try {
      // Convert to database format (lowercase with underscores)
      const dbConditions = selectedConditions.map(condition =>
        condition.toLowerCase().replace(/\s+/g, '_')
      );

      const response = await apiService.put('/users/conditions', { conditions: dbConditions });
      
      if (response.success && response.data?.user) {
        updateUser(response.data.user);
        
        // Clear fruit list to refresh recommendations based on new conditions
        clearAllFruits();
        
        // Trigger parent component update
        onConditionsUpdated?.();
        
        showToast('Medical conditions saved successfully!');
        onDismiss();
      }
    } catch (error) {
      console.error('Error updating conditions:', error);
      Alert.alert('Error', 'Failed to update medical conditions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <Card style={styles.modalCard}>
          <Card.Content>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Medical Conditions</Text>
              <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Select your medical conditions to get personalized fruit recommendations
            </Text>

            <Searchbar
              placeholder="Search conditions..."
              placeholderTextColor="#000"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />

            {/* Search Recommendations */}
            {searchQuery.length > 0 && searchRecommendations.length > 0 && (
              <View style={styles.recommendationsSection}>
                <Text style={styles.recommendationsTitle}>Quick Add:</Text>
                <View style={styles.recommendationsContainer}>
                  {searchRecommendations.map(condition => (
                    <TouchableOpacity
                      key={condition}
                      style={[
                        styles.recommendationChip,
                        selectedConditions.includes(condition) && styles.selectedRecommendationChip
                      ]}
                      onPress={() => addConditionFromSearch(condition)}
                      disabled={selectedConditions.includes(condition)}
                    >
                      <Text style={[
                        styles.recommendationText,
                        selectedConditions.includes(condition) && styles.selectedRecommendationText
                      ]}>
                        {condition}
                      </Text>
                      {!selectedConditions.includes(condition) && (
                        <Ionicons name="add" size={16} color="#007AFF" style={styles.addIcon} />
                      )}
                      {selectedConditions.includes(condition) && (
                        <Ionicons name="checkmark" size={16} color="#34C759" style={styles.addIcon} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Selected Conditions */}
            {selectedConditions.length > 0 && (
              <View style={styles.selectedSection}>
                <Text style={styles.sectionTitle}>Selected Conditions ({selectedConditions.length})</Text>
                <View style={styles.chipContainer}>
                  {selectedConditions.map(condition => (
                    <Chip
                      key={condition}
                      onPress={() => removeCondition(condition)}
                      onClose={() => removeCondition(condition)}
                      style={styles.selectedChip}
                      textStyle={styles.selectedChipText}
                    >
                      {condition}
                    </Chip>
                  ))}
                </View>
              </View>
            )}

            {/* Available Conditions */}
            <View style={styles.availableSection}>
              <Text style={styles.sectionTitle}>Available Conditions</Text>
              <ScrollView style={styles.conditionsList} showsVerticalScrollIndicator={false}>
                {filteredConditions.map(condition => (
                  <TouchableOpacity
                    key={condition}
                    style={[
                      styles.conditionItem,
                      selectedConditions.includes(condition) && styles.selectedConditionItem
                    ]}
                    onPress={() => toggleCondition(condition)}
                  >
                    <Text style={[
                      styles.conditionText,
                      selectedConditions.includes(condition) && styles.selectedConditionText
                    ]}>
                      {condition}
                    </Text>
                    {selectedConditions.includes(condition) && (
                      <Ionicons name="checkmark" size={20} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={onDismiss}
                style={styles.cancelButton}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={saveConditions}
                style={styles.saveButton}
                loading={loading}
                disabled={loading}
                buttonColor="#4CAF50"
              >
                Save Changes
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  searchBar: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  selectedSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    backgroundColor: '#e8f5e8',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChipText: {
    color: '#2e7d32',
    fontSize: 14,
  },
  availableSection: {
    flex: 1,
    marginBottom: 16,
  },
  conditionsList: {
    maxHeight: 200,
  },
  conditionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#f8f9fa',
  },
  selectedConditionItem: {
    backgroundColor: '#e8f5e8',
  },
  conditionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedConditionText: {
    color: '#2e7d32',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#666',
  },
  saveButton: {
    flex: 1,
  },
  recommendationsSection: {
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  recommendationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recommendationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedRecommendationChip: {
    backgroundColor: '#e8f5e8',
    borderColor: '#34C759',
  },
  recommendationText: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
  },
  selectedRecommendationText: {
    color: '#2e7d32',
    fontWeight: '500',
  },
  addIcon: {
    marginLeft: 4,
  },
});
