import React, { useContext, useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { AuthContext } from '../../context/AuthContext';
import { commonStyles } from '../../constants/Styles';
import Colors from '../../constants/Colors';

export default function TabsLayout() {
  const backgroundColor = useThemeColor({}, 'background') as string;
  const textColor = useThemeColor({}, 'text') as string;
  const tabIconDefault = useThemeColor({}, 'tabIconDefault') as string;
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Get rainbow accent colors for the tab icons
  const rainbowAccents = [
    Colors.dark.button.primary.background, // blue
    Colors.dark.error, // red
    Colors.dark.warning, // orange
    Colors.dark.success, // green
    Colors.dark.secondary, // purple
  ];

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
        tabBarStyle: {
          backgroundColor,
          borderTopColor: Colors.dark.card.border,
          height: 90,
          paddingBottom: 25,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor,
          shadowColor: 'transparent', // iOS
          elevation: 0, // Android
        },
        headerTintColor: textColor,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Groups',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="group"
              size={28}
              color={focused ? rainbowAccents[0] : tabIconDefault}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="dynamic-feed"
              size={28}
              color={focused ? rainbowAccents[1] : tabIconDefault}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create-post"
        options={{
          title: 'Post',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="add-circle"
              size={34}
              color={focused ? rainbowAccents[2] : tabIconDefault}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="person"
              size={28}
              color={focused ? rainbowAccents[3] : tabIconDefault}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="debug"
        options={{
          title: 'Debug',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="bug-report"
              size={28}
              color={focused ? rainbowAccents[4] : tabIconDefault}
            />
          ),
        }}
      />
    </Tabs>
  );
}
