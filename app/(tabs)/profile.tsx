import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Image, Button, ScrollView, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { AuthContext } from '../../context/AuthContext';
import { router } from 'expo-router';

// Define API_URL
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:818/api';

// Define user profile interface
interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  friends: string[];
  groups: string[];
  settings: {
    theme: string;
    notifications: {
      newComments: boolean;
      friendRequests: boolean;
      groupInvites: boolean;
      dailyReminder: boolean;
    };
    privacy: {
      profileVisibility: string;
      allowFriendRequests: boolean;
    };
  };
  hasPostedToday: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [user?.token]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = user?.token;
      if (!token) return;

      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Explicitly navigate to auth screen after logout
      router.replace('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSettingPress = (settingId: string) => {
    console.log(`Setting pressed: ${settingId}`);
    if (settingId === 'logout') {
      handleLogout();
    }
    // Handle other settings navigation
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

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading profile...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{ uri: profileData?.profilePicture || 'https://via.placeholder.com/120' }}
            style={styles.profileImage}
          />

          <ThemedText type="title" style={styles.username}>
            {profileData?.username}
          </ThemedText>
          <ThemedText style={styles.email}>{profileData?.email}</ThemedText>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText type="defaultSemiBold">{profileData?.friends?.length || 0}</ThemedText>
              <ThemedText style={styles.statLabel}>Friends</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText type="defaultSemiBold">{profileData?.groups?.length || 0}</ThemedText>
              <ThemedText style={styles.statLabel}>Groups</ThemedText>
            </View>
          </View>
        </View>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Settings
        </ThemedText>

        {settingItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={() => handleSettingPress(item.id)}>
            <MaterialIcons
              name={item.icon as any}
              size={24}
              color="white"
              style={styles.settingIcon}
            />
            <ThemedText style={styles.settingLabel}>{item.label}</ThemedText>
            <MaterialIcons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 10,
    padding: 20,
  },
  container: {
    flex: 1,
  },
  email: {
    marginBottom: 20,
    opacity: 0.7,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  infoCard: {
    borderRadius: 8,
    marginTop: 10,
    padding: 15,
  },
  profileImage: {
    borderRadius: 50,
    height: 100,
    marginBottom: 15,
    width: 100,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    marginBottom: 15,
    marginTop: 10,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingItem: {
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 15,
    width: '100%',
  },
  settingLabel: {
    flex: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    width: '80%',
  },
  username: {
    marginBottom: 5,
  },
});
