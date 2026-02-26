const express = require("express");
const router = express.Router();

const {
  saveSession,
  getTodaySessions
} = require("../controllers/pomodoroController");

const authMiddleware = require("../middleware/authMiddleware"); // ✅ add this

// 🔐 Protect routes
router.post("/", authMiddleware, saveSession);
router.get("/today", authMiddleware, getTodaySessions);

module.exports = router;