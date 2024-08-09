import { z } from "zod";

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  //set status code
  const statusCode = err?.statusCode
    ? err?.statusCode
    : res.statusCode === 200
    ? 500
    : res.statusCode;

  res.status(statusCode);
  // hanlde validation errors
  if (err instanceof z.ZodError) {
    return res.status(422).json({
      message: "validation failed",
      code: 422,
      errors: err.issues,
      stack: process.env.APP_ENV === "production" ? undefined : err.stack,
    });
  }
  // handle other error
  res.json({
    message: err.message,
    code: statusCode,
    stack: process.env.APP_ENV === "production" ? undefined : err.stack,
  });
};

//custom error handler
class AppError extends Error {
  constructor(
    { message, statusCode, additionalInfo } = {
      message: "Something went wrong",
      statusCode: 500,
    }
  ) {
    super(message);
    this.statusCode = statusCode || 500;
    this.message = message || null;
    this.additionalInfo = additionalInfo;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { notFound, errorHandler, AppError };
