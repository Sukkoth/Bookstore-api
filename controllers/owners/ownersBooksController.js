import * as bookService from "../../services/owner/ownerBooksService.js";
import asyncHandler from "express-async-handler";
import ValidateBodyOnSchema from "../../utils/ValidateBodyOnSchema.js";
import UploadBookSchema from "../../zodSchemas/UploadBookSchema.js";
import UpdateOwnedBookSchema from "../../zodSchemas/UpdateOwnedBookSchema.js";
import { AppError } from "../../middleware/errorMiddleware.js";
import parseId from "../../utils/parseId.js";

/**
 * @description add books owners want to rent [books they own]
 * @route POST BASE_URL/owner/books
 */
const addBook = asyncHandler(async (req, res) => {
  const data = ValidateBodyOnSchema(req.body, UploadBookSchema);
  const book = await bookService.addBook(data, req.user);

  return res.json({
    code: 200,
    message: "Book added successfully",
    book,
  });
});

/**
 * @description get books of owners [to rent]
 * @route GET BASE_URL/owner/books
 */
const getUserBooks = asyncHandler(async (req, res) => {
  const books = await bookService.getUserBooks(req.user);

  return res.json({
    code: 200,
    books,
  });
});

/**
 * @description update book [rent book]
 * @route PUT BASE_URL/owner/books
 */
const updateUserBook = asyncHandler(async (req, res) => {
  const data = ValidateBodyOnSchema(req.body, UpdateOwnedBookSchema);
  const updatedBook = await bookService.updateUserBook(req.params.bookId, data);

  return res.json({
    code: 200,
    message: "Book updated successfully",
    book: updatedBook,
  });
});

/**
 * @description delete book [rent book]
 * @route DELETE BASE_URL/owner/books
 */
const deleteUserBook = asyncHandler(async (req, res) => {
  const bookId = parseId(req.params.bookId, 403);
  const deletedBook = await bookService.deleteUserBook(bookId);
  return res.json({
    code: 200,
    message: "Book deleted successfully",
    book: deletedBook,
  });
});
export { addBook, getUserBooks, updateUserBook, deleteUserBook };
