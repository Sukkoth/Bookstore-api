import * as bookService from "../../services/admin/adminBooksService.js";
import asyncHandler from "express-async-handler";
/**
 * @description get books of owners [to rent]
 * @route GET BASE_URL/admins/books
 */
const getUserBooks = asyncHandler(async (req, res) => {
  const {
    bookNo,
    status,
    price,
    bookName,
    owner,
    //pagination
    page = 1,
    pageSize = 10,
    sortField = "id",
    sortOrder = "asc",
  } = req.query;

  const params = {
    bookNo,
    status,
    price,
    bookName,
    owner,
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

export { getUserBooks };
