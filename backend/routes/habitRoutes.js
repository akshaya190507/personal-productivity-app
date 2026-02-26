const express = require("express");
const router = express.Router();
const habitController = require("../controllers/habitController");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ add this

// 🔐 Protect all habit routes
router.post("/", authMiddleware, habitController.createHabit);
router.get("/", authMiddleware, habitController.getHabits);
router.delete("/:id", authMiddleware, habitController.deleteHabit);
router.put("/:id/toggle", authMiddleware, habitController.toggleHabit);

module.exports = router;
