import React, { useContext, useEffect } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useThemeColor } from '../hooks/useThemeColor';

export default function IndexPage() {
  const { loading, isAuthenticated } = useContext(AuthContext);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated()) {
        router.replace('/(tabs)' as any);
      } else {
        router.replace('/auth');
      }
    }
  }, [loading, isAuthenticated]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor,
      }}
    >
      <ActivityIndicator size="large" color={textColor} />
    </View>
  );
}
