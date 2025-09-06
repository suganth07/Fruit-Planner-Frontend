import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  Checkbox,
  Card,
  Surface,
  useTheme
} from 'react-native-paper';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

interface FirstTimeSetupModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (conditions: string[]) => void;
}

const medicalConditions = [
  { key: 'diabetes_type_1', label: 'Type 1 Diabetes' },
  { key: 'diabetes_type_2', label: 'Type 2 Diabetes' },
  { key: 'high_blood_pressure', label: 'High Blood Pressure' },
  { key: 'heart_disease', label: 'Heart Disease' },
  { key: 'high_cholesterol', label: 'High Cholesterol' },
  { key: 'kidney_disease', label: 'Kidney Disease' },
  { key: 'liver_disease', label: 'Liver Disease' },
  { key: 'obesity', label: 'Obesity' },
  { key: 'gout', label: 'Gout' },
  { key: 'acid_reflux', label: 'Acid Reflux/GERD' },
  { key: 'ibs', label: 'Irritable Bowel Syndrome (IBS)' },
  { key: 'arthritis', label: 'Arthritis' },
  { key: 'osteoporosis', label: 'Osteoporosis' },
  { key: 'anemia', label: 'Anemia' },
  { key: 'hyperthyroidism', label: 'Hyperthyroidism' },
  { key: 'hypothyroidism', label: 'Hypothyroidism' },
];

const FirstTimeSetupModal: React.FC<FirstTimeSetupModalProps> = ({
  visible,
  onDismiss,
  onSave,
}) => {
  const paperTheme = useTheme();
  const { isDark } = useCustomTheme();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const handleToggleCondition = (conditionKey: string) => {
    setSelectedConditions(prev => 
      prev.includes(conditionKey)
        ? prev.filter(c => c !== conditionKey)
        : [...prev, conditionKey]
    );
  };

  const handleSave = () => {
    onSave(selectedConditions);
    setSelectedConditions([]);
  };

  const handleSkip = () => {
    onSave([]);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Welcome! 🎉
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#CCCCCC' : '#666666' }]}>
              To provide you with personalized fruit recommendations, please let us know about any medical conditions you have.
            </Text>
            <Text style={[styles.note, { color: isDark ? '#CCCCCC' : '#666666' }]}>
              This information helps us suggest fruits that are beneficial for your health. You can update this anytime in Settings.
            </Text>
          </View>

          <Surface style={[styles.conditionsContainer, { backgroundColor: isDark ? '#2C2C2E' : '#F8F9FA' }]}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Medical Conditions (Optional)
            </Text>
            
            {medicalConditions.map((condition) => (
              <Card
                key={condition.key}
                style={[
                  styles.conditionCard,
                  { backgroundColor: isDark ? '#3A3A3C' : '#FFFFFF' }
                ]}
              >
                <Card.Content style={styles.conditionContent}>
                  <View style={styles.conditionRow}>
                    <Text style={[styles.conditionLabel, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                      {condition.label}
                    </Text>
                    <Checkbox
                      status={selectedConditions.includes(condition.key) ? 'checked' : 'unchecked'}
                      onPress={() => handleToggleCondition(condition.key)}
                      theme={paperTheme}
                    />
                  </View>
                </Card.Content>
              </Card>
            ))}
          </Surface>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleSkip}
              style={[styles.button, styles.skipButton]}
              labelStyle={{ color: isDark ? '#CCCCCC' : '#666666' }}
            >
              Skip for now
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={[styles.button, styles.saveButton]}
              theme={paperTheme}
            >
              Save & Continue
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  conditionsContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  conditionCard: {
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
  },
  conditionContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  conditionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conditionLabel: {
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
  },
  skipButton: {
    marginRight: 6,
  },
  saveButton: {
    marginLeft: 6,
  },
});

export default FirstTimeSetupModal;
