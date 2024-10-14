"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _http = _interopRequireDefault(require("http"));
var _socket = require("socket.io");
var _path = _interopRequireDefault(require("path"));
var _url = require("url");
var _dotenv = _interopRequireDefault(require("dotenv"));
var _morgan = _interopRequireDefault(require("morgan"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _expressSession = _interopRequireDefault(require("express-session"));
var _csrf = _interopRequireDefault(require("csrf"));
var _expressRateLimit = _interopRequireDefault(require("express-rate-limit"));
var _cors = _interopRequireDefault(require("cors"));
var _helmet = _interopRequireDefault(require("helmet"));
var _index = _interopRequireDefault(require("../js/routes/index.js"));
var _users = _interopRequireDefault(require("../js/routes/users.js"));
var _chat = _interopRequireDefault(require("../js/routes/chat.js"));
var _model = _interopRequireDefault(require("../js/routes/model.js"));
var _completions = _interopRequireDefault(require("../js/routes/completions.js"));
var _weather = _interopRequireDefault(require("../js/routes/weather.js"));
var _auth = _interopRequireDefault(require("../js/routes/auth.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var _filename = (0, _url.fileURLToPath)(import.meta.url);
var _dirname = _path["default"].dirname(_filename);

// Load environment variables from .env file
_dotenv["default"].config({
  path: _path["default"].join(_dirname, '..', '.env')
});

// Add this after dotenv.config()
console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS || 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');

// Import routes

var app = (0, _express["default"])();
var server = _http["default"].createServer(app);
var io = new _socket.Server(server);

// View engine setup
app.set('views', _path["default"].join(_dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use((0, _cookieParser["default"])());
app.use(_express["default"]["static"](_path["default"].join(_dirname, 'public')));

// Set up session middleware
app.use((0, _expressSession["default"])({
  secret: 'your-secret-key',
  // Replace with a real secret key
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production"
  } // Use secure cookies in production
}));

// Create a new instance of CSRF protection
var csrfProtection = new _csrf["default"]();

// Generate a CSRF token
app.use(function (req, res, next) {
  if (!req.session.csrfSecret) {
    req.session.csrfSecret = csrfProtection.secretSync();
  }
  res.locals.csrfToken = csrfProtection.create(req.session.csrfSecret);
  next();
});

// Middleware to validate CSRF token
var validateCsrfToken = function validateCsrfToken(req, res, next) {
  if (!csrfProtection.verify(req.session.csrfSecret, req.body._csrf)) {
    return res.status(403).send('Invalid CSRF token');
  }
  next();
};

// Use validateCsrfToken middleware for routes that need CSRF protection
app.post('/some-route', validateCsrfToken, function (req, res) {
  // Your route handler
});

// Security middleware
app.use((0, _helmet["default"])());

// Add this check before the CORS middleware
var allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(function (origin) {
  return origin.trim();
}) : ['http://localhost:3000']; // Provide a default value

console.log('Allowed origins:', allowedOrigins);
app.use((0, _cors["default"])({
  origin: function origin(_origin, callback) {
    if (!_origin) return callback(null, true);
    if (allowedOrigins.indexOf(_origin) === -1) {
      var msg = 'The CORS policy for this site does not ' + 'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Routes
app.use('/', _index["default"]);
app.use('/users', _users["default"]);
app.use('/chat', _chat["default"]);
app.use('/model', _model["default"]);
app.use('/completions', _completions["default"]);
app.use('/weather', _weather["default"]);
app.use('/auth', _auth["default"]);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});
var apiLimiter = (0, _expressRateLimit["default"])({
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);
app.get('/api/models', function (req, res) {
  // This is a mock response. In a real application, you'd fetch this data from your AI service.
  res.json({
    llama: ['Llama 7B', 'Llama 13B', 'Llama 30B'],
    openai: ['GPT-3.5 Turbo', 'GPT-4', 'Davinci'],
    openrouter: ['Openrouter Model A', 'Openrouter Model B', 'Openrouter Model C']
  });
});
if (process.env.NODE_ENV === 'production') {
  app.use(_express["default"]["static"](_path["default"].join(_dirname, '../dist')));
} else {
  app.use(_express["default"]["static"](_dirname));
  app.use('/styles', _express["default"]["static"](_path["default"].join(_dirname, 'styles')));
  app.use('/scripts', _express["default"]["static"](_path["default"].join(_dirname, 'scripts')));
  app.use('/js', _express["default"]["static"](_path["default"].join(_dirname, 'js')));
}
var port = process.env.PORT || 3000;
function startServer(port) {
  server.listen(port, function () {
    console.log("Server running at http://localhost:".concat(port));
  }).on('error', function (e) {
    if (e.code === 'EADDRINUSE') {
      console.log("Port ".concat(port, " is busy, trying with port ").concat(port + 1));
      startServer(port + 1);
    } else {
      console.error(e);
    }
  });
}
process.on('SIGTERM', function () {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(function () {
    console.log('Http server closed.');
    process.exit(0);
  });
});
startServer(port);
var _default = exports["default"] = app;