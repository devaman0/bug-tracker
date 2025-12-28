import Bug from '../models/Bug.js';

// 1. Get Bugs (With Fix)
export const getBugs = async (req, res) => {
  try {
    const bugs = await Bug.find({ project: req.params.projectId }).sort({ createdAt: -1 });
    
    // MAGIC FIX: Map 'createdBy' to 'owner' so Frontend permissions work
    const formattedBugs = bugs.map(bug => ({
      ...bug.toObject(),
      owner: bug.createdBy
    }));

    res.status(200).json(formattedBugs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bugs", error: error.message });
  }
};

// 2. Create Bug (With Fix)
export const createBug = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.userId;
    
    const newBug = new Bug({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority || 'medium',
      status: 'open',
      project: req.params.projectId,
      createdBy: userId
    });

    const savedBug = await newBug.save();

    // MAGIC FIX: Send back 'owner' alias immediately
    res.status(201).json({
      ...savedBug.toObject(),
      owner: savedBug.createdBy
    });

  } catch (error) {
    console.error("CREATE BUG ERROR:", error);
    res.status(500).json({ message: "Error creating bug", error: error.message });
  }
};

// 3. Update Bug (With Fix)
export const updateBug = async (req, res) => {
  try {
    const updatedBug = await Bug.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // MAGIC FIX: Ensure the updated bug still has 'owner'
    res.status(200).json({
      ...updatedBug.toObject(),
      owner: updatedBug.createdBy
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating bug" });
  }
};

// 4. Delete Bug
export const deleteBug = async (req, res) => {
  try {
    await Bug.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Bug deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bug" });
  }
};