const express = require('express');
const Bug = require('../models/Bug');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Project = require('../models/Project');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Create bug page
router.get('/new/:projectId', isAuthenticated, (req, res) => {
  const projectId = req.params.projectId;

  Project.findById(projectId, (err, project) => {
    if (err || !project) {
      return res.status(404).send('Project not found');
    }

    User.getAll((err, users) => {
      if (err) {
        return res.status(500).send('Error fetching users');
      }
      res.render('bug-form', { 
        bug: null, 
        project, 
        users, 
        user: req.session, 
        error: null 
      });
    });
  });
});

// Create bug
router.post('/new/:projectId', isAuthenticated, (req, res) => {
  const { title, description, status, priority, assigned_to } = req.body;
  const projectId = req.params.projectId;

  if (!title) {
    Project.findById(projectId, (err, project) => {
      User.getAll((err, users) => {
        return res.render('bug-form', { 
          bug: null, 
          project, 
          users, 
          user: req.session, 
          error: 'Bug title is required' 
        });
      });
    });
    return;
  }

  const assignedTo = assigned_to === '' ? null : assigned_to;

  Bug.create(
    title,
    description,
    projectId,
    status || 'Open',
    priority || 'Medium',
    req.session.userId,
    assignedTo,
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error creating bug');
      }
      res.redirect(`/projects/${projectId}`);
    }
  );
});

// View bug details
router.get('/:id', isAuthenticated, (req, res) => {
  const bugId = req.params.id;

  Bug.findById(bugId, (err, bug) => {
    if (err || !bug) {
      return res.status(404).send('Bug not found');
    }

    Comment.getByBug(bugId, (err, comments) => {
      if (err) {
        return res.status(500).send('Error fetching comments');
      }
      res.render('bug-detail', { bug, comments, user: req.session });
    });
  });
});

// Edit bug page
router.get('/:id/edit', isAuthenticated, (req, res) => {
  const bugId = req.params.id;

  Bug.findById(bugId, (err, bug) => {
    if (err || !bug) {
      return res.status(404).send('Bug not found');
    }

    Project.findById(bug.project_id, (err, project) => {
      if (err || !project) {
        return res.status(404).send('Project not found');
      }

      User.getAll((err, users) => {
        if (err) {
          return res.status(500).send('Error fetching users');
        }
        res.render('bug-form', { bug, project, users, user: req.session, error: null });
      });
    });
  });
});

// Update bug
router.post('/:id/edit', isAuthenticated, (req, res) => {
  const { title, description, status, priority, assigned_to } = req.body;
  const bugId = req.params.id;

  if (!title) {
    Bug.findById(bugId, (err, bug) => {
      Project.findById(bug.project_id, (err, project) => {
        User.getAll((err, users) => {
          return res.render('bug-form', { 
            bug, 
            project, 
            users, 
            user: req.session, 
            error: 'Bug title is required' 
          });
        });
      });
    });
    return;
  }

  const assignedTo = assigned_to === '' ? null : assigned_to;

  Bug.update(bugId, title, description, status, priority, assignedTo, (err) => {
    if (err) {
      return res.status(500).send('Error updating bug');
    }
    res.redirect(`/bugs/${bugId}`);
  });
});

// Delete bug
router.post('/:id/delete', isAuthenticated, (req, res) => {
  Bug.findById(req.params.id, (err, bug) => {
    if (err || !bug) {
      return res.status(404).send('Bug not found');
    }

    const projectId = bug.project_id;

    Bug.delete(req.params.id, (err) => {
      if (err) {
        return res.status(500).send('Error deleting bug');
      }
      res.redirect(`/projects/${projectId}`);
    });
  });
});

// Add comment to bug
router.post('/:id/comments', isAuthenticated, (req, res) => {
  const { content } = req.body;
  const bugId = req.params.id;

  if (!content) {
    return res.redirect(`/bugs/${bugId}`);
  }

  Comment.create(content, bugId, req.session.userId, (err) => {
    if (err) {
      return res.status(500).send('Error adding comment');
    }
    res.redirect(`/bugs/${bugId}`);
  });
});

module.exports = router;
