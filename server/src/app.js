import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import bugRoutes from './routes/bugRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (The Glue)
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', bugRoutes); // bugRoutes handles the /projects/:id/bugs part itself

export default app;