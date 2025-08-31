import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/env';

interface User {
  id: string;
  email: string;
  name: string;
  conditions?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, conditions?: string[]) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
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
          name: name,
          conditions: data.data.user.conditions || []
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
          name: email.split('@')[0], // Extract name from email for now
          conditions: data.data.user.conditions || []
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

  const updateUser = (userData: User) => {
    setUser(userData);
    // Also update AsyncStorage
    AsyncStorage.setItem('@user_data', JSON.stringify(userData)).catch(error => {
      console.error('Error updating user data in storage:', error);
    });
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
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
