import express from 'express';
import { getBugs, createBug, updateBug, deleteBug } from '../controllers/bugController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Note: These paths are relative to where app.use mounts them.
// If app.use('/api', bugRoutes), then:
router.get('/projects/:projectId/bugs', verifyToken, getBugs);
router.post('/projects/:projectId/bugs', verifyToken, createBug);
router.put('/bugs/:id', verifyToken, updateBug);
router.delete('/bugs/:id', verifyToken, deleteBug);

export default router;