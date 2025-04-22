import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import database from './config/database';

// Import routes
import authRoutes from './routes/auth';
import postsRoutes from './routes/posts';
import usersRoutes from './routes/users';

// Load environment variables
dotenv.config();
console.log('Connecting to MongoDB (' + (process.env.NODE_ENV || 'development') + ' environment)...');
console.log('Using port:', process.env.PORT || 5001);

// Connect to MongoDB
database.connect()
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded bodies

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

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    database.disconnect()
      .then(() => {
        console.log('Database connection closed');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Error closing database connection:', err);
        process.exit(1);
      });
  });
});

export default app;
