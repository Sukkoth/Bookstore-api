import { AppError } from "../../middleware/errorMiddleware.js";
import prismaService from "../prismaService.js";

/**
 * @desc add books user owns [available to rent]
 * @param {object} request (validated body)
 * @returns {object}  book
 */
async function addBook(body, user) {
  const bookId = parseInt(body.bookId, 10);
  const book = await prismaService.books.findFirst({
    where: {
      id: bookId,
    },
  });
  if (!book) {
    throw new AppError({
      message: `Book with id of ${body.bookId} is not found`,
      statusCode: 422,
    });
  }

  const dataToAdd = {
    ...body,
    bookId,
    price: parseFloat(body.price),
    quantity: parseInt(body.quantity),
    ownerId: user.id,
  };

  const userBook = await prismaService.ownerToBooks.create({
    data: dataToAdd,
  });

  if (!userBook) {
    throw new AppError({
      message: "Book could not be created",
      statusCode: 500,
    });
  }

  return userBook;
}

/**
 * @description get list of books user owns [available to rent]
 * @returns {object}  list of user books [rental books, not system books]
 */
async function getUserBooks(user) {
  const userBooks = await prismaService.ownerToBooks.findMany({
    where: {
      ownerId: parseInt(user.id),
    },
    include: {
      bookInfo: true,
    },
  });

  return userBooks;
}

/**
 * @description update user book [rent book, not the actual book]
 * @returns {object}  updated book
 */
async function updateUserBook(bookId, data) {
  let dataToUpdate = {
    ...data,
    bookId: parseInt(bookId),
    price: data.price ? parseFloat(data.price) : undefined,
    quantity: data.quantity ? parseInt(data.quantity) : undefined,
  };

  console.log({ dataToUpdate });

  const userBook = await prismaService.ownerToBooks.update({
    where: {
      id: parseInt(bookId),
    },
    data: dataToUpdate,
  });

  return userBook;
}

/**
 * @description delete user book [rent book, not the actual book]
 * @returns {object}  deleted book
 */
async function deleteUserBook(bookId) {
  const deletedBook = await prismaService.ownerToBooks.delete({
    where: {
      id: bookId,
    },
  });

  return deletedBook;
}
export { addBook, getUserBooks, updateUserBook, deleteUserBook };
