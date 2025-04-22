/**
 * MongoDB Connection Test Script
 * Run with 'node scripts/test-connection.js'
 */

// Load environment variables
require('dotenv').config();

// Import the database connection
const database = require('../config/database');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log(`MongoDB URI: ${process.env.MONGODB_URI ? '✓ Found' : '✗ Missing'}`);
    
    // Connect to MongoDB
    await database.connect();
    
    // Get connection status
    const status = database.getConnectionStatus();
    console.log(`Connection status: ${status.isConnected ? '✓ Connected' : '✗ Not connected'}`);
    console.log(`Connection state: ${status.readyState}`);
    
    // Disconnect
    await database.disconnect();
    console.log('Successfully disconnected from MongoDB');
    
    console.log('\nConnection test completed successfully!');
  } catch (error) {
    console.error('Error testing connection:', error.message);
    console.error(error);
  }
}

// Run the test
testConnection(); 