const Pomodoro = require("../models/Pomodoro");

/* =========================
   SAVE SESSION (User-specific)
========================= */
exports.saveSession = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const session = new Pomodoro({
      duration: 25,
      completed: true,
      user: req.user.id,
      date: new Date()
    });

    const saved = await session.save();

    res.status(201).json(saved);

  } catch (error) {
    next(error);
  }
};


/* =========================
   GET TODAY'S SESSIONS (User-specific)
========================= */
exports.getTodaySessions = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const userId = req.user.id;

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const sessions = await Pomodoro.find({
      user: userId,
      date: { $gte: start, $lte: end }
    }).sort({ createdAt: -1 });

    res.status(200).json(sessions);

  } catch (error) {
    next(error);
  }
};