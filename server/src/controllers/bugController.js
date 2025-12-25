// Bug CRUD — scoped to project + user
// Rules:
// - Project owner controls assignment
// - Owner or assignee can move status
// - Others are blocked early

const Bug = require("../models/Bug");
const Project = require("../models/Project");

// helpers
const isOwner = (project, userId) =>
  project.owner.toString() === userId.toString();

const isAssignee = (bug, userId) =>
  bug.assignedTo && bug.assignedTo.toString() === userId.toString();

/**
 * Create a bug under a project
 * Only project owner can create bugs
 */
exports.createBug = async (req, res) => {
  const { title, description, priority } = req.body;
  const { projectId } = req.params;

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

/**
 * Get all bugs for a project
 * Visibility is limited to project owner
 */
exports.getBugs = async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findOne({
    _id: projectId,
    owner: req.user._id,
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const bugs = await Bug.find({ project: projectId });
  res.json(bugs);
};

/**
 * Assign or reassign a bug
 * Only project owner can do this
 */
exports.assignBug = async (req, res) => {
  const { userId } = req.body;

  const bug = await Bug.findById(req.params.id).populate("project");
  if (!bug) return res.status(404).json({ message: "Bug not found" });

  if (!isOwner(bug.project, req.user._id)) {
    return res.status(403).json({ message: "Only owner can assign" });
  }

  bug.assignedTo = userId;

  bug.activity?.push({
    action: "Bug assigned",
    user: req.user._id,
  });

  const updated = await bug.save();
  res.json(updated);
};

/**
 * Update bug details
 * Status changes are restricted
 */
exports.updateBug = async (req, res) => {
  const bug = await Bug.findById(req.params.id).populate("project");
  if (!bug) return res.status(404).json({ message: "Bug not found" });

  const owner = isOwner(bug.project, req.user._id);
  const assignee = isAssignee(bug, req.user._id);

  if (req.body.status && !owner && !assignee) {
    return res.status(403).json({ message: "Not allowed to change status" });
  }

  if (req.body.status && req.body.status !== bug.status) {
    bug.activity?.push({
      action: `Status changed to ${req.body.status}`,
      user: req.user._id,
    });
  }

  bug.title = req.body.title ?? bug.title;
  bug.description = req.body.description ?? bug.description;
  bug.priority = req.body.priority ?? bug.priority;
  bug.status = req.body.status ?? bug.status;

  const updated = await bug.save();
  res.json(updated);
};

/**
 * Add comment to a bug
 * Allowed: project owner or assigned user
 */
exports.addComment = async (req, res) => {
  const bug = await Bug.findById(req.params.id).populate("project");
  if (!bug) return res.status(404).json({ message: "Bug not found" });

  const owner = isOwner(bug.project, req.user._id);
  const assignee = isAssignee(bug, req.user._id);

  if (!owner && !assignee) {
    return res.status(403).json({ message: "Not allowed to comment" });
  }

  bug.comments.push({
    text: req.body.text,
    author: req.user._id,
  });

  bug.activity?.push({
    action: "Comment added",
    user: req.user._id,
  });

  await bug.save();
  res.status(201).json(bug.comments);
};

/**
 * Get all comments for a bug
 * Read access follows same ownership rules
 */
exports.getComments = async (req, res) => {
  const bug = await Bug.findById(req.params.id)
    .populate("comments.author", "name email")
    .populate("project");

  if (!bug) return res.status(404).json({ message: "Bug not found" });

  const owner = isOwner(bug.project, req.user._id);
  const assignee = isAssignee(bug, req.user._id);

  if (!owner && !assignee) {
    return res.status(403).json({ message: "Not allowed to view comments" });
  }

  res.json(bug.comments);
};

/**
 * Delete bug
 * Owner-only destructive action
 */
exports.deleteBug = async (req, res) => {
  const bug = await Bug.findById(req.params.id).populate("project");

  if (!bug) {
    return res.status(404).json({ message: "Bug not found" });
  }

  if (!isOwner(bug.project, req.user._id)) {
    return res.status(403).json({ message: "Only owner can delete" });
  }

  await bug.deleteOne();
  res.json({ message: "Bug deleted" });
};
