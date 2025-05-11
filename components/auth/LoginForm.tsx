import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onLogin, onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Basic validation
    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    onLogin({ email, password });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome to KeepUp
      </ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#777"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <ThemedText style={styles.buttonText}>Log In</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchButton} onPress={onSwitchToSignup}>
        <ThemedText style={styles.switchText}>New to KeepUp? Sign up</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 5,
    color: 'white',
    height: 50,
    marginBottom: 15,
    padding: 10,
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  switchText: {
    textDecorationLine: 'underline',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});
