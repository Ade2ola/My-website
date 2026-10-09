const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const rateLimit = require('express-rate-limit');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const publicRoutes = require('./routes/public.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

if (config.trustProxy) {
  app.set('trust proxy', 1);
}

// Security headers with Helmet (configured to allow inline fonts/scripts used by existing template)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS setup
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Express Session Configuration
const isProduction = config.env === 'production';
const PrismaSessionStore = require('./utils/prismaSessionStore');
const sessionStore = new PrismaSessionStore();

app.use(session({
  store: sessionStore,
  name: 'dessy_session_id',
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { success: false, message: 'Too many login attempts. Please try again later.' }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', env: config.env, timestamp: new Date() });
});

// Serve uploaded media files
app.use('/uploads', express.static(config.uploadDir));

// Serve static frontend files from project root
const publicDir = path.resolve(__dirname, '../../');
app.use(express.static(publicDir));

// API Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/site', apiLimiter, publicRoutes);
app.use('/api/v1/public', apiLimiter, publicRoutes);
app.use('/api/v1/admin', apiLimiter, adminRoutes);

// Fallback to index.html for SPA routing if not an API route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
