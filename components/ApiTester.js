import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

// API service for testing
const DEV_API_URL = 'http://localhost:3001'; // iOS simulator can use localhost
const PROD_API_URL = 'https://keepup-vercel.vercel.app'; // Vercel deployment

// Use appropriate URL based on env
const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

/**
 * API Tester Component
 * Add this to any screen to test API connectivity
 * Just import and include <ApiTester /> in your component tree
 */
export default function ApiTester() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);

  // Test API health
  const testApiHealth = async () => {
    setIsLoading(true);
    setApiStatus(null);
    
    try {
      console.log('Testing API connection to:', `${API_URL}/health`);
      const response = await fetch(`${API_URL}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API health response:', data);
      
      setApiStatus({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
      
      Alert.alert(
        'API Connection Success',
        `Connected to API (${API_URL})
Database: ${data.database}
Environment: ${data.environment}
Timestamp: ${data.timestamp}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('API connection failed:', error);
      
      setApiStatus({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      Alert.alert(
        'API Connection Failed',
        `Error connecting to API (${API_URL}): ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Test posts endpoint
  const testPosts = async () => {
    setIsLoading(true);
    
    try {
      console.log('Testing posts endpoint:', `${API_URL}/api/posts`);
      const response = await fetch(`${API_URL}/api/posts`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Retrieved ${data.length} posts`);
      
      Alert.alert(
        'Posts Endpoint Success',
        `Successfully retrieved ${data.length} posts from the API`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Posts endpoint test failed:', error);
      
      Alert.alert(
        'Posts Endpoint Failed',
        `Error fetching posts: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Run test on component mount
  useEffect(() => {
    testApiHealth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Tester</Text>
      <Text style={styles.subtitle}>Current environment: {__DEV__ ? 'Development' : 'Production'}</Text>
      <Text style={styles.api}>API URL: {API_URL}</Text>
      
      {apiStatus && (
        <View style={[
          styles.statusContainer, 
          apiStatus.success ? styles.successContainer : styles.errorContainer
        ]}>
          <Text style={styles.statusText}>
            Status: {apiStatus.success ? 'Connected' : 'Error'}
          </Text>
          {apiStatus.success ? (
            <Text style={styles.statusDetail}>
              Database: {apiStatus.data?.database || 'Unknown'}
            </Text>
          ) : (
            <Text style={styles.statusDetail}>
              Error: {apiStatus.error || 'Unknown error'}
            </Text>
          )}
          <Text style={styles.timestamp}>
            Last checked: {apiStatus.timestamp}
          </Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={testApiHealth}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Testing...' : 'Test API Health'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={testPosts}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Testing...' : 'Test Posts Endpoint'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  api: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  statusContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successContainer: {
    backgroundColor: '#e6f7e6',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 