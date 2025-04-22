import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connection options
const options: mongoose.ConnectOptions = {
  // No need to specify these in Mongoose 6+, they are defaults
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true,
};

// MongoDB connection string - use Atlas for both dev and prod
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@<cluster-url>/keepup?retryWrites=true&w=majority';

if (!process.env.MONGODB_URI) {
  console.warn('Warning: MONGODB_URI not set in environment variables. Using default connection string.');
}

// Connection state object
const connectionState = {
  isConnected: false,
  connectionError: null as Error | null,
};

/**
 * Connect to MongoDB
 */
export const connectToDatabase = async (): Promise<void> => {
  if (connectionState.isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
      throw new Error('MongoDB URI environment variable is not defined or contains placeholder values');
    }

    const db = await mongoose.connect(MONGODB_URI, options);
    
    connectionState.isConnected = db.connection.readyState === 1;
    connectionState.connectionError = null;
    
    console.log('Connected to MongoDB Atlas');
    
    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      connectionState.connectionError = err;
      connectionState.isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      connectionState.isConnected = false;
    });
    
    // Handle application termination - close database connection gracefully
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Error connecting to database:', error);
    connectionState.connectionError = error as Error;
    connectionState.isConnected = false;
    throw error;
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectFromDatabase = async (): Promise<void> => {
  if (!connectionState.isConnected) {
    return;
  }
  
  try {
    await mongoose.connection.close();
    connectionState.isConnected = false;
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
};

/**
 * Get connection status
 */
export const getConnectionStatus = (): { isConnected: boolean; error: Error | null } => {
  return {
    isConnected: connectionState.isConnected,
    error: connectionState.connectionError,
  };
};

export default {
  connect: connectToDatabase,
  disconnect: disconnectFromDatabase,
  getConnectionStatus: getConnectionStatus,
  isConnected: connectionState.isConnected
}; 