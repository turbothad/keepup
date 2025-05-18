/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

// Rainbow accent colors for important elements
const rainbowAccents = {
  red: '#FF5A5F', // Airbnb-inspired red
  orange: '#FF9500', // Apple-inspired orange
  yellow: '#FFCC00', // Apple-inspired yellow
  green: '#34C759', // Apple-inspired green
  teal: '#5AC8FA', // Apple-inspired light blue
  blue: '#007AFF', // Apple-inspired blue
  purple: '#AF52DE', // Apple-inspired purple
  pink: '#FF2D55', // Apple-inspired pink
};

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#2f95dc',
    tabIconDefault: '#ccc',
    tabIconSelected: '#2f95dc',
    border: '#e0e0e0',
    accent: rainbowAccents.blue,
    secondary: '#664d00',
    error: rainbowAccents.red,
    success: rainbowAccents.green,
    warning: rainbowAccents.orange,
    lightGray: '#f5f5f5',
    darkGray: '#666',
    highlight: rainbowAccents.teal,
    card: {
      background: 'white',
      text: 'black',
      border: '#e0e0e0',
    },
    button: {
      primary: {
        background: '#000',
        text: 'white',
      },
      secondary: {
        background: '#f0f0f0',
        text: '#333',
      },
      danger: {
        background: 'rgba(255, 90, 95, 0.1)',
        text: rainbowAccents.red,
      },
      success: {
        background: 'rgba(52, 199, 89, 0.1)',
        text: rainbowAccents.green,
      },
      info: {
        background: 'rgba(0, 122, 255, 0.1)',
        text: rainbowAccents.blue,
      },
      warning: {
        background: 'rgba(255, 149, 0, 0.1)',
        text: rainbowAccents.orange,
      },
    },
  },
  dark: {
    text: '#fff',
    background: '#121212', // Soft black background
    tint: '#fff',
    tabIconDefault: '#666',
    tabIconSelected: '#fff',
    border: '#333',
    accent: rainbowAccents.blue,
    secondary: rainbowAccents.purple,
    error: rainbowAccents.red,
    success: rainbowAccents.green,
    warning: rainbowAccents.orange,
    lightGray: '#222',
    darkGray: '#888',
    highlight: rainbowAccents.teal,
    card: {
      background: '#1c1c1e', // Apple-inspired dark card background
      text: 'white',
      border: '#2c2c2e',
    },
    button: {
      primary: {
        background: rainbowAccents.blue,
        text: 'white',
      },
      secondary: {
        background: '#2c2c2e',
        text: '#fff',
      },
      danger: {
        background: 'rgba(255, 90, 95, 0.2)',
        text: rainbowAccents.red,
      },
      success: {
        background: 'rgba(52, 199, 89, 0.2)',
        text: rainbowAccents.green,
      },
      info: {
        background: 'rgba(0, 122, 255, 0.2)',
        text: rainbowAccents.blue,
      },
      warning: {
        background: 'rgba(255, 149, 0, 0.2)',
        text: rainbowAccents.orange,
      },
    },
  },
};
