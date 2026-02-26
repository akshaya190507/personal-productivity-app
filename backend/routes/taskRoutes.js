const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
  getWeeklyTasks,
} = require("../controllers/taskController");


const authMiddleware = require("../middleware/authMiddleware");

router.get("/stats", authMiddleware, getTaskStats);;//must come before :id
router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getAllTasks);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.get("/stats", authMiddleware, getTaskStats);
router.get("/weekly", authMiddleware, getWeeklyTasks);
router.get("/:id", getTaskById);

module.exports = router;