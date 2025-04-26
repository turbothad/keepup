import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:818/api';
// For physical devices, use your computer's local IP:
// const API_URL = 'http://192.168.x.x:818/api';

const ServerTest = () => {
  const [serverStatus, setServerStatus] = useState('unknown');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simple ping to server
      const response = await axios.get(`${API_URL}/users/ping`);
      setServerStatus('connected');
      console.log('Server response:', response.data);
    } catch (err) {
      setServerStatus('disconnected');
      setError(err.message);
      console.error('Server connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Server Connection Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Status: </Text>
        <Text style={[
          styles.status,
          serverStatus === 'connected' ? styles.connected : 
          serverStatus === 'disconnected' ? styles.disconnected : 
          styles.unknown
        ]}>
          {serverStatus.toUpperCase()}
        </Text>
      </View>
      
      {error && (
        <Text style={styles.error}>Error: {error}</Text>
      )}

      <TouchableOpacity 
        style={styles.button} 
        onPress={testConnection}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Test Connection</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  connected: {
    color: 'green',
  },
  disconnected: {
    color: 'red',
  },
  unknown: {
    color: 'orange',
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ServerTest; 