// Import kept as reference, but commented out since we're forcing dark mode
// import { useColorScheme as _useColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';

// Export a modified version that always returns 'dark'
export function useColorScheme(): ColorScheme {
  // You can uncomment this line and the import above
  // if you want to revert to system-based theme switching later
  // const colorScheme = _useColorScheme();

  // Always return 'dark' to force dark mode
  return 'dark';
}
