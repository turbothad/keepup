import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { AuthService, PostService } from '../services/api';

const ApiTester = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, success, message, data = null) => {
    setResults(prev => [
      { test, success, message, data, timestamp: new Date().toISOString() },
      ...prev
    ]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const runAuthTests = async () => {
    setLoading(true);
    try {
      // Register test
      try {
        const testUser = {
          username: `testuser_${Date.now()}`,
          email: `test_${Date.now()}@example.com`,
          password: 'Password123!'
        };
        
        const registerResult = await AuthService.register(testUser);
        addResult('Register', true, 'Successfully registered test user', registerResult);
        
        // Logout test
        await AuthService.logout();
        addResult('Logout', true, 'Successfully logged out');
        
        // Login test
        const loginResult = await AuthService.login({
          email: testUser.email,
          password: testUser.password
        });
        addResult('Login', true, 'Successfully logged in', loginResult);
      } catch (err) {
        addResult('Auth Flow', false, `Auth test failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const runPostTests = async () => {
    setLoading(true);
    try {
      // Create post test
      try {
        const newPost = {
          description: `Test post created at ${new Date().toISOString()}`,
          imageUrl: 'https://placekitten.com/300/300'
        };
        
        const createResult = await PostService.createPost(newPost);
        addResult('Create Post', true, 'Successfully created test post', createResult);
        
        // Get posts test
        const posts = await PostService.getPosts();
        addResult('Get Posts', true, `Successfully retrieved ${posts.length} posts`, { count: posts.length });
      } catch (err) {
        addResult('Post Tests', false, `Post tests failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Tests</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={runAuthTests}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Auth API</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={runPostTests}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Posts API</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={clearResults}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>
      
      {loading && (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      )}
      
      <ScrollView style={styles.resultsContainer}>
        {results.map((result, index) => (
          <View 
            key={index} 
            style={[
              styles.resultItem, 
              result.success ? styles.successItem : styles.errorItem
            ]}
          >
            <Text style={styles.resultTitle}>{result.test}</Text>
            <Text style={styles.resultStatus}>
              Status: {result.success ? 'SUCCESS' : 'FAILED'}
            </Text>
            <Text style={styles.resultMessage}>{result.message}</Text>
            <Text style={styles.resultTime}>{result.timestamp}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  resultItem: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  successItem: {
    backgroundColor: 'rgba(40, 167, 69, 0.2)',
  },
  errorItem: {
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
  },
  resultTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  resultStatus: {
    marginBottom: 5,
  },
  resultMessage: {
    marginBottom: 5,
  },
  resultTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default ApiTester; 