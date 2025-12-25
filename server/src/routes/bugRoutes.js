// Bug routes — protected by JWT
// Routes only define URLs + middleware
// All logic lives in the controller

const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createBug,
  getBugs,
  updateBug,
  deleteBug,
  assignBug,
  addComment,
  getComments,
} = require("../controllers/bugController");

const router = express.Router();

/**
 * Bugs under a project
 * URL: /api/projects/:projectId/bugs
 * Access: project owner
 */
router
  .route("/projects/:projectId/bugs")
  .post(protect, createBug)
  .get(protect, getBugs);

/**
 * Single bug operations
 * URL: /api/bugs/:id
 * Access:
 * - update: owner or assignee
 * - delete: owner only
 */
router
  .route("/bugs/:id")
  .put(protect, updateBug)
  .delete(protect, deleteBug);

/**
 * Assign / reassign a bug
 * URL: /api/bugs/:id/assign
 * Access: project owner only
 */
router.put("/bugs/:id/assign", protect, assignBug);

/**
 * Bug comments
 * URL: /api/bugs/:id/comments
 * Access: project owner or assignee
 */
router
  .route("/bugs/:id/comments")
  .post(protect, addComment)
  .get(protect, getComments);

module.exports = router;
