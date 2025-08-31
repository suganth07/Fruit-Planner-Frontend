import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/apiService';
import config from '../config/env';

interface User {
  id: string;
  email: string;
  name: string;
  conditions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, conditions?: string[]) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
  refreshUserData: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data on app start
  useEffect(() => {
    loadStoredUserData();
  }, []);

  const loadStoredUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      const token = await AsyncStorage.getItem('@auth_token');
      
      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Refresh user data from server in the background
        refreshUserData();
      }
    } catch (error) {
      console.error('Error loading stored user data:', error);
    }
  };

  const refreshUserData = async (): Promise<void> => {
    try {
      const response = await apiService.get('/users/profile');
      if (response.user) {
        const updatedUser: User = {
          id: response.user.id.toString(),
          email: response.user.email,
          name: response.user.name,
          conditions: response.user.conditions || [],
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt
        };
        
        await updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // Don't throw error, just log it as this is a background operation
    }
  };

  const saveTokenAndUser = async (token: string, userData: User) => {
    try {
      await AsyncStorage.setItem('@auth_token', token);
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('@user_data');
      setUser(null);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    conditions: string[] = []
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          name,
          conditions 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData: User = {
          id: data.data.user.id.toString(),
          email: data.data.user.email,
          name: data.data.user.name || name,
          conditions: data.data.user.conditions || [],
          createdAt: data.data.user.createdAt,
          updatedAt: data.data.user.updatedAt
        };

        await saveTokenAndUser(data.data.token, userData);
        setIsLoading(false);
        return true;
      } else {
        console.error('Registration failed:', data.error);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData: User = {
          id: data.data.user.id.toString(),
          email: data.data.user.email,
          name: data.data.user.name || email.split('@')[0],
          conditions: data.data.user.conditions || [],
          createdAt: data.data.user.createdAt,
          updatedAt: data.data.user.updatedAt
        };

        await saveTokenAndUser(data.data.token, userData);
        setIsLoading(false);
        return true;
      } else {
        console.error('Login failed:', data.error);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error (network):', error);
      // For development: still allow demo login if API is unavailable
      if (email && password) {
        const demoUser: User = {
          id: 'demo',
          email: email,
          name: email.split('@')[0],
          conditions: []
        };
        setUser(demoUser);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await clearAuthData();
  };

  const updateUser = async (userData: User) => {
    setUser(userData);
    // Also update AsyncStorage
    try {
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Error updating user data in storage:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
    refreshUserData,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Default export for compatibility
export default AuthProvider;
