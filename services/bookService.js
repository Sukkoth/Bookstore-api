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

async function getBooks(params) {
  const filterArray = [];
  if (!!params.name) {
    filterArray.push({ name: { contains: params.name, mode: "insensitive" } });
  }
  if (!!params.authorName) {
    filterArray.push({
      authorName: { contains: params.authorName, mode: "insensitive" },
    });
  }
  if (!!params.categoryId) {
    filterArray.push({
      categoryId: {
        equals: parseInt(params.categoryId),
      },
    });
  }

  const totalCount = await prismaService.books.count({
    where: filterArray.length
      ? {
          OR: filterArray,
        }
      : {},
  });
  const recordsPerPage = parseInt(params.pageSize) || 10;
  const totalPages = Math.ceil(totalCount / recordsPerPage);

  const page = params.page || 1;

  const books = await prismaService.books.findMany({
    where: filterArray.length
      ? {
          OR: filterArray,
        }
      : {},

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
    orderBy: {
      [params.sortField]: params.sortOrder,
    },
    skip: (page - 1) * recordsPerPage,
    take: recordsPerPage,
  });
  return {
    data: books,
    pagination: {
      totalPages,
      pageSize: recordsPerPage,
    },
  };
}

export { addBook, getBooks };
