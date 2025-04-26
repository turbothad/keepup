import React, { useContext } from 'react';
import { StyleSheet, Image, Button, ScrollView } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { AuthContext } from '../../context/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
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
        <ThemedView style={styles.header}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/100' }} 
            style={styles.profileImage} 
          />
          <ThemedText type="title">{user?.username || 'User'}</ThemedText>
          <ThemedText>{user?.email || 'email@example.com'}</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Profile Info</ThemedText>
          <ThemedView style={styles.infoCard}>
            <ThemedText>Member since: {new Date().toLocaleDateString()}</ThemedText>
            <ThemedText>Posts: 0</ThemedText>
            <ThemedText>Groups: 3</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.actions}>
          <Button 
            title="Edit Profile" 
            onPress={() => console.log('Edit profile')} 
          />
          <Button 
            title="Logout" 
            onPress={handleLogout} 
            color="#FF6347"
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  section: {
    padding: 20,
  },
  infoCard: {
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  actions: {
    padding: 20,
    gap: 10,
  }
}); 