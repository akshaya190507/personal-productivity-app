const Task = require("../models/Task");

/* =========================
   CREATE TASK
========================= */
exports.createTask = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const { title, description, mood, status, dueDate } = req.body;

    if (!title) {
      res.status(400);
      throw new Error("Title is required");
    }

    const newTask = new Task({
      title,
      description,
      mood,
      status: status || "pending",
      dueDate,
      user: req.user.id
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);

  } catch (error) {
    next(error);
  }
};


/* =========================
   GET ALL TASKS
========================= */
exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);

  } catch (error) {
    next(error);
  }
};


/* =========================
   GET SINGLE TASK
========================= */
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.status(200).json(task);

  } catch (error) {
    next(error);
  }
};


/* =========================
   UPDATE TASK
========================= */
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

/* =========================
   DELETE TASK
========================= */
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.status(200).json({ message: "Task deleted successfully" });

  } catch (error) {
    next(error);
  }
};


/* =========================
   DASHBOARD STATS
========================= */
exports.getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [pendingCount, inProgressCount, doneCount] = await Promise.all([
      Task.countDocuments({ user: userId, status: "pending" }),
      Task.countDocuments({ user: userId, status: "in-progress" }),
      Task.countDocuments({ user: userId, status: "done" })
    ]);

    res.status(200).json({
      pending: pendingCount,
      inProgress: inProgressCount,
      done: doneCount,
    });

  } catch (error) {
    next(error);
  }
};


/* =========================
   GET WEEKLY TASKS
========================= */
exports.getWeeklyTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date();

    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyTasks = await Task.find({
      user: userId,
      dueDate: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
    }).sort({ dueDate: 1 });

    res.status(200).json(weeklyTasks);

  } catch (error) {
    next(error);
  }
};