const express = require("express");
const router = express.Router();

const { getAppStats } = require("../controllers/statsController");
const authMiddleware = require("../middleware/authMiddleware"); // 🔐 add this

// Protect stats route
router.get("/", authMiddleware, getAppStats);

module.exports = router;
