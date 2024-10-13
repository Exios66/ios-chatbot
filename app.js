import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import csrf from 'csrf';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Add this after dotenv.config()
console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Import routes
import indexRouter from './js/routes/index.js';
import usersRouter from './js/routes/users.js';
import chatRouter from './js/routes/chat.js';
import modelRouter from './js/routes/model.js';
import completionsRouter from './js/routes/completions.js';
import weatherRouter from './js/routes/weather.js';
import authRouter from './js/routes/auth.js';

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
app.use(express.static(path.join(__dirname, 'public')));

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

// Use validateCsrfToken middleware for routes that need CSRF protection
app.post('/some-route', validateCsrfToken, (req, res) => {
  // Your route handler
});

// Security middleware
app.use(helmet());

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

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter);
app.use('/model', modelRouter);
app.use('/completions', completionsRouter);
app.use('/weather', weatherRouter);
app.use('/auth', authRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', apiLimiter);

app.get('/api/models', (req, res) => {
  // This is a mock response. In a real application, you'd fetch this data from your AI service.
  res.json({
    llama: ['Llama 7B', 'Llama 13B', 'Llama 30B'],
    openai: ['GPT-3.5 Turbo', 'GPT-4', 'Davinci'],
    openrouter: ['Openrouter Model A', 'Openrouter Model B', 'Openrouter Model C']
  });
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
