// Load environment variables
require('dotenv').config();

// Import required modules
const database = require('../config/database');
const User = require('../models/User');

// Helper to handle database connection
const connectDB = async () => {
  if (!database.getConnectionStatus().isConnected) {
    await database.connect();
  }
};

// CORS Headers
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

module.exports = async (req, res) => {
  // Set CORS headers
  setCorsHeaders(res);
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          // Get user by ID
          const user = await User.findById(req.query.id, '-password');
          
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          
          return res.status(200).json(user);
        } else {
          // Get all users
          const users = await User.find({}, '-password');
          return res.status(200).json(users);
        }
      
      case 'PUT':
        // Update user
        if (req.query.id) {
          const { name, bio, profilePicture } = req.body;
          const updates = {};
          
          if (name) updates.name = name;
          if (bio !== undefined) updates.bio = bio;
          if (profilePicture) updates.profilePicture = profilePicture;
          
          const user = await User.findByIdAndUpdate(
            req.query.id,
            { $set: updates },
            { new: true, runValidators: true }
          ).select('-password');
          
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          
          return res.status(200).json(user);
        }
        
        return res.status(400).json({ error: 'User ID is required' });
      
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}; 