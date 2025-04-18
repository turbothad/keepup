# MongoDB Integration for KeepUp App

This document outlines the MongoDB integration for the KeepUp app, including setup, model structure, and usage patterns.

## Setup

The MongoDB integration has been designed specifically to work well with React Native, addressing common compatibility issues.

### Prerequisites

- MongoDB Atlas account (already set up)
- Node.js and npm

### Configuration

1. The MongoDB connection string is stored in the `.env` file as `MONGODB_URI`.
2. The database connection is managed through a singleton pattern in `config/database.js`.

## Models

All models are defined using Mongoose schemas and follow CommonJS syntax for better React Native compatibility:

- **User**: Stores user information, preferences, friends, and groups
- **Post**: Represents user posts, including content, likes, and comments
- **Comment**: Stores comments on posts
- **Group**: Represents user groups

## Services

Service layers provide an abstraction over direct database operations:

- **userService.js**: User-related operations (creating users, finding users, friends management)
- **postService.js**: Post-related operations (creating posts, retrieving feeds, likes management)

## Testing and Utilities

Several utilities are provided to test and seed the database:

- **Test Connection**: `npm run test-db`  
  Tests the MongoDB connection to verify your setup is working

- **Seed Database**: `npm run seed-db`  
  Populates the database with initial test data, including users, posts, comments, and a group

- **DB Test Screen**: `/app/db-test.js`  
  A diagnostic screen for testing database connections and operations directly from the app

## React Native Compatibility

This integration addresses several common issues when using MongoDB with React Native:

1. **Crypto Polyfill**: Uses `react-native-get-random-values` to provide the crypto functionality needed by BSON
2. **Module Format**: Uses CommonJS (`require()`) instead of ES modules for better compatibility
3. **Singleton Pattern**: Ensures a single database connection is maintained
4. **Error Handling**: Comprehensive error handling throughout the database interaction layer

## Common Issues and Solutions

- **Connection Issues**: Check your MongoDB Atlas connection string in `.env` and ensure network connectivity
- **Module Not Found**: Make sure `react-native-get-random-values` is imported as the first import in `app/entry.js`
- **Model Undefined**: Check that models are being properly required and that circular dependencies are avoided
- **Crypto Missing**: Ensure the polyfill is properly imported before any MongoDB operations

## Usage Examples

### Connecting to the Database

```javascript
const database = require('../config/database');

async function myFunction() {
  await database.connect();
  // Database operations here
  const connectionStatus = database.getConnectionStatus();
  console.log(`Connected: ${connectionStatus.isConnected}`);
}
```

### Creating a User

```javascript
const userService = require('../services/userService');

async function createNewUser() {
  try {
    const userData = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
      // Other user properties
    };
    
    const newUser = await userService.createUser(userData);
    console.log('User created:', newUser);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}
```

### Getting User Feed

```javascript
const postService = require('../services/postService');

async function getUserFeed(userId) {
  try {
    const feed = await postService.getFeedForUser(userId);
    return feed; // Array of posts with populated user and comment data
  } catch (error) {
    console.error('Error getting feed:', error);
    return [];
  }
}
``` 