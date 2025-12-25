// JWT guard: blocks requests without valid token

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // token missing
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // extract token
    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user (without password)
    req.user = await User.findById(decoded.id).select("-password");

    next(); // move to controller
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protect;
