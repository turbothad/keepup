import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { User } from '../../models/User';

interface SignupFormProps {
  onSignup: (user: Partial<User>) => void;
}

export default function SignupForm({ onSignup }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    // Basic validation
    if (!email || !username || !password) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Create new user object
    const newUser: Partial<User> = {
      email,
      username,
      password, // This would be hashed on the backend
    };
    
    onSignup(newUser);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Join KeepUp</ThemedText>
      
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
        placeholder="Username"
        placeholderTextColor="#777"
        value={username}
        onChangeText={setUsername}
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
      
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#777"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSignup}
      >
        <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 5,
    color: 'white',
    height: 50,
    marginBottom: 15,
    padding: 10,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 15,
  }
}); 