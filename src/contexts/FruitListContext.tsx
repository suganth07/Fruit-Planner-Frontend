import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FruitListContextType {
  selectedFruitIds: number[];
  addFruit: (fruitId: number) => void;
  removeFruit: (fruitId: number) => void;
  clearAllFruits: () => void;
  isFruitSelected: (fruitId: number) => boolean;
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
  const [selectedFruitIds, setSelectedFruitIds] = useState<number[]>([]);

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
  };

  const isFruitSelected = (fruitId: number) => {
    return selectedFruitIds.includes(fruitId);
  };

  const value: FruitListContextType = {
    selectedFruitIds,
    addFruit,
    removeFruit,
    clearAllFruits,
    isFruitSelected
  };

  return (
    <FruitListContext.Provider value={value}>
      {children}
    </FruitListContext.Provider>
  );
};

export default FruitListProvider;
