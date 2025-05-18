import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import Colors from '../constants/Colors';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'info'
  | 'warning'
  | 'rainbow';
type ButtonSize = 'small' | 'medium' | 'large';

export type ThemedButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  lightColor?: string;
  darkColor?: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  isDisabled?: boolean;
};

export function ThemedButton({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  lightColor,
  darkColor,
  buttonStyle,
  textStyle,
  isDisabled = false,
  ...rest
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    {
      light: lightColor,
      dark: darkColor,
    },
    `button.${variant === 'rainbow' ? 'primary' : variant}.background`
  ) as string;

  const textColor = useThemeColor(
    {},
    `button.${variant === 'rainbow' ? 'primary' : variant}.text`
  ) as string;

  // Get linear gradient colors if using rainbow variant
  const isRainbow = variant === 'rainbow';

  // Button and text styles based on props
  const buttonVariantStyle = getButtonVariantStyle(variant, isDisabled);
  const buttonSizeStyle = getButtonSizeStyle(size);
  const buttonWidthStyle = fullWidth ? { width: '100%' } : {};

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        buttonVariantStyle,
        buttonSizeStyle,
        buttonWidthStyle,
        {
          opacity: pressed || isDisabled ? 0.7 : 1,
          backgroundColor: isRainbow ? undefined : backgroundColor,
        },
        // Add special rainbow gradient effect via border if it's a rainbow button
        isRainbow && styles.rainbowBorder,
        buttonStyle,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      <Text
        style={[
          styles.text,
          { color: textColor },
          size === 'small' && styles.smallText,
          size === 'large' && styles.largeText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

// Helper functions to get styles based on variant and size
function getButtonVariantStyle(
  variant: ButtonVariant,
  isDisabled: boolean
): ViewStyle {
  if (isDisabled) {
    return {
      backgroundColor: '#555',
    };
  }

  if (variant === 'rainbow') {
    return {
      backgroundColor: Colors.dark.card.background,
    };
  }

  return {};
}

function getButtonSizeStyle(size: ButtonSize): ViewStyle {
  switch (size) {
    case 'small':
      return {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
      };
    case 'large':
      return {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
      };
    default:
      return {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
      };
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  largeText: {
    fontSize: 18,
  },
  rainbowBorder: {
    borderWidth: 1.5,
    borderColor: Colors.dark.button.primary.background,
    // Since we can't actually use a gradient border easily, we'll use a solid color
    // In a real implementation, you might want to use a LinearGradient component
  },
  smallText: {
    fontSize: 14,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
