// Import the polyfill at the app's entry point
// This should be imported in your app's entry file (e.g., App.js or index.js)
// import 'react-native-get-random-values';

const mongoose = require('mongoose');

// Singleton pattern for database connection
let instance = null;

class Database {
  constructor() {
    if (instance) {
      return instance;
    }
    
    this.isConnected = false;
    instance = this;
  }

  async connect() {
    try {
      if (this.isConnected) {
        console.log('Using existing database connection');
        return;
      }

      // Get MongoDB URI from environment variable
      const uri = process.env.MONGODB_URI;
      
      if (!uri) {
        throw new Error('MONGODB_URI environment variable is not defined');
      }
      
      console.log('Connecting to MongoDB...');
      await mongoose.connect(uri);
      
      this.isConnected = true;
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      this.isConnected = false;
      console.error('Error connecting to database:', error.message);
      throw error;
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from database:', error.message);
      throw error;
    }
  }

  // Helper method to check connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    };
  }
}

module.exports = new Database(); 