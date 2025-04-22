import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function SignupScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual signup API call
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          'Success', 
          'Account created successfully!',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }, 1500);
      
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          Join KeepUp and connect with friends
        </Text>
        
        <View style={styles.formContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Username</Text>
          <TextInput
            style={[styles.input, { 
              color: colors.text,
              borderColor: colors.tabIconDefault,
              backgroundColor: colors.background
            }]}
            placeholder="Choose a username"
            placeholderTextColor={colors.tabIconDefault}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <TextInput
            style={[styles.input, { 
              color: colors.text,
              borderColor: colors.tabIconDefault,
              backgroundColor: colors.background
            }]}
            placeholder="Enter your email"
            placeholderTextColor={colors.tabIconDefault}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <Text style={[styles.label, { color: colors.text }]}>Password</Text>
          <TextInput
            style={[styles.input, { 
              color: colors.text,
              borderColor: colors.tabIconDefault,
              backgroundColor: colors.background
            }]}
            placeholder="Create a password"
            placeholderTextColor={colors.tabIconDefault}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
          <TextInput
            style={[styles.input, { 
              color: colors.text,
              borderColor: colors.tabIconDefault,
              backgroundColor: colors.background
            }]}
            placeholder="Confirm your password"
            placeholderTextColor={colors.tabIconDefault}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={[styles.signupButton, { backgroundColor: colors.primary }]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={{ color: colors.text }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    alignSelf: 'center',
  },
  formContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
  },
  signupButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});
