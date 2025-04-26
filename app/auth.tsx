import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import { ThemedView } from '../components/ThemedView';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import { User } from '../models/User';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, login, register, loading } = useContext(AuthContext);

  useEffect(() => {
    // If user is already authenticated, redirect to the home screen
    if (user) {
      router.replace('/');
    }
  }, [user]);

  const handleLogin = async (credentials) => {
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
    // You might want to add a loading indicator here
    return <ThemedView style={styles.container} />;
  }

  return (
    <ThemedView style={styles.container}>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
}); 