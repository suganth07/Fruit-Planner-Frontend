import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  Card,
  ActivityIndicator,
  Divider
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SignUpScreen from './SignUpScreen';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { login, isLoading } = useAuth();
  const { isDark, paperTheme } = useTheme();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const success = await login(username, password);
      if (!success) {
        Alert.alert('Error', 'Invalid username or password. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please check your connection and try again.');
    }
  };

  if (showSignUp) {
    return <SignUpScreen onSwitchToLogin={() => setShowSignUp(false)} />;
  }

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: paperTheme.colors.background }]}>
        <ActivityIndicator size="large" color={paperTheme.colors.primary} />
        <Text style={[styles.loadingText, { color: paperTheme.colors.onBackground }]}>Signing you in...</Text>
      </View>
    );
  }

  const gradientColors: readonly [string, string, string] = isDark 
    ? ['#000000', '#1C1C1E', '#000000']
    : ['#007AFF', '#0051D5', '#007AFF'];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <MaterialIcons name="eco" size={60} color="#ffffff" />
            <Text style={styles.appTitle}>Fruit Planner</Text>
            <Text style={styles.appSubtitle}>
              Your personalized nutrition companion
            </Text>
          </View>

          {/* Login Card */}
          <Card style={[styles.loginCard, { backgroundColor: paperTheme.colors.surface }]}>
            <Card.Content style={styles.cardContent}>
              <Text style={[styles.loginTitle, { color: paperTheme.colors.onSurface }]}>Welcome Back</Text>
              <Text style={[styles.loginSubtitle, { color: paperTheme.colors.onSurface }]}>
                Sign in to continue your healthy journey
              </Text>

              <Divider style={[styles.divider, { backgroundColor: paperTheme.colors.outline }]} />

              {/* Username Input */}
              <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={[styles.input, { backgroundColor: paperTheme.colors.surface }]}
                autoCapitalize="none"
                autoComplete="username"
                left={<TextInput.Icon icon="account" />}
                theme={paperTheme}
                textColor={paperTheme.colors.onSurface}
              />

              {/* Password Input */}
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={[styles.input, { backgroundColor: paperTheme.colors.surface }]}
                autoComplete="password"
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                theme={paperTheme}
                textColor={paperTheme.colors.onSurface}
              />

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={[styles.forgotPasswordText, { color: paperTheme.colors.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
                disabled={isLoading}
                buttonColor={paperTheme.colors.primary}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </Button>

              {/* Demo Hint */}
              

              {/* Sign Up Link */}
              <Divider style={[styles.divider, { backgroundColor: paperTheme.colors.outline }]} />
              <View style={styles.signupContainer}>
                <Text style={[styles.signupText, { color: paperTheme.colors.onSurface }]}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => setShowSignUp(true)}>
                  <Text style={[styles.signupLink, { color: paperTheme.colors.primary }]}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 16,
    color: '#e8eaed',
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  loginCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 30,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  divider: {
    marginVertical: 20,
    backgroundColor: '#e0e0e0',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#6200ee',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default LoginScreen;
