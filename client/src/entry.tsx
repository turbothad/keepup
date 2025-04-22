// Import crypto polyfill for MongoDB compatibility in React Native
import 'react-native-get-random-values';
import { registerRootComponent } from 'expo';
import App from './navigation/AppNavigator';

// Register the root component
registerRootComponent(App); 