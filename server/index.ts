import express from 'express';
import cors from 'cors';

// Create Express app
const app = express();
const PORT = 4000; // Changed port to avoid conflicts

// Apply middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Root route
app.get('/', (req, res) => {
  res.send('KeepUp API Server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 