const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : 500;

  // Handle invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    err.message = "Invalid resource ID";
  }

  // Handle duplicate key error (unique fields)
  if (err.code === 11000) {
    statusCode = 400;
    err.message = "Duplicate field value entered";
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    err.message = Object.values(err.errors)
      .map(val => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

module.exports = errorHandler;