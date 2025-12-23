const db = require('../database');

const User = {
  create: (username, hashedPassword, role, callback) => {
    db.run(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role],
      callback
    );
  },

  findByUsername: (username, callback) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], callback);
  },

  findById: (id, callback) => {
    db.get('SELECT id, username, role, created_at FROM users WHERE id = ?', [id], callback);
  },

  getAll: (callback) => {
    db.all('SELECT id, username, role, created_at FROM users', callback);
  }
};

module.exports = User;
