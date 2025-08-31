import Constants from 'expo-constants';

// Get environment variables with fallbacks
const getEnvVar = (name: string, fallback: string = ''): string => {
  return Constants.expoConfig?.extra?.[name] || process.env[name] || fallback;
};

export const config = {
  API_BASE_URL: getEnvVar('EXPO_PUBLIC_API_BASE_URL', 'http://192.168.1.2:3000/api'),
  ENV: getEnvVar('EXPO_PUBLIC_ENV', 'development'),
};

export default config;
