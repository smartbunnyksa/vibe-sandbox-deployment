const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const WebSocket = require('ws');
const dotenv = require('dotenv');
const fs = require('fs');
const morgan = require('morgan');
const dns = require('dns');
const helmet = require('helmet');

// Import security configurations
const { 
  rateLimiters, 
  helmetConfig, 
  corsConfig, 
  sanitizeInput, 
  securityLogger 
} = require('./config/security');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Configure DNS servers if provided
if (process.env.DNS_SERVER_1 && process.env.DNS_SERVER_2) {
  dns.setServers([process.env.DNS_SERVER_1, process.env.DNS_SERVER_2]);
}

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet(helmetConfig));

// Security logging
app.use(securityLogger);

// Input sanitization
app.use(sanitizeInput);

// CORS configuration
app.use(cors(corsConfig));

// Body parsing middleware with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Additional validation can be added here
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', rateLimiters.general);
app.use('/api/auth/login', rateLimiters.auth);
app.use('/api/auth/register', rateLimiters.register);

// Create a write stream for logging
const accessLogStream = fs.createWriteStream('backend/server.log', { flags: 'a' });

// Setup logger with custom format
const logFormat = process.env.NODE_ENV === 'production' 
  ? 'combined' 
  : 'dev';

app.use(morgan(logFormat, { 
  stream: accessLogStream,
  skip: (req, res) => res.statusCode < 400 // Only log errors in production
}));

// Console logging for development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Starting server without MongoDB connection...');
  }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/branches', require('./routes/branch'));
app.use('/api/sessions', require('./routes/training'));
app.use('/api/stats', require('./routes/stats'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Health check available at: http://localhost:3001/api/health');
    if (process.env.DNS_SERVER_1 && process.env.DNS_SERVER_2) {
      console.log(`DNS servers configured: ${process.env.DNS_SERVER_1}, ${process.env.DNS_SERVER_2}`);
    }
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
