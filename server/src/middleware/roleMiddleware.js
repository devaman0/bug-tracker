// Check if user is Admin
const adminOnly = (req, res, next) => {
  // 'req.user' comes from the authMiddleware we run before this
  if (req.user && req.user.role === 'admin') {
    next(); // Valid admin, proceed
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { adminOnly };