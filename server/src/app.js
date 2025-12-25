// Express app config

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// auth routes
app.use("/api/auth", authRoutes);

// health check
app.get("/", (req, res) => {
  res.send("Bug Tracker API running");
});

module.exports = app;
