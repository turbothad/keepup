import React, { useContext, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '../../hooks/useThemeColor';
import { AuthContext } from '../../context/AuthContext';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { commonStyles } from '../../constants/Styles';

export default function TabsLayout() {
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tabIconDefault = useThemeColor({}, 'tabIconDefault');
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Handle authentication changes with useEffect instead of conditional returns
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.replace('/auth');
    }
  }, [loading, isAuthenticated]);

  // Show loading indicator while checking auth
  if (loading) {
    return (
      <View style={[commonStyles.centerContent, { backgroundColor }]}>
        <ActivityIndicator size="large" color={textColor} />
      </View>
    );
  }

  // Always render the Tabs, even if we're going to redirect
  // This prevents the hooks error
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: textColor,
        tabBarInactiveTintColor: tabIconDefault,
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
      <Tabs.Screen
        name="debug"
        options={{
          title: 'Debug',
          tabBarIcon: ({ color }) => <MaterialIcons name="bug-report" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
