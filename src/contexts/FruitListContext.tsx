import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from './AuthContext';

interface PersonalizedFruit {
  id: number;
  name: string;
  benefits: string;
  glycemicIndex: number;
  sugarContent: number;
  calories: number;
  fiber: number;
  vitaminC: number;
  potassium: number;
  image?: string;
  recommendationLevel: 'recommended' | 'moderate' | 'neutral' | 'limit' | 'avoid';
  reasons: string[];
}

interface FruitListContextType {
  selectedFruitIds: number[];
  personalizedFruits: PersonalizedFruit[];
  allFruits: PersonalizedFruit[];
  isLoadingFruits: boolean;
  addFruit: (fruitId: number) => void;
  removeFruit: (fruitId: number) => void;
  clearAllFruits: () => void;
  isFruitSelected: (fruitId: number) => boolean;
  refreshPersonalizedFruits: () => Promise<void>;
  refreshAllFruits: () => Promise<void>;
}

const FruitListContext = createContext<FruitListContextType | undefined>(undefined);

export const useFruitList = (): FruitListContextType => {
  const context = useContext(FruitListContext);
  if (context === undefined) {
    throw new Error('useFruitList must be used within a FruitListProvider');
  }
  return context;
};

interface FruitListProviderProps {
  children: ReactNode;
}

export const FruitListProvider: React.FC<FruitListProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [selectedFruitIds, setSelectedFruitIds] = useState<number[]>([]);
  const [personalizedFruits, setPersonalizedFruits] = useState<PersonalizedFruit[]>([]);
  const [allFruits, setAllFruits] = useState<PersonalizedFruit[]>([]);
  const [isLoadingFruits, setIsLoadingFruits] = useState(false);

  // Load user's saved fruit selections and personalized fruits when user changes
  useEffect(() => {
    if (user) {
      loadUserFruits();
      refreshPersonalizedFruits();
    }
  }, [user?.id, user?.conditions]);

  // Load all fruits on initial load
  useEffect(() => {
    refreshAllFruits();
  }, []);

  // Save selections to backend whenever they change
  useEffect(() => {
    if (user?.id && selectedFruitIds.length > 0) {
      saveUserFruits();
    }
  }, [selectedFruitIds, user?.id]);

  const loadUserFruits = async (): Promise<void> => {
    if (!user?.id) return;
    
    try {
      const response = await apiService.get(`/user-fruits/${user.id}`);
      if (response.success && response.data.fruitIds) {
        setSelectedFruitIds(response.data.fruitIds);
        console.log('Loaded user fruit selections:', response.data.fruitIds.length);
      }
    } catch (error) {
      console.error('Error loading user fruits:', error);
      // Don't clear selections on error, keep local state
    }
  };

  const saveUserFruits = async (): Promise<void> => {
    if (!user?.id) return;
    
    try {
      await apiService.post('/user-fruits/save', {
        userId: parseInt(user.id),
        fruitIds: selectedFruitIds
      });
      console.log('Saved user fruit selections:', selectedFruitIds.length);
    } catch (error) {
      console.error('Error saving user fruits:', error);
      // Don't show error to user, just log it
    }
  };

  const refreshAllFruits = async (): Promise<void> => {
    setIsLoadingFruits(true);
    try {
      const response = await apiService.get('/fruits');
      
      if (response.fruits) {
        setAllFruits(response.fruits);
        console.log('Loaded all fruits:', response.fruits.length);
      }
    } catch (error) {
      console.error('Error loading all fruits:', error);
      // Fallback to empty array on error
      setAllFruits([]);
    } finally {
      setIsLoadingFruits(false);
    }
  };

  const refreshPersonalizedFruits = async (): Promise<void> => {
    if (!user?.id) return;
    
    setIsLoadingFruits(true);
    try {
      // Use the new personalized fruits endpoint
      const response = await apiService.get(`/fruits/personalized/${user.id}`);
      
      if (response.fruits) {
        setPersonalizedFruits(response.fruits);
        console.log('Loaded personalized fruits:', response.fruits.length);
        console.log('Recommended fruits:', response.fruits.filter((f: PersonalizedFruit) => f.recommendationLevel === 'recommended').length);
        console.log('User conditions:', response.userConditions);
        
        // Log the summary for debugging
        if (response.summary) {
          console.log('Recommendation summary:', response.summary);
        }
      }
    } catch (error) {
      console.error('Error loading personalized fruits:', error);
      // Fallback to empty array on error
      setPersonalizedFruits([]);
    } finally {
      setIsLoadingFruits(false);
    }
  };

  const addFruit = (fruitId: number) => {
    setSelectedFruitIds(prev => 
      prev.includes(fruitId) ? prev : [...prev, fruitId]
    );
  };

  const removeFruit = (fruitId: number) => {
    setSelectedFruitIds(prev => prev.filter(id => id !== fruitId));
  };

  const clearAllFruits = () => {
    setSelectedFruitIds([]);
    // Save empty selection to backend
    if (user?.id) {
      apiService.post('/user-fruits/save', {
        userId: parseInt(user.id),
        fruitIds: []
      }).catch(error => console.error('Error clearing user fruits:', error));
    }
    // Also refresh personalized fruits to get updated recommendations
    refreshPersonalizedFruits();
  };

  const isFruitSelected = (fruitId: number) => {
    return selectedFruitIds.includes(fruitId);
  };

  const value: FruitListContextType = {
    selectedFruitIds,
    personalizedFruits,
    allFruits,
    isLoadingFruits,
    addFruit,
    removeFruit,
    clearAllFruits,
    isFruitSelected,
    refreshPersonalizedFruits,
    refreshAllFruits
  };

  return (
    <FruitListContext.Provider value={value}>
      {children}
    </FruitListContext.Provider>
  );
};

export default FruitListProvider;
