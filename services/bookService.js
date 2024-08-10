import { AppError } from "../middleware/errorMiddleware.js";
import prismaService from "./prismaService.js";

/**
 * @desc add books to the system [later you will use this to upload books you own]
 * @param {object} request (validated body)
 * @returns {object}  user, token
 */
async function addBook(body) {
  const categoryId = parseInt(body.categoryId, 10);
  const category = await prismaService.categories.findFirst({
    where: {
      id: categoryId,
    },
  });
  if (!category) {
    throw new AppError({
      message: `Category with id of ${body.categoryId} is not found`,
      statusCode: 422,
    });
  }

  const book = await prismaService.books.create({
    data: { ...body, categoryId },
  });

  if (!book) {
    throw new AppError({
      message: "Book could not be created",
      statusCode: 500,
    });
  }

  return book;
}

async function getBooks() {
  const books = await prismaService.books.findMany({
    select: {
      authorName: true,
      id: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      name: true,
      info: true,
    },
  });
  return books;
}

export { addBook, getBooks };
