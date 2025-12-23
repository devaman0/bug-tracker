const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Login handler
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, user) => {
    if (err || !user) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.render('login', { error: 'Invalid username or password' });
      }

      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;
      res.redirect('/');
    });
  });
});

// Register page
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// Register handler
router.post('/register', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.render('register', { error: 'Username and password are required' });
  }

  const userRole = role === 'Admin' ? 'Admin' : 'User';

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.render('register', { error: 'Error creating account' });
    }

    User.create(username, hashedPassword, userRole, (err) => {
      if (err) {
        return res.render('register', { error: 'Username already exists' });
      }
      res.redirect('/login');
    });
  });
});

// Logout handler
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
