import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  ScrollView,
  KeyboardAvoidingView, 
  Platform,
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

interface SignUpScreenProps {
  onSwitchToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuth();
  const { isDark, paperTheme } = useTheme();

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter your username');
      return false;
    }
    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return false;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      const success = await register(username, password, name);
      if (!success) {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Creating your account...</Text>
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
            <MaterialIcons name="eco" size={50} color="#ffffff" />
            <Text style={styles.appTitle}>Join Fruit Planner</Text>
            <Text style={styles.appSubtitle}>
              Start your personalized nutrition journey
            </Text>
          </View>

          {/* Sign Up Card */}
          <Card style={[styles.signupCard, { backgroundColor: paperTheme.colors.surface }]}>
            <Card.Content style={styles.cardContent}>
              <Text style={[styles.signupTitle, { color: paperTheme.colors.onSurface }]}>Create Account</Text>
              
              <Divider style={styles.divider} />

              {/* Name Input */}
              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={[styles.input, { backgroundColor: paperTheme.colors.surface }]}
                autoComplete="name"
                left={<TextInput.Icon icon="account" />}
                textColor={paperTheme.colors.onSurface}
                theme={{ 
                  colors: { 
                    primary: '#6200ee',
                    outline: paperTheme.colors.outline,
                    onSurfaceVariant: paperTheme.colors.onSurface
                  } 
                }}
              />

              {/* Username Input */}
              <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={[styles.input, { backgroundColor: paperTheme.colors.surface }]}
                autoComplete="username"
                autoCapitalize="none"
                left={<TextInput.Icon icon="account" />}
                textColor={paperTheme.colors.onSurface}
                theme={{ 
                  colors: { 
                    primary: '#6200ee',
                    outline: paperTheme.colors.outline,
                    onSurfaceVariant: paperTheme.colors.onSurface
                  } 
                }}
              />

              {/* Password Input */}
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={[styles.input, { backgroundColor: paperTheme.colors.surface }]}
                autoComplete="password-new"
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                textColor={paperTheme.colors.onSurface}
                theme={{ 
                  colors: { 
                    primary: '#6200ee',
                    outline: paperTheme.colors.outline,
                    onSurfaceVariant: paperTheme.colors.onSurface
                  } 
                }}
              />

              {/* Confirm Password Input */}
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                style={[styles.input, { backgroundColor: paperTheme.colors.surface }]}
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon 
                    icon={showConfirmPassword ? "eye-off" : "eye"}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                textColor={paperTheme.colors.onSurface}
                theme={{ 
                  colors: { 
                    primary: '#6200ee',
                    outline: paperTheme.colors.outline,
                    onSurfaceVariant: paperTheme.colors.onSurface
                  } 
                }}
              />

              {/* Sign Up Button */}
              <Button
                mode="contained"
                onPress={handleSignUp}
                style={styles.signupButton}
                contentStyle={styles.buttonContent}
                disabled={isLoading}
                buttonColor="#6200ee"
              >
                <Text style={styles.buttonText}>Create Account</Text>
              </Button>

              {/* Login Link */}
              <Divider style={styles.divider} />
              <View style={styles.loginContainer}>
                <Text style={[styles.loginText, { color: paperTheme.colors.onSurface }]}>Already have an account? </Text>
                <TouchableOpacity onPress={onSwitchToLogin}>
                  <Text style={styles.loginLink}>Sign In</Text>
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
    marginBottom: 30,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 16,
    color: '#e8eaed',
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  signupCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 25,
  },
  signupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 20,
    backgroundColor: '#e0e0e0',
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    marginTop: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  conditionsContainer: {
    marginBottom: 20,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  conditionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
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

export default SignUpScreen;
