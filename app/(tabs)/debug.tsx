import React, { useContext } from 'react';
import { StyleSheet, Button, ScrollView } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { AuthContext } from '../../context/AuthContext';
import { router } from 'expo-router';
import ServerTest from '../../components/ServerTest';
import ApiTester from '../../components/ApiTester';

export default function DebugScreen() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      // Explicitly navigate to auth screen after logout
      router.replace('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText type="title" style={styles.title}>Debug Panel</ThemedText>
        
        <ThemedText type="subtitle" style={styles.sectionTitle}>User Info:</ThemedText>
        <ThemedView style={styles.card}>
          <ThemedText>User ID: {user?.id || 'Not logged in'}</ThemedText>
          <ThemedText>Email: {user?.email || 'Not available'}</ThemedText>
          <ThemedText>Username: {user?.username || 'Not available'}</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.actions}>
          <Button 
            title="Logout" 
            onPress={handleLogout} 
            color="#FF6347"
          />
        </ThemedView>
        <ServerTest />
        <ApiTester />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginVertical: 10,
  },
  card: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  actions: {
    marginTop: 20,
  }
}); 