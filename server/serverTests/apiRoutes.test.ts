import request from 'supertest';
import express from 'express';
import database from '../src/config/database';
import '@jest/globals';

// Import routes and middleware but create a fresh app instance
import authRoutes from '../src/routes/auth';
import postsRoutes from '../src/routes/posts';
import usersRoutes from '../src/routes/users';

describe('API Routes', () => {
  // Create a test app for testing to avoid port conflicts
  const app = express();
  
  beforeAll(async () => {
    // Connect to MongoDB before running tests
    await database.connect();
    
    // Set up the test app with the routes we want to test
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      const dbStatus = database.getConnectionStatus();
      res.json({
        status: 'ok',
        timestamp: new Date(),
        database: {
          connected: dbStatus.isConnected
        }
      });
    });
    
    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/posts', postsRoutes);
    app.use('/api/users', usersRoutes);
  });

  afterAll(async () => {
    // Disconnect from MongoDB after tests
    await database.disconnect();
  });

  describe('Health Check', () => {
    it('should return 200 on health check endpoint', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('database');
    });
  });

  describe('Authentication', () => {
    it('should have auth routes accessible', async () => {
      const response = await request(app).get('/api/auth');
      // Even if it returns 404, it should not be a 500 error
      expect(response.status).not.toBe(500);
    });
  });

  describe('Posts', () => {
    it('should have posts routes accessible', async () => {
      const response = await request(app).get('/api/posts');
      // Even if it requires auth, it should not be a 500 error
      expect(response.status).not.toBe(500);
    });
  });
}); 