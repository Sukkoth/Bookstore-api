import * as bookService from "../../services/owner/ownerBooksService.js";
import asyncHandler from "express-async-handler";
import ValidateBodyOnSchema from "../../utils/ValidateBodyOnSchema.js";
import UploadBookSchema from "../../zodSchemas/UploadBookSchema.js";
import parseId from "../../utils/parseId.js";
import { AppError } from "../../middleware/errorMiddleware.js";

/**
 * @description add books owners want to rent [books they own]
 * @route POST BASE_URL/owner/books
 */
const addBook = asyncHandler(async (req, res) => {
  if (req.user.ability.cannot("create", "OwnerToBooks")) {
    throw new AppError({
      statusCode: 403,
      message: "No enough permission to create rental books",
    });
  }

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
  const {
    bookNo,
    status,
    approved,
    price,
    bookName,
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
    owner,
    category,
    //pagination
    page,
    pageSize,
    sortField,
    sortOrder,
  };

  const { data, pagination } = await bookService.getUserBooks(
    { ...req.user, userType: req.userType },
    params
  );

  return res.json({
    code: 200,
    count: data.length,
    pagination,
    books: data,
  });
});

/**
 * @description delete book [rent book]
 * @route DELETE BASE_URL/owner/books
 */
const deleteUserBook = asyncHandler(async (req, res) => {
  const bookId = parseId(req.params.bookId, 403);

  const deletedBook = await bookService.deleteUserBook(bookId, req.user);
  return res.json({
    code: 200,
    message: "Book deleted successfully",
    book: deletedBook,
  });
});
export { addBook, getUserBooks, deleteUserBook };
