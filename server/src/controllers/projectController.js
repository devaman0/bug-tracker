// Project logic — CRUD, nothing else

const Project = require("../models/Project");

// Create new project
exports.createProject = async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    owner: req.user._id, // current logged-in user
  });

  res.status(201).json(project);
};

// Get all projects of logged-in user
exports.getProjects = async (req, res) => {
  const projects = await Project.find({ owner: req.user._id });
  res.json(projects);
};

// Get single project (owner only)
exports.getProjectById = async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(project);
};

// Update project
exports.updateProject = async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;

  const updated = await project.save();
  res.json(updated);
};

// Delete project
exports.deleteProject = async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  await project.deleteOne();
  res.json({ message: "Project deleted" });
};
