const Habit = require("../models/Habit");

/* =========================
   CREATE HABIT
========================= */
exports.createHabit = async (req, res, next) => {
  try {
    const { name, frequency } = req.body;

    if (!name || !frequency) {
      res.status(400);
      throw new Error("Name and frequency are required");
    }

    const newHabit = new Habit({
      name,
      frequency,
      completedDates: [],
      user: req.user.id
    });

    const savedHabit = await newHabit.save();

    res.status(201).json(savedHabit);

  } catch (error) {
    next(error);
  }
};


/* =========================
   GET ALL HABITS (User-specific)
========================= */
exports.getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user.id });

    const habitsWithStats = habits.map(habit => {
      let currentStreak = 0;
      let longestStreak = 0;

      if (habit.frequency === "daily") {

        const completedDates = habit.completedDates
          .map(date => new Date(date).toDateString())
          .sort((a, b) => new Date(a) - new Date(b));

        let tempStreak = 0;
        let prevDate = null;

        completedDates.forEach(dateStr => {
          const currentDate = new Date(dateStr);

          if (!prevDate) {
            tempStreak = 1;
          } else {
            const diff =
              (currentDate - prevDate) / (1000 * 60 * 60 * 24);

            if (diff === 1) {
              tempStreak++;
            } else {
              tempStreak = 1;
            }
          }

          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }

          prevDate = currentDate;
        });

        // Calculate current streak from today backwards
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let checkDate = new Date(today);

        while (completedDates.includes(checkDate.toDateString())) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }

      return {
        ...habit.toObject(),
        currentStreak,
        longestStreak
      };
    });

    res.status(200).json(habitsWithStats);

  } catch (error) {
    next(error);
  }
};


/* =========================
   DELETE HABIT (User-protected)
========================= */
exports.deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!habit) {
      res.status(404);
      throw new Error("Habit not found");
    }

    res.status(200).json({ message: "Habit deleted successfully" });

  } catch (error) {
    next(error);
  }
};


/* =========================
   TOGGLE HABIT COMPLETION (User-protected)
========================= */
exports.toggleHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!habit) {
      res.status(404);
      throw new Error("Habit not found");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingIndex = habit.completedDates.findIndex(date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    if (existingIndex > -1) {
      habit.completedDates.splice(existingIndex, 1);
    } else {
      habit.completedDates.push(today);
    }

    await habit.save();

    res.status(200).json(habit);

  } catch (error) {
    next(error);
  }
};