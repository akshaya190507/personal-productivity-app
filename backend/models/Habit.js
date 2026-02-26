const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  frequency: {
    type: String,
    enum: ["daily", "weekly"],
    default: "daily",
  },

  completedDates: [
    {
      type: Date,
    }
  ],

  // 🔐 Link habit to a specific user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }

}, { timestamps: true });

module.exports = mongoose.model("Habit", habitSchema);
