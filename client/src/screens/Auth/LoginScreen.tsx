import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function LoginScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual authentication API call
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // Navigate to main app after successful login
        // In real app, this would set an auth token in context/store
        // navigation.replace('Main');
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to log in. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.appName, { color: colors.primary }]}>KeepUp</Text>
      </View>
      
      <View style={styles.formContainer}>
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
          placeholder="Enter your password"
          placeholderTextColor={colors.tabIconDefault}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>Log In</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={{ color: colors.primary }}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={{ color: colors.text }}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
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
  loginButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
