const db = require('../database');

const Bug = {
  create: (title, description, projectId, status, priority, createdBy, assignedTo, callback) => {
    db.run(
      'INSERT INTO bugs (title, description, project_id, status, priority, created_by, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, projectId, status, priority, createdBy, assignedTo],
      callback
    );
  },

  getByProject: (projectId, callback) => {
    db.all(`
      SELECT b.*, 
        creator.username as creator_name,
        assignee.username as assignee_name
      FROM bugs b
      JOIN users creator ON b.created_by = creator.id
      LEFT JOIN users assignee ON b.assigned_to = assignee.id
      WHERE b.project_id = ?
      ORDER BY b.created_at DESC
    `, [projectId], callback);
  },

  findById: (id, callback) => {
    db.get(`
      SELECT b.*, 
        creator.username as creator_name,
        assignee.username as assignee_name,
        p.name as project_name
      FROM bugs b
      JOIN users creator ON b.created_by = creator.id
      LEFT JOIN users assignee ON b.assigned_to = assignee.id
      JOIN projects p ON b.project_id = p.id
      WHERE b.id = ?
    `, [id], callback);
  },

  update: (id, title, description, status, priority, assignedTo, callback) => {
    db.run(
      'UPDATE bugs SET title = ?, description = ?, status = ?, priority = ?, assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, description, status, priority, assignedTo, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM bugs WHERE id = ?', [id], callback);
  },

  getAll: (callback) => {
    db.all(`
      SELECT b.*, 
        creator.username as creator_name,
        assignee.username as assignee_name,
        p.name as project_name
      FROM bugs b
      JOIN users creator ON b.created_by = creator.id
      LEFT JOIN users assignee ON b.assigned_to = assignee.id
      JOIN projects p ON b.project_id = p.id
      ORDER BY b.created_at DESC
    `, callback);
  }
};

module.exports = Bug;
