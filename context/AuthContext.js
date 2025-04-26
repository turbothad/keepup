// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { AuthService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('@auth_token');
        if (token) {
          const userData = await AuthService.getProfile();
          setUser(userData);
        }
      } catch (err) {
        console.error('Error loading user', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login: async (credentials) => {
        const data = await AuthService.login(credentials);
        setUser(data.user);
        return data;
      },
      register: async (userData) => {
        const data = await AuthService.register(userData);
        setUser(data.user);
        return data;
      },
      logout: async () => {
        await AuthService.logout();
        setUser(null);
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};