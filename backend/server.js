require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const habitRoutes = require("./routes/habitRoutes");
const pomodoroRoutes = require("./routes/pomodoroRoutes");
const statsRoutes = require("./routes/statsRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Serve Frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// API Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/pomodoro", pomodoroRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Error Middleware (MUST BE LAST)
app.use(errorHandler);

// Use env port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});