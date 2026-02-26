const Task = require("../models/Task");
const Habit = require("../models/Habit");
const Pomodoro = require("../models/Pomodoro");

exports.getAppStats = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const userId = req.user.id;

    // 🔥 Run all DB queries in parallel (better performance)
    const [
      totalTasks,
      completedTasks,
      totalPomodoros,
      totalHabits
    ] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: "done" }),
      Pomodoro.countDocuments({ user: userId }),
      Habit.countDocuments({ user: userId })
    ]);

    const taskCompletionRate =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    const totalFocusMinutes = totalPomodoros * 25;

    res.status(200).json({
      totalTasks,
      completedTasks,
      taskCompletionRate,
      totalPomodoros,
      totalFocusMinutes,
      totalHabits
    });

  } catch (error) {
    next(error);
  }
};