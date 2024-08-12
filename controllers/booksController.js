import * as bookService from "../services/bookService.js";
import asyncHandler from "express-async-handler";
import ValidateBodyOnSchema from "../utils/ValidateBodyOnSchema.js";
import AddBookSchema from "../zodSchemas/AddBookSchema.js";

/**
 * @desc add books to books table (beofre you upload a book you want to rent)
 * @param {object}  {name, authorName, categoryId}
 * @route POST BASE_URL/books
 */
const addBook = asyncHandler(async (req, res) => {
  const data = ValidateBodyOnSchema(req.body, AddBookSchema);
  const book = await bookService.addBook(data);

  return res.json({
    code: 200,
    message: "Book added successfully",
    book,
  });
});

/**
 * @desc get list of books
 * @route GET BASE_URL/books
 */
const getBooks = asyncHandler(async (req, res) => {
  const {
    authorName,
    categoryId,
    name,
    page = 1,
    pageSize = 10,
    sortField = "name",
    sortOrder = "asc",
  } = req.query;

  const params = {
    authorName,
    categoryId,
    name,
    page,
    pageSize,
    sortField,
    sortOrder,
  };

  // Call the getBooks function with the query parameters
  const { data, pagination } = await bookService.getBooks(params);
  return res.json({
    code: 200,
    count: data.length,
    pagination,
    books: data,
  });
});

export { addBook, getBooks };
