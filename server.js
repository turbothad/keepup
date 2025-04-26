const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 818;

// Improved CORS configuration
app.use(cors({
  origin: ['http://localhost:19000', 'http://localhost:19006', 'exp://localhost:19000', 'exp://192.168.*.*:19000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// ... existing code ... 