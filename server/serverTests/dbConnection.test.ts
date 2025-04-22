import mongoose from 'mongoose';
import dotenv from 'dotenv';
import database from '../src/config/database';
import '@jest/globals';

// Load environment variables
dotenv.config();

describe('MongoDB Connection', () => {
  beforeAll(async () => {
    // Connect to MongoDB before running tests
    await database.connect();
  });

  afterAll(async () => {
    // Disconnect from MongoDB after tests
    await database.disconnect();
    // Close all mongoose connections
    await mongoose.connection.close();
  });

  it('should connect to MongoDB successfully', async () => {
    // Access the isConnected property directly from the database instance
    expect(database.isConnected).toBe(true);
  });

  it('should have the correct connection string format', () => {
    const uri = process.env.MONGODB_URI;
    expect(uri).toBeDefined();
    expect(uri).toContain('mongodb+srv://');
    expect(uri).toContain('keepup.jxjcac8.mongodb.net');
  });
}); 