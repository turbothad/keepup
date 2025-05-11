import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { AuthService, PostService } from '../services/api';

const ApiTester = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, success, message, data = null) => {
    setResults(prev => [
      { test, success, message, data, timestamp: new Date().toISOString() },
      ...prev,
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
          password: 'Password123!',
        };

        const registerResult = await AuthService.register(testUser);
        addResult('Register', true, 'Successfully registered test user', registerResult);

        // Logout test
        await AuthService.logout();
        addResult('Logout', true, 'Successfully logged out');

        // Login test
        const loginResult = await AuthService.login({
          email: testUser.email,
          password: testUser.password,
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
          imageUrl: 'https://placekitten.com/300/300',
        };

        const createResult = await PostService.createPost(newPost);
        addResult('Create Post', true, 'Successfully created test post', createResult);

        // Get posts test
        const posts = await PostService.getPosts();
        addResult('Get Posts', true, `Successfully retrieved ${posts.length} posts`, {
          count: posts.length,
        });
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
        <TouchableOpacity style={styles.button} onPress={runAuthTests} disabled={loading}>
          <Text style={styles.buttonText}>Test Auth API</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={runPostTests} disabled={loading}>
          <Text style={styles.buttonText}>Test Posts API</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={clearResults} disabled={loading}>
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loader} />}

      <ScrollView style={styles.resultsContainer}>
        {results.map((result, index) => (
          <View
            key={index}
            style={[styles.resultItem, result.success ? styles.successItem : styles.errorItem]}>
            <Text style={styles.resultTitle}>{result.test}</Text>
            <Text style={styles.resultStatus}>Status: {result.success ? 'SUCCESS' : 'FAILED'}</Text>
            <Text style={styles.resultMessage}>{result.message}</Text>
            <Text style={styles.resultTime}>{result.timestamp}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 5,
    flex: 1,
    marginBottom: 10,
    marginHorizontal: 5,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  clearButton: {
    alignItems: 'center',
    backgroundColor: '#6c757d',
    borderRadius: 5,
    flex: 1,
    marginBottom: 10,
    marginHorizontal: 5,
    padding: 10,
  },
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    flex: 1,
    margin: 20,
    padding: 20,
  },
  errorItem: {
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
  },
  loader: {
    marginVertical: 20,
  },
  resultItem: {
    borderRadius: 5,
    marginBottom: 10,
    padding: 15,
  },
  resultMessage: {
    marginBottom: 5,
  },
  resultStatus: {
    marginBottom: 5,
  },
  resultTime: {
    color: '#666',
    fontSize: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultsContainer: {
    flex: 1,
  },
  successItem: {
    backgroundColor: 'rgba(40, 167, 69, 0.2)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ApiTester;
