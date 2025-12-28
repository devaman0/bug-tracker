import Project from '../models/Project.js';

// 1. Get All Projects (With Alias Fix)
export const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user && req.user.role === 'admin') {
      projects = await Project.find().sort({ createdAt: -1 });
    } else {
      const userId = req.user?.id || req.user?._id || req.userId;
      projects = await Project.find({ createdBy: userId }).sort({ createdAt: -1 });
    }

    // MAGIC FIX: Map 'createdBy' to 'owner' so your Frontend shows the buttons
    const projectsForFrontend = projects.map(p => ({
      ...p.toObject(),
      owner: p.createdBy // This makes the delete button reappear!
    }));

    res.status(200).json(projectsForFrontend);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

// 2. Get Single Project (With Alias Fix)
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const userId = req.user?.id || req.user?._id || req.userId;
    const isAdmin = req.user?.role === 'admin';

    // Security check
    if (!isAdmin && project.createdBy.toString() !== userId) {
       return res.status(403).json({ message: "Access denied" });
    }

    // MAGIC FIX: Add 'owner' alias here too
    const projectData = {
      ...project.toObject(),
      owner: project.createdBy
    };

    res.status(200).json(projectData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error: error.message });
  }
};

// 3. Create Project
export const createProject = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.userId;
    const newProject = new Project({
      name: req.body.name,
      description: req.body.description,
      createdBy: userId
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Project name already exists." });
    }
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};

// 4. Delete Project
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};

// 5. Update Project
export const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error: error.message });
  }
};