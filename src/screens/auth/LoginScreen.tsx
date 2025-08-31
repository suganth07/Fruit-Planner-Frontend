import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';

interface LoginForm {
  email: string;
  password: string;
}

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      // Navigation will be handled by AuthContext
    } catch (error: any) {
      setSnackbarMessage(error.message || 'Login failed. Please try again.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.header}>
                <Title style={styles.title}>🍎 Fruit Planner</Title>
                <Paragraph style={styles.subtitle}>
                  Welcome back! Sign in to your account
                </Paragraph>
              </View>

              <View style={styles.form}>
                <Controller
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Email"
                      mode="outlined"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={!!errors.email}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="email"
                      style={styles.input}
                    />
                  )}
                  name="email"
                />
                {errors.email && (
                  <Paragraph style={styles.errorText}>
                    {errors.email.message}
                  </Paragraph>
                )}

                <Controller
                  control={control}
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Password"
                      mode="outlined"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={!!errors.password}
                      secureTextEntry
                      autoComplete="password"
                      style={styles.input}
                    />
                  )}
                  name="password"
                />
                {errors.password && (
                  <Paragraph style={styles.errorText}>
                    {errors.password.message}
                  </Paragraph>
                )}

                <Button
                  mode="contained"
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading}
                  style={styles.loginButton}
                  contentStyle={styles.buttonContent}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <View style={styles.registerContainer}>
                  <Paragraph style={styles.registerText}>
                    Don't have an account?{' '}
                  </Paragraph>
                  <Button
                    mode="text"
                    onPress={navigateToRegister}
                    disabled={loading}
                    style={styles.registerButton}
                  >
                    Sign Up
                  </Button>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'white',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  registerText: {
    color: '#666',
  },
  registerButton: {
    marginLeft: -8,
  },
});

export default LoginScreen;
