// Central Express app-setup

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");

const app = express();

// allow frontend requests
app.use(cors());

// parse JSON bodies
app.use(express.json());

// auth routes (register / login)
app.use("/api/auth", authRoutes);

// protected test route (verifies JWT works)
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user, // user attached by middleware
  });
});

// health check
app.get("/", (req, res) => {
  res.send("Bug Tracker API running");
});

module.exports = app;
