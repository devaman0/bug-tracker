// Bug routes — protected by JWT

const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createBug,
  getBugs,
  updateBug,
  deleteBug,
  assignBug,
} = require("../controllers/bugController");

const router = express.Router();

// Create + list bugs under a project
// /api/projects/:projectId/bugs
router
  .route("/projects/:projectId/bugs")
  .post(protect, createBug)
  .get(protect, getBugs);

// Update / delete a bug
// /api/bugs/:id
router
  .route("/bugs/:id")
  .put(protect, updateBug)
  .delete(protect, deleteBug);

// Assign / reassign bug (project owner only)
// /api/bugs/:id/assign
router.put("/bugs/:id/assign", protect, assignBug);

module.exports = router;
