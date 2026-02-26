const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET   // 🔥 use .env
    );

    req.user = decoded;  // { id: userId }
    next();

  } catch (error) {
    res.status(401);
    next(error);   // 🔥 send to errorMiddleware
  }
};