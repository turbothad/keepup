import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Import the DB connection
const database = require('../config/database');

// Import models
const { User, Post, Comment, Group } = require('../models');

export default function DbTestScreen() {
  const [connectionStatus, setConnectionStatus] = useState('Not connected');
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Connect to database when component mounts
  useEffect(() => {
    checkConnection();
  }, []);

  // Test MongoDB connection
  const checkConnection = async () => {
    setIsLoading(true);
    try {
      await database.connect();
      const status = database.getConnectionStatus();
      setConnectionStatus(
        status.isConnected ? 'Connected' : `Not connected (state: ${status.readyState})`
      );
    } catch (error) {
      setConnectionStatus(`Error connecting: ${error.message}`);
      console.error('Connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Test user creation
  const testCreateUser = async () => {
    setIsLoading(true);
    setTestResult('');
    try {
      // Make sure we're connected
      await database.connect();
      
      // Create a test user
      const testUser = new User({
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'password123',
        settings: {
          theme: 'system',
          notifications: {
            newComments: true,
            friendRequests: true,
            groupInvites: true,
            dailyReminder: true
          },
          privacy: {
            profileVisibility: 'public',
            allowFriendRequests: true
          }
        }
      });
      
      // Save the user to the database
      const savedUser = await testUser.save();
      
      setTestResult(JSON.stringify(savedUser, null, 2));
    } catch (error) {
      setTestResult(`Error creating user: ${error.message}\n\nStack: ${error.stack}`);
      console.error('Test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Test user retrieval
  const testGetUsers = async () => {
    setIsLoading(true);
    setTestResult('');
    try {
      // Make sure we're connected
      await database.connect();
      
      // Get all users (limit to 5 for display)
      const users = await User.find().limit(5);
      
      setTestResult(JSON.stringify(users, null, 2));
    } catch (error) {
      setTestResult(`Error getting users: ${error.message}\n\nStack: ${error.stack}`);
      console.error('Test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>MongoDB Connection Test</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.label}>Connection Status:</Text>
          <Text style={[
            styles.status,
            connectionStatus.includes('Connected') ? styles.connected : styles.disconnected
          ]}>
            {connectionStatus}
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Check Connection" 
            onPress={checkConnection}
            disabled={isLoading} 
          />
          <Button 
            title="Test Create User" 
            onPress={testCreateUser}
            disabled={isLoading} 
          />
          <Button 
            title="Test Get Users" 
            onPress={testGetUsers}
            disabled={isLoading} 
          />
        </View>
        
        {isLoading && <Text style={styles.loading}>Loading...</Text>}
        
        {testResult ? (
          <View style={styles.resultContainer}>
            <Text style={styles.label}>Test Result:</Text>
            <Text style={styles.result}>{testResult}</Text>
          </View>
        ) : null}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  status: {
    fontSize: 18,
    fontWeight: '500',
  },
  connected: {
    color: 'green',
  },
  disconnected: {
    color: 'red',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
  },
  loading: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
    fontStyle: 'italic',
  },
  resultContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  result: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
}); 