import { apiService } from './apiService';

export interface FruitPlan {
  fruitName: string;
  quantity: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  benefits: string;
}

export interface DailyPlan {
  day: number;
  dayName: string;
  fruits: FruitPlan[];
}

export interface WeeklyPlan {
  id: number;
  userId: number;
  week: number;
  year: number;
  planData: DailyPlan[];
  explanation: string;
  nutritionalSummary: {
    totalFruits: number;
    varietyCount: number;
    keyNutrients: string[];
    weeklyBenefits: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GeneratePlanRequest {
  userId: number;
  selectedFruits: number[];
  preferences?: {
    mealsPerDay?: number;
    servingsPerMeal?: number;
    variety?: boolean;
  };
}

export interface GeneratePlanResponse {
  plan: WeeklyPlan;
  explanation: string;
  nutritionalSummary: any;
}

class PlanService {
  
  async generateWeeklyPlan(request: GeneratePlanRequest): Promise<GeneratePlanResponse> {
    try {
      console.log('Generating weekly plan with request:', request);
      
      const response = await apiService.post('/plans/generate', request);
      console.log('Plan generation response:', response);
      
      return response;
    } catch (error) {
      console.error('Error generating weekly plan:', error);
      throw error;
    }
  }

  async getUserPlans(userId: number): Promise<{ plans: WeeklyPlan[] }> {
    try {
      console.log('Fetching user plans for userId:', userId);
      
      const response = await apiService.get(`/plans/user/${userId}`);
      console.log('User plans response:', response);
      
      return response;
    } catch (error) {
      console.error('Error fetching user plans:', error);
      throw error;
    }
  }

  async getCurrentWeekPlan(userId: number): Promise<WeeklyPlan | null> {
    try {
      console.log('Fetching current week plan for userId:', userId);
      
      const response = await apiService.get(`/plans/current/${userId}`);
      console.log('Current week plan response:', response);
      
      if (response?.plan) {
        return response.plan;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error fetching current week plan:', error);
      if (error?.message?.includes('No plan found')) {
        // No plan found for current week
        return null;
      }
      throw error;
    }
  }

  async deletePlan(planId: number): Promise<void> {
    try {
      console.log('Deleting plan with ID:', planId);
      
      await apiService.delete(`/plans/${planId}`);
      console.log('Plan deleted successfully');
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  }

  // Helper function to format time of day
  getTimeOfDayDisplay(timeOfDay: string): string {
    switch (timeOfDay) {
      case 'morning':
        return 'Morning';
      case 'afternoon':
        return 'Afternoon';
      case 'evening':
        return 'Evening';
      default:
        return timeOfDay;
    }
  }

  // Helper function to format nutritional summary
  formatNutritionalSummary(summary: any): string {
    if (!summary) return 'No nutritional data available';
    
    return `This week includes ${summary.totalFruits} fruits across ${summary.varietyCount} varieties. 
Key nutrients: ${summary.keyNutrients?.join(', ') || 'Various nutrients'}. 
Benefits: ${summary.weeklyBenefits || 'General health benefits'}`;
  }

  // Create a mock plan for testing (will be replaced with real API)
  createMockPlan(): WeeklyPlan {
    return {
      id: 1,
      userId: 1,
      week: 35,
      year: 2024,
      planData: [
        { 
          day: 1, 
          dayName: 'Monday', 
          fruits: [
            { fruitName: 'Apple', quantity: 1, timeOfDay: 'morning', benefits: 'Rich in fiber and vitamin C' },
            { fruitName: 'Banana', quantity: 1, timeOfDay: 'afternoon', benefits: 'High in potassium for muscle function' }
          ]
        },
        { 
          day: 2, 
          dayName: 'Tuesday', 
          fruits: [
            { fruitName: 'Orange', quantity: 1, timeOfDay: 'morning', benefits: 'Excellent source of vitamin C' },
            { fruitName: 'Grapes', quantity: 1, timeOfDay: 'evening', benefits: 'Rich in antioxidants' }
          ]
        },
        { 
          day: 3, 
          dayName: 'Wednesday', 
          fruits: [
            { fruitName: 'Kiwi', quantity: 1, timeOfDay: 'morning', benefits: 'High in vitamin C and fiber' },
            { fruitName: 'Strawberry', quantity: 1, timeOfDay: 'afternoon', benefits: 'Low calories, high nutrients' }
          ]
        },
        { 
          day: 4, 
          dayName: 'Thursday', 
          fruits: [
            { fruitName: 'Mango', quantity: 1, timeOfDay: 'morning', benefits: 'Rich in vitamin A and C' },
            { fruitName: 'Pineapple', quantity: 1, timeOfDay: 'evening', benefits: 'Contains digestive enzymes' }
          ]
        },
        { 
          day: 5, 
          dayName: 'Friday', 
          fruits: [
            { fruitName: 'Blueberry', quantity: 1, timeOfDay: 'morning', benefits: 'Antioxidants for brain health' },
            { fruitName: 'Peach', quantity: 1, timeOfDay: 'afternoon', benefits: 'Good source of vitamins A and C' }
          ]
        },
        { 
          day: 6, 
          dayName: 'Saturday', 
          fruits: [
            { fruitName: 'Cherry', quantity: 1, timeOfDay: 'morning', benefits: 'Anti-inflammatory properties' },
            { fruitName: 'Watermelon', quantity: 1, timeOfDay: 'evening', benefits: 'Hydration and lycopene' }
          ]
        },
        { 
          day: 7, 
          dayName: 'Sunday', 
          fruits: [
            { fruitName: 'Papaya', quantity: 1, timeOfDay: 'morning', benefits: 'Supports digestive health' },
            { fruitName: 'Pomegranate', quantity: 1, timeOfDay: 'afternoon', benefits: 'Heart health benefits' }
          ]
        }
      ],
      explanation: 'This balanced weekly plan provides a variety of fruits to ensure you get essential vitamins, minerals, and antioxidants throughout the week. Each fruit is strategically placed at optimal times for maximum nutrient absorption.',
      nutritionalSummary: {
        totalFruits: 14,
        varietyCount: 14,
        keyNutrients: ['Vitamin C', 'Fiber', 'Antioxidants', 'Potassium', 'Vitamin A'],
        weeklyBenefits: 'Improved immune system, better digestion, heart health support, and enhanced brain function'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

export const planService = new PlanService();
