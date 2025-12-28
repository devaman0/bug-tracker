import express from 'express';
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  deleteProject, 
  updateProject 
} from '../controllers/projectController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes
router.get('/', verifyToken, getProjects);
router.post('/', verifyToken, createProject);
router.get('/:id', verifyToken, getProjectById);
router.delete('/:id', verifyToken, deleteProject);
router.put('/:id', verifyToken, updateProject);

export default router;