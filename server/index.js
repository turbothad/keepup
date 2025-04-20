// Main server entry point
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const database = require('../config/database');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Apply middleware
app.use(cors()); // Enable CORS for all routes

// Increase size limits for JSON and URL-encoded data to handle large images
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Print all incoming requests for debugging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  // Debug info for post requests
  if (req.method === 'POST' && req.url.includes('/api/posts')) {
    console.log(`[${timestamp}] Request body size: ${JSON.stringify(req.body).length} bytes`);
    
    // Debug headers
    console.log(`[${timestamp}] Content-Type: ${req.headers['content-type']}`);
    
    // Debug body keys without printing the full content
    const keys = Object.keys(req.body);
    console.log(`[${timestamp}] Body keys: ${keys.join(', ')}`);
    
    // Log truncated values for each key
    keys.forEach(key => {
      const value = req.body[key];
      let truncated;
      
      if (typeof value === 'string' && value.length > 100) {
        truncated = value.substring(0, 100) + '...';
      } else {
        truncated = value;
      }
      
      console.log(`[${timestamp}] ${key}: ${truncated}`);
    });
  }
  
  next();
});

// Connect to MongoDB
database.connect()
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'KeepUp API server is running',
    endpoints: [
      '/health',
      '/api/posts',
      '/api/users'
    ]
  });
});

// Health check route (at root level for easier access)
app.get('/health', (req, res) => {
  const dbStatus = database.getConnectionStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus.isConnected ? 'connected' : 'disconnected'
  });
});

// Register routes
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

// Global error handler
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Server error:`, err);
  
  // Detailed error logging
  if (err.name === 'ValidationError') {
    console.error(`[${timestamp}] Validation Error Details:`, err.errors);
  } else if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    console.error(`[${timestamp}] MongoDB Error Code:`, err.code);
  }
  
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health endpoint: http://localhost:${PORT}/health`);
  console.log(`API endpoints: http://localhost:${PORT}/api/posts, http://localhost:${PORT}/api/users`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  database.disconnect().then(() => {
    process.exit(0);
  });
});

module.exports = app; 