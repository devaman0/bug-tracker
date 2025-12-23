const express = require('express');
const Project = require('../models/Project');
const Bug = require('../models/Bug');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const router = express.Router();

// List all projects
router.get('/', isAuthenticated, (req, res) => {
  Project.getAll((err, projects) => {
    if (err) {
      return res.status(500).send('Error fetching projects');
    }
    res.render('projects', { projects, user: req.session });
  });
});

// Create project page (Admin only)
router.get('/new', isAdmin, (req, res) => {
  res.render('project-form', { project: null, user: req.session, error: null });
});

// Create project (Admin only)
router.post('/', isAdmin, (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.render('project-form', { project: null, user: req.session, error: 'Project name is required' });
  }

  Project.create(name, description, req.session.userId, (err) => {
    if (err) {
      return res.render('project-form', { project: null, user: req.session, error: 'Error creating project' });
    }
    res.redirect('/projects');
  });
});

// View project details
router.get('/:id', isAuthenticated, (req, res) => {
  const projectId = req.params.id;

  Project.findById(projectId, (err, project) => {
    if (err || !project) {
      return res.status(404).send('Project not found');
    }

    Bug.getByProject(projectId, (err, bugs) => {
      if (err) {
        return res.status(500).send('Error fetching bugs');
      }
      res.render('project-detail', { project, bugs, user: req.session });
    });
  });
});

// Edit project page (Admin only)
router.get('/:id/edit', isAdmin, (req, res) => {
  Project.findById(req.params.id, (err, project) => {
    if (err || !project) {
      return res.status(404).send('Project not found');
    }
    res.render('project-form', { project, user: req.session, error: null });
  });
});

// Update project (Admin only)
router.post('/:id/edit', isAdmin, (req, res) => {
  const { name, description } = req.body;
  const projectId = req.params.id;

  if (!name) {
    Project.findById(projectId, (err, project) => {
      return res.render('project-form', { project, user: req.session, error: 'Project name is required' });
    });
    return;
  }

  Project.update(projectId, name, description, (err) => {
    if (err) {
      return res.status(500).send('Error updating project');
    }
    res.redirect(`/projects/${projectId}`);
  });
});

// Delete project (Admin only)
router.post('/:id/delete', isAdmin, (req, res) => {
  Project.delete(req.params.id, (err) => {
    if (err) {
      return res.status(500).send('Error deleting project');
    }
    res.redirect('/projects');
  });
});

module.exports = router;
