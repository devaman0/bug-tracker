const db = require('../database');

const Project = {
  create: (name, description, createdBy, callback) => {
    db.run(
      'INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)',
      [name, description, createdBy],
      callback
    );
  },

  getAll: (callback) => {
    db.all(`
      SELECT p.*, u.username as creator_name 
      FROM projects p 
      JOIN users u ON p.created_by = u.id 
      ORDER BY p.created_at DESC
    `, callback);
  },

  findById: (id, callback) => {
    db.get(`
      SELECT p.*, u.username as creator_name 
      FROM projects p 
      JOIN users u ON p.created_by = u.id 
      WHERE p.id = ?
    `, [id], callback);
  },

  update: (id, name, description, callback) => {
    db.run(
      'UPDATE projects SET name = ?, description = ? WHERE id = ?',
      [name, description, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM projects WHERE id = ?', [id], callback);
  }
};

module.exports = Project;
