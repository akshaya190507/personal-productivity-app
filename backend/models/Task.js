const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true   // 🔥 improves query performance per user
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    description: {
      type: String,
      default: "",
      maxlength: 1000
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "done"],
      default: "pending",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
      default: null
    },

    mood: {
      type: String,
      enum: ["happy", "neutral", "sad", "stressed", "motivated"],
      default: "neutral"
    }

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
