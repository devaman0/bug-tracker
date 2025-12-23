const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize database
require('./database');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'bug-tracker-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const bugRoutes = require('./routes/bugs');

app.use('/', authRoutes);
app.use('/projects', projectRoutes);
app.use('/bugs', bugRoutes);

// Home route
app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    res.redirect('/projects');
  } else {
    res.redirect('/login');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Bug Tracker running on http://localhost:${PORT}`);
});

module.exports = app;
