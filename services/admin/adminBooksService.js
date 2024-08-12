import prismaService from "../prismaService.js";

/**
 * @description get list of books user owns [available to rent]
 * @returns {object}  list of user books [rental books, not system books]
 */
async function getUserBooks(params) {
  const NumberOperators = ["equals", "gt", "gte", "lt", "lte", "not"];
  const filterArray = [];
  if (!!params.status) {
    filterArray.push({
      status: {
        equals: params.status,
      },
    });
  }
  //fitler by price
  if (!!params.price) {
    const operator = {};
    Object.keys(params.price).forEach((key) => {
      if (NumberOperators.includes(key))
        operator[key] = parseFloat(params.price[key]);
    });
    filterArray.push({ price: operator });
  }

  //filter by book ID (since this is as book number on frontend)
  if (!!params.bookNo) {
    const operator = {};
    Object.keys(params.bookNo).forEach((key) => {
      if (NumberOperators.includes(key))
        operator[key] = parseFloat(params.bookNo[key]);
    });
    filterArray.push({ bookId: operator });
  }

  //filter by book name
  if (!!params.bookName) {
    filterArray.push({
      bookInfo: { name: { contains: params.bookName, mode: "insensitive" } },
    });
  }

  //filter by ownare name
  if (!!params.owner) {
    filterArray.push({
      owner: {
        OR: [
          {
            firstName: {
              contains: params.owner,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: params.owner,
              mode: "insensitive",
            },
          },
        ],
      },
    });
  }

  //Construct pagination

  const totalCount = await prismaService.ownerToBooks.count({
    where: {
      AND: filterArray,
    },
  });
  const recordsPerPage = parseInt(params.pageSize) || 10;
  const totalPages = Math.ceil(totalCount / recordsPerPage);

  const page = params.page || 1;

  const userBooks = await prismaService.ownerToBooks.findMany({
    where: {
      AND: filterArray,
    },

    orderBy:
      params?.sortField === "owner"
        ? {
            owner: {
              firstName: params.sortOrder,
            },
          }
        : params?.sortField === "bookName"
        ? {
            bookInfo: {
              name: params.sortOrder,
            },
          }
        : params?.sortField === "bookNo"
        ? {
            bookInfo: {
              id: params.sortOrder,
            },
          }
        : {
            [params.sortField]: params.sortOrder,
          },
    include: {
      bookInfo: true,
      owner: true,
    },
    skip: (page - 1) * recordsPerPage,
    take: recordsPerPage,
  });

  return {
    data: userBooks,
    pagination: {
      totalPages,
      pageSize: recordsPerPage,
      page: parseInt(page),
      totalCount,
    },
  };
}

export { getUserBooks };
