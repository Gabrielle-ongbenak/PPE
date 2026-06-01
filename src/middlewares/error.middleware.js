const errorMiddleware = (err, req, res, next) => {
  let message;
  let statusCode;

  message = err.message || "Server Error";
  statusCode = err.statusCode || 500;

  console.log(err);

  // Mongoose Bad ObjectID
  if (err.name === "CastError") {
    message = "Resource not found";
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = "Duplicate field value entered";
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  res.status(statusCode).json({ success: false, message });
};

export default errorMiddleware;
