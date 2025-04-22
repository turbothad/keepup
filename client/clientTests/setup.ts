import '@jest/globals';

// Mock modules that may cause issues
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}));

// Set timeout for all tests to 10 seconds
jest.setTimeout(10000);

// Mock fetch globally
global.fetch = jest.fn();

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock additional React Native modules that might cause issues
jest.mock('react-native-reanimated', () => ({}));
jest.mock('react-native-get-random-values', () => ({}));

// Add any other global test setup here 