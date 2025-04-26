import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';
import { AuthProvider } from '../context/AuthContext';
export default function AppLayout() {
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <AuthProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: textColor,
        tabBarInactiveTintColor: useThemeColor({}, 'tabIconDefault'),
        tabBarStyle: { backgroundColor },
        headerStyle: { backgroundColor },
        headerTintColor: textColor,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color }) => <MaterialIcons name="group" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <MaterialIcons name="dynamic-feed" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create-post"
        options={{
          title: 'Post',
          tabBarIcon: ({ color }) => <MaterialIcons name="add-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
    </AuthProvider>
  );
}
