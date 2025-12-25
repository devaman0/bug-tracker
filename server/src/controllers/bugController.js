// Bug CRUD — scoped to project + user

const Bug = require("../models/Bug");
const Project = require("../models/Project");

// small helpers to keep logic readable
const isOwner = (project, userId) =>
  project.owner.toString() === userId.toString();

const isAssignee = (bug, userId) =>
  bug.assignedTo && bug.assignedTo.toString() === userId.toString();

// Assign bug to a user (only project owner)
exports.assignBug = async (req, res) => {
  const { userId } = req.body;

  const bug = await Bug.findById(req.params.id).populate("project");
  if (!bug) return res.status(404).json({ message: "Bug not found" });

  if (!isOwner(bug.project, req.user._id)) {
    return res.status(403).json({ message: "Only owner can assign" });
  }

  bug.assignedTo = userId;
  const updated = await bug.save();

  res.json(updated);
};

// Create bug under a project
exports.createBug = async (req, res) => {
  const { title, description, priority } = req.body;
  const { projectId } = req.params;

  // ensure project belongs to user
  const project = await Project.findOne({
    _id: projectId,
    owner: req.user._id,
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const bug = await Bug.create({
    title,
    description,
    priority,
    project: projectId,
    createdBy: req.user._id,
  });

  res.status(201).json(bug);
};

// Get all bugs for a project
exports.getBugs = async (req, res) => {
  const { projectId } = req.params;

  const bugs = await Bug.find({ project: projectId });
  res.json(bugs);
};

// Update bug details / status
exports.updateBug = async (req, res) => {
  const bug = await Bug.findById(req.params.id).populate("project");
  if (!bug) return res.status(404).json({ message: "Bug not found" });

  const owner = isOwner(bug.project, req.user._id);
  const assignee = isAssignee(bug, req.user._id);

  // status change rules
  if (req.body.status && !owner && !assignee) {
    return res.status(403).json({ message: "Not allowed to change status" });
  }

  bug.title = req.body.title || bug.title;
  bug.description = req.body.description || bug.description;
  bug.priority = req.body.priority || bug.priority;
  bug.status = req.body.status || bug.status;

  const updated = await bug.save();
  res.json(updated);
};

// Delete bug
exports.deleteBug = async (req, res) => {
  const bug = await Bug.findById(req.params.id);

  if (!bug) {
    return res.status(404).json({ message: "Bug not found" });
  }

  await bug.deleteOne();
  res.json({ message: "Bug deleted" });
};
