import Constants from 'expo-constants';

// Get environment variables with fallbacks
const getEnvVar = (name: string, fallback: string = ''): string => {
  return Constants.expoConfig?.extra?.[name] || process.env[name] || fallback;
};

export const config = {
  // API URL based on environment
  API_BASE_URL: getEnvVar('EXPO_PUBLIC_API_BASE_URL', 'https://fruit-planner-backend.onrender.com/api'),
  
  // YouTube API configuration
  YOUTUBE_API_KEY: getEnvVar('EXPO_PUBLIC_YOUTUBE_API_KEY', ''),
  
  // App info
  APP_NAME: 'FruitPlan AI',
  APP_VERSION: '1.0.0'
};

export default config;
