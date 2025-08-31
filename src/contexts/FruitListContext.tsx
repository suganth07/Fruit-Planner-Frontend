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

  // Load personalized fruits when user changes or conditions update
  useEffect(() => {
    if (user) {
      refreshPersonalizedFruits();
    }
  }, [user?.conditions]);

  // Load all fruits on initial load
  useEffect(() => {
    refreshAllFruits();
  }, []);

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
    if (!user) return;
    
    setIsLoadingFruits(true);
    try {
      const response = await apiService.get('/users/personalized-fruits');
      
      if (response.fruits) {
        setPersonalizedFruits(response.fruits);
        console.log('Loaded personalized fruits:', response.fruits.length);
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
