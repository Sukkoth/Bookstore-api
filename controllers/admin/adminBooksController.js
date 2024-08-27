import * as bookService from "../../services/admin/adminBooksService.js";
import asyncHandler from "express-async-handler";
import UpdateOwnedBookSchema from "../../zodSchemas/UpdateOwnedBookSchema.js";
import ValidateBodyOnSchema from "../../utils/ValidateBodyOnSchema.js";
import { AppError } from "../../middleware/errorMiddleware.js";
/**
 * @description get books of owners [to rent]
 * @route GET BASE_URL/admins/books
 */
const getUserBooks = asyncHandler(async (req, res) => {
  if (req.user.permissions.cannot("read", "OwnerToBooks")) {
    throw new AppError({
      statusCode: 403,
      message: "No enough permission to read this resource",
    });
  }
  const {
    bookNo,
    status,
    approved,
    price,
    bookName,
    author,
    owner,
    category,
    //pagination
    page = 1,
    pageSize = 10,
    sortField = "id",
    sortOrder = "asc",
  } = req.query;

  const params = {
    bookNo,
    status,
    approved,
    price,
    bookName,
    author,
    owner,
    category,
    //pagination
    page,
    pageSize,
    sortField,
    sortOrder,
  };

  const { data, pagination } = await bookService.getUserBooks(params);

  return res.json({
    code: 200,
    count: data.length,
    pagination,
    books: data,
  });
});

/**
 * @description update book [rent book]
 * @route PUT BASE_URL/admin/books
 */
const updateUserBook = asyncHandler(async (req, res) => {
  if (req.user.permissions.cannot("manage", "OwnerToBooks")) {
    throw new AppError({
      statusCode: 403,
      message: "You are not allowed to perform this action",
    });
  }
  const data = ValidateBodyOnSchema(req.body, UpdateOwnedBookSchema);
  const updatedBook = await bookService.updateUserBook(req.params.bookId, data);

  return res.json({
    code: 200,
    message: "Book updated successfully",
    book: updatedBook,
  });
});

export { getUserBooks, updateUserBook };
