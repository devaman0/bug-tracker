// Auth controller = register + login logic only

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Single token generator — keep it here
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User exists" });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // method name MUST match User.js
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

