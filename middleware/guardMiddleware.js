import asyncHandler from "express-async-handler";
import { AppError } from "./errorMiddleware.js";

const PermissionGaurd = (action, subject) => {
  if (!action || !subject)
    return new AppError({
      message: "Provide action and subject form PermissionGuard",
      statusCode: 500,
    });

  return asyncHandler(async (req, res, next) => {
    if (req.user.permissions.cannot(action, subject)) {
      throw new AppError({
        message: "Accoss not allowed",
        statusCode: 403,
      });
    }
    next();
  });
};

export default PermissionGaurd;
