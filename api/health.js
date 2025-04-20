// Load environment variables
require('dotenv').config();

// Import the database connection
const database = require('../config/database');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  try {
    // Connect to MongoDB if not already connected
    if (!database.getConnectionStatus().isConnected) {
      await database.connect();
    }
    
    const dbStatus = database.getConnectionStatus();
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus.isConnected ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
}; 