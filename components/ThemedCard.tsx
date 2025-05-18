import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

export type ThemedCardProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  elevated?: boolean;
  noBorder?: boolean;
};

export function ThemedCard({
  style,
  lightColor,
  darkColor,
  elevated = false,
  noBorder = false,
  ...otherProps
}: ThemedCardProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'card.background'
  ) as string;

  const borderColor = useThemeColor({}, 'card.border') as string;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor: noBorder ? 'transparent' : borderColor,
        },
        elevated && styles.elevated,
        style,
      ]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    padding: 16,
  },
  elevated: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
