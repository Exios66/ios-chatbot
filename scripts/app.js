import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import csrf from 'csrf';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Add this after dotenv.config()
console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS || 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');

// Import routes
import indexRouter from '../js/routes/index.js';
import usersRouter from '../js/routes/users.js';
import chatRouter from '../js/routes/chat.js';
import modelRouter from '../js/routes/model.js';
import generateRouter from '../js/routes/generate.js';
import authRouter from '../js/routes/auth.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up session middleware
app.use(session({
  secret: 'your-secret-key',  // Replace with a real secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === "production" }  // Use secure cookies in production
}));

// Create a new instance of CSRF protection
const csrfProtection = new csrf();

// Generate a CSRF token
app.use((req, res, next) => {
  if (!req.session.csrfSecret) {
    req.session.csrfSecret = csrfProtection.secretSync();
  }
  res.locals.csrfToken = csrfProtection.create(req.session.csrfSecret);
  next();
});

// Middleware to validate CSRF token
const validateCsrfToken = (req, res, next) => {
  if (!csrfProtection.verify(req.session.csrfSecret, req.body._csrf)) {
    return res.status(403).send('Invalid CSRF token');
  }
  next();
};

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'cdn.socket.io'],
      styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com', 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'cdnjs.cloudflare.com', 'fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", 'ws:', 'wss:', 'http:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Add this check before the CORS middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000']; // Provide a default value

console.log('Allowed origins:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Serve static files from the dist, js, and fonts directories
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/fonts', express.static(path.join(__dirname, '../fonts')));

// Add a middleware to set the correct MIME type for JavaScript files
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.type('application/javascript');
  }
  next();
});

// API Routes
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/chat', chatRouter);
app.use('/api/models', modelRouter);
app.use('/api/generate', generateRouter);
app.use('/api/auth', authRouter);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', apiLimiter);

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;

function startServer(port) {
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  }).on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying with port ${port+1}`);
      startServer(port+1);
    } else {
      console.error(e);
    }
  });
}

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
    process.exit(0);
  });
});

startServer(port);

export default app;
