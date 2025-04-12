import React from 'react';
import { StyleSheet, Image, TouchableOpacity, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { User, UserTheme } from '../models/User';

// Sample user data - in a real app this would come from authentication
const currentUser: User = {
  id: 'user1',
  username: 'John Doe',
  email: 'john@example.com',
  profilePicture: 'https://via.placeholder.com/120',
  friends: ['user2', 'user3', 'user4', 'user5'],
  groups: ['1', '2', '3'],
  settings: {
    theme: UserTheme.DARK,
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
  },
  hasPostedToday: false,
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date()
};

// Setting list items with icons
const settingItems = [
  { id: 'account', label: 'Account Settings', icon: 'account-circle' },
  { id: 'notifications', label: 'Notification Preferences', icon: 'notifications' },
  { id: 'privacy', label: 'Privacy Controls', icon: 'security' },
  { id: 'appearance', label: 'App Appearance', icon: 'palette' },
  { id: 'help', label: 'Help & Support', icon: 'help' },
  { id: 'logout', label: 'Logout', icon: 'exit-to-app' },
];

export default function Profile() {
  const handleSettingPress = (settingId: string) => {
    console.log(`Setting pressed: ${settingId}`);
    // In a real app, this would navigate to the respective setting screen
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={{ uri: currentUser.profilePicture || 'https://via.placeholder.com/120' }} 
            style={styles.profilePicture} 
          />
          
          <ThemedText type="title" style={styles.username}>{currentUser.username}</ThemedText>
          <ThemedText style={styles.email}>{currentUser.email}</ThemedText>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText type="defaultSemiBold">{currentUser.friends.length}</ThemedText>
              <ThemedText style={styles.statLabel}>Friends</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText type="defaultSemiBold">{currentUser.groups.length}</ThemedText>
              <ThemedText style={styles.statLabel}>Groups</ThemedText>
            </View>
          </View>
        </View>
        
        <ThemedText type="subtitle" style={styles.sectionTitle}>Settings</ThemedText>
        
        {settingItems.map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.settingItem}
            onPress={() => handleSettingPress(item.id)}
          >
            <MaterialIcons name={item.icon as any} size={24} color="white" style={styles.settingIcon} />
            <ThemedText style={styles.settingLabel}>{item.label}</ThemedText>
            <MaterialIcons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  username: {
    marginBottom: 5,
  },
  email: {
    marginBottom: 20,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    marginBottom: 15,
    marginTop: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingLabel: {
    flex: 1,
  }
}); 