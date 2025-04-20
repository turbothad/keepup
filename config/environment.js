// Environment configuration for React Native
// React Native doesn't support Node.js modules like 'dotenv'

// Directly export environment variables
// You may need to update this file when your .env changes
const env = {
  // Your MongoDB connection string (copy from .env)
  MONGODB_URI: 'mongodb+srv://averytflag:LDHUmbq3ar7nREsh@keepup.jxjcac8.mongodb.net/?retryWrites=true&w=majority&appName=keepup',
  NODE_ENV: 'development'
};

// Validate environment variables
if (!env.MONGODB_URI) {
  console.warn('Warning: MONGODB_URI is not defined in environment config');
}

module.exports = env; 