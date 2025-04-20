import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import the database connection
const database = require('../config/database');

export default function DbTestRN() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testMongooseModule = () => {
    clearResults();
    setLoading(true);
    
    try {
      // Import mongoose directly to test it
      const mongoose = require('mongoose');
      
      // Log mongoose type and properties
      addResult(`mongoose type: ${typeof mongoose}`);
      
      if (typeof mongoose === 'object') {
        // Check available properties and methods
        addResult(`mongoose keys: ${Object.keys(mongoose).join(', ')}`);
        addResult(`mongoose.connect type: ${typeof mongoose.connect}`);
        addResult(`mongoose.Schema type: ${typeof mongoose.Schema}`);
        addResult(`mongoose.model type: ${typeof mongoose.model}`);
      }
      
      addResult('Mongoose module test completed');
    } catch (error: any) {
      addResult(`Error testing mongoose: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const testDatabaseConnection = async () => {
    clearResults();
    setLoading(true);
    
    try {
      addResult('Testing database connection...');
      
      // Test the database utility
      addResult(`database type: ${typeof database}`);
      
      if (typeof database === 'object') {
        // Log database methods
        addResult(`database.connect type: ${typeof database.connect}`);
        addResult(`database.disconnect type: ${typeof database.disconnect}`);
        addResult(`database.getConnectionStatus type: ${typeof database.getConnectionStatus}`);
      }
      
      try {
        // Try to connect
        addResult('Attempting to connect to database...');
        await database.connect();
        
        // Check connection status
        const status = database.getConnectionStatus();
        addResult(`Connection status: ${status.isConnected ? 'Connected' : 'Not connected'}`);
        addResult(`Connection state: ${status.readyState}`);
        
        // Disconnect
        await database.disconnect();
        addResult('Successfully disconnected from database');
      } catch (connectionError: any) {
        addResult(`Connection error: ${connectionError.message}`);
        console.error(connectionError);
      }
      
      addResult('Database connection test completed');
    } catch (error: any) {
      addResult(`Error in database test: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const testModelsImport = () => {
    clearResults();
    setLoading(true);
    
    try {
      addResult('Testing models import...');
      
      // Try to import the models
      const models = require('../models');
      
      addResult(`models type: ${typeof models}`);
      
      if (typeof models === 'object') {
        // Log available models
        addResult(`Available models: ${Object.keys(models).join(', ')}`);
        
        // Check each model
        Object.entries(models).forEach(([name, model]) => {
          addResult(`Model ${name} type: ${typeof model}`);
        });
      }
      
      addResult('Models import test completed');
    } catch (error: any) {
      addResult(`Error importing models: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>React Native MongoDB Test</Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Test Mongoose Module" 
            onPress={testMongooseModule}
            disabled={loading} 
          />
          <View style={styles.buttonSpacer} />
          <Button 
            title="Test Database Connection" 
            onPress={testDatabaseConnection}
            disabled={loading} 
          />
          <View style={styles.buttonSpacer} />
          <Button 
            title="Test Models Import" 
            onPress={testModelsImport}
            disabled={loading} 
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="Clear Results"
            onPress={clearResults}
            disabled={loading}
            color="#777"
          />
        </View>
        
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results:</Text>
          {loading ? (
            <Text style={styles.loading}>Running tests...</Text>
          ) : (
            testResults.map((result, index) => (
              <Text key={index} style={styles.resultText}>
                {result}
              </Text>
            ))
          )}
          {testResults.length === 0 && !loading && (
            <Text style={styles.noResults}>No test results yet</Text>
          )}
        </View>
      </ScrollView>
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
  buttonContainer: {
    marginBottom: 20,
  },
  buttonSpacer: {
    height: 10,
  },
  resultsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 5,
  },
  loading: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  noResults: {
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#777',
    marginVertical: 10,
  },
}); 