// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const loadUser = async () => {
      try {
        // Clear any existing token on app start
        await AsyncStorage.removeItem('@auth_token');
        setAuthToken();
        setLoading(false);

        // Note: We're not loading user data on startup anymore to force the login screen
      } catch (err) {
        console.error('Error during auth initialization', err);
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Set auth token for API requests
  const setAuthToken = async () => {
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      AuthService.setAuthToken(token);
    } else {
      AuthService.clearAuthToken();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: async (credentials) => {
          try {
            const data = await AuthService.login(credentials);
            setUser(data.user);
            return data;
          } catch (error) {
            console.error('Login error in context:', error);
            throw error;
          }
        },
        register: async (userData) => {
          try {
            const data = await AuthService.register(userData);
            setUser(data.user);
            return data;
          } catch (error) {
            console.error('Register error in context:', error);
            throw error;
          }
        },
        logout: async () => {
          try {
            await AuthService.logout();
            setUser(null);
          } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails on the server, clear local state
            setUser(null);
            await AsyncStorage.removeItem('@auth_token');
            setAuthToken();
          }
        },
        isAuthenticated: () => !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
