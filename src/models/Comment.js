const db = require('../database');

const Comment = {
  create: (content, bugId, createdBy, callback) => {
    db.run(
      'INSERT INTO comments (content, bug_id, created_by) VALUES (?, ?, ?)',
      [content, bugId, createdBy],
      callback
    );
  },

  getByBug: (bugId, callback) => {
    db.all(`
      SELECT c.*, u.username as author_name 
      FROM comments c 
      JOIN users u ON c.created_by = u.id 
      WHERE c.bug_id = ? 
      ORDER BY c.created_at ASC
    `, [bugId], callback);
  },

  delete: (id, callback) => {
    db.run('DELETE FROM comments WHERE id = ?', [id], callback);
  }
};

module.exports = Comment;
