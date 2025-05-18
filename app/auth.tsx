import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import { User } from '../models/User';
import Colors from '../constants/Colors';

type LoginCredentials = {
  email: string;
  password: string;
};

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, login, register, loading } = useContext(AuthContext);

  useEffect(() => {
    // If user is already authenticated, redirect to the home screen
    if (user) {
      router.replace('/');
    }
  }, [user]);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      // Navigation will happen automatically in the useEffect
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error (could add a state for showing errors)
    }
  };

  const handleSignup = async (userData: Partial<User>) => {
    try {
      await register(userData);
      // Navigation will happen automatically in the useEffect
    } catch (error) {
      console.error('Signup error:', error);
      // Handle signup error
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.dark.text} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        {/* You can replace with your app logo */}
        <ThemedText type="title" style={styles.appName}>
          current
        </ThemedText>
      </View>

      <View style={styles.formContainer}>
        {isLogin ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setIsLogin(false)}
          />
        ) : (
          <SignupForm
            onSignup={handleSignup}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
    // Gradient text effect could be applied with a custom component
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    alignSelf: 'center',
    maxWidth: 400,
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  tagline: {
    fontSize: 18,
    opacity: 0.8,
  },
});
