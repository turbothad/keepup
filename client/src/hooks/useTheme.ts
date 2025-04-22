import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

export interface ThemeColors {
  text: string;
  background: string;
  primary: string;
  secondary: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return {
    isDark,
    colors: Colors[isDark ? 'dark' : 'light'],
  };
}

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useTheme();
  const colorFromProps = props[theme.isDark ? 'dark' : 'light'];

  if (colorFromProps) {
    return colorFromProps;
  }
  return theme.colors[colorName];
}
