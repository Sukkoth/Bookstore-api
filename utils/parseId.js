import { AppError } from "../middleware/errorMiddleware.js";

/**
 * @description parse Id from request body or params, use code to throw error
 * @param {string} str
 * @param {number} code
 * @returns {number} id
 */
function parseId(str = "", code = 422) {
  const parsedId = parseInt(str);
  if (isNaN(parsedId)) {
    throw new AppError({
      message: `Please Provide a valid ID - ${str}`,
      statusCode: code,
    });
  }
  return parseInt(str);
}

export default parseId;
