// components/AuthTest.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { AuthService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://localhost:818/api';
// For physical devices, use your computer's local IP instead:
// const API_URL = 'http://192.168.x.x:818/api';

const AuthTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testStatus, setTestStatus] = useState('idle'); // idle, running, success, failed

  const log = (message, isSuccess = true) => {
    setTestResults(prev => [...prev, { message, isSuccess }]);
    // Update overall status based on the last result
    if (message.includes('🏁 Tests completed')) {
      setTestStatus(prev => {
        // Check if any test failed
        const anyFailed = testResults.some(result => !result.isSuccess);
        return anyFailed ? 'failed' : 'success';
      });
    }
  };

  const clearLogs = () => {
    setTestResults([]);
    setTestStatus('idle');
  };

  const runTests = async () => {
    clearLogs();
    setIsRunning(true);
    setTestStatus('running');

    try {
      // Step 1: Test login with correct credentials
      log('🔍 Testing Login...');

      // First, create test user credentials
      const testUser = {
        email: `test_${Date.now()}@example.com`,
        username: `testuser_${Date.now()}`,
        password: 'Test123!',
      };

      // Register test user
      log('Creating test user...');
      try {
        const regResult = await axios.post(`${API_URL}/users/register`, testUser);
        if (regResult.data && regResult.data.token) {
          log('✅ Test user created successfully');
        } else {
          log('❌ Failed to create test user', false);
        }
      } catch (err) {
        log(`❌ Error creating test user: ${err.message}`, false);
        log('⚠️ If user already exists, test may still continue');
      }

      // Step 2: Test authentication with token
      log('Attempting login with test user...');
      try {
        const loginRes = await axios.post(`${API_URL}/users/login`, {
          email: testUser.email,
          password: testUser.password,
        });

        if (loginRes.data && loginRes.data.token) {
          log('✅ Login successful');

          // Save token
          const token = loginRes.data.token;
          await AsyncStorage.setItem('@auth_token', token);
          log('✅ Token stored in AsyncStorage');

          // Step 3: Test protected route access
          log('Testing protected API route with token...');
          try {
            const res = await axios.get(`${API_URL}/posts`, {
              headers: { 'x-auth-token': token },
            });
            log('✅ Successfully accessed protected route');
          } catch (err) {
            log(`❌ Failed to access protected route: ${err.message}`, false);
          }

          // Step 4: Test token decoding
          log('Examining token content...');
          try {
            // Show token parts (do NOT do this in production)
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              // Decode payload part (second part)
              const payload = JSON.parse(atob(tokenParts[1]));
              log(`✅ Token payload successfully decoded`);
              log(`Token contains user ID: ${payload.id || 'Not found'}`);
              log(`Token expires: ${new Date(payload.exp * 1000).toLocaleString()}`);
            } else {
              log('❌ Token format is invalid', false);
            }
          } catch (err) {
            log(`❌ Failed to decode token: ${err.message}`, false);
          }

          // Step 5: Test invalid token
          log('Testing with invalid token...');
          try {
            const invalidToken = token.replace(/a/g, 'b'); // Manipulate the token to make it invalid
            await axios.get(`${API_URL}/posts`, {
              headers: { 'x-auth-token': invalidToken },
            });
            log('❌ Server accepted invalid token', false);
          } catch (err) {
            if (err.response && err.response.status === 401) {
              log('✅ Server correctly rejected invalid token');
            } else {
              log(`❌ Unexpected error with invalid token: ${err.message}`, false);
            }
          }

          // Step 6: Test token removal
          log('Testing token removal...');
          try {
            await AsyncStorage.removeItem('@auth_token');
            const storedToken = await AsyncStorage.getItem('@auth_token');
            if (!storedToken) {
              log('✅ Token successfully removed from storage');
            } else {
              log('❌ Failed to remove token from storage', false);
            }
          } catch (err) {
            log(`❌ Error removing token: ${err.message}`, false);
          }
        } else {
          log('❌ Login failed - no token received', false);
        }
      } catch (err) {
        log(`❌ Login error: ${err.message}`, false);
      }

      log('🏁 Tests completed');
    } catch (e) {
      log(`❌ Test suite error: ${e.message}`, false);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>JWT Authentication Test</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.label}>Status: </Text>
        <Text
          style={[
            styles.status,
            testStatus === 'success'
              ? styles.connected
              : testStatus === 'failed'
                ? styles.disconnected
                : testStatus === 'running'
                  ? styles.running
                  : styles.unknown,
          ]}>
          {testStatus.toUpperCase()}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={runTests} disabled={isRunning}>
        {isRunning ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Run Authentication Tests</Text>
        )}
      </TouchableOpacity>

      <ScrollView style={styles.resultsContainer}>
        {testResults.map((result, index) => (
          <Text
            key={index}
            style={[styles.resultText, result.isSuccess ? styles.success : styles.failure]}>
            {result.message}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#3498db',
    borderRadius: 6,
    marginBottom: 15,
    padding: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  connected: {
    color: '#2ecc71',
  },
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
  },
  disconnected: {
    color: '#e74c3c',
  },
  failure: {
    color: 'red',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultText: {
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 10,
    maxHeight: 300,
    padding: 10,
  },
  running: {
    color: '#f39c12',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  success: {
    color: 'green',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  unknown: {
    color: '#7f8c8d',
  },
});

export default AuthTest;
