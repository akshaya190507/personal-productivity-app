const mongoose = require("mongoose");

const pomodoroSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },

  duration: {
    type: Number,   // minutes
    default: 25
  },

  completed: {
    type: Boolean,
    default: true
  },

  // 🔐 Link session to specific user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Pomodoro", pomodoroSchema);
