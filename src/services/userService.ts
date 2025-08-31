import { apiService } from './apiService';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  conditions?: string[];
}

export interface UpdateUserConditionsRequest {
  conditions: string[];
}

export interface UpdateUserProfileRequest {
  name?: string;
  email?: string;
}

class UserService {
  async updateConditions(conditions: string[]): Promise<{ success: boolean; data?: { user: UserProfile }; error?: string }> {
    try {
      const response = await apiService.put('/users/conditions', { conditions });
      return response;
    } catch (error) {
      console.error('Error updating user conditions:', error);
      throw error;
    }
  }

  async updateProfile(profileData: UpdateUserProfileRequest): Promise<{ success: boolean; data?: { user: UserProfile }; error?: string }> {
    try {
      const response = await apiService.put('/users/profile', profileData);
      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async getProfile(): Promise<{ success: boolean; data?: { user: UserProfile }; error?: string }> {
    try {
      const response = await apiService.get('/users/profile');
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
