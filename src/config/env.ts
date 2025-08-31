import Constants from 'expo-constants';

// Get environment variables with fallbacks
const getEnvVar = (name: string, fallback: string = ''): string => {
  return Constants.expoConfig?.extra?.[name] || process.env[name] || fallback;
};

// Determine if we're in production
const isProduction = getEnvVar('EXPO_PUBLIC_ENV') === 'production';

// Production vs Development API URLs
const PRODUCTION_API_URL = 'https://fruit-planner-backend.onrender.com/api';
const DEVELOPMENT_API_URL = 'https://fruit-planner-backend.onrender.com/api';

export const config = {
  API_BASE_URL: isProduction ? PRODUCTION_API_URL : getEnvVar('EXPO_PUBLIC_API_BASE_URL', DEVELOPMENT_API_URL),
  ENV: getEnvVar('EXPO_PUBLIC_ENV', 'development'),
  IS_PRODUCTION: isProduction,
  IS_DEVELOPMENT: !isProduction,
  APP_NAME: 'FruitPlan AI',
  APP_VERSION: '1.0.0'
};

export default config;
