import prismaService from "../prismaService.js";

export async function getOwners(params) {
  console.log({ params });
  const NumberOperators = ["equals", "gt", "gte", "lt", "lte", "not"];
  const filterArray = [];

  //filter by status
  if (!!params?.status) {
    filterArray.push({
      status: {
        equals: params.status,
      },
    });
  }

  //filter by location
  if (!!params.location) {
    filterArray.push({
      location: {
        contains: params?.location,
        mode: "insensitive",
      },
    });
  }

  //filter by name
  if (!!params?.name) {
    filterArray.push({
      OR: [
        {
          firstName: {
            contains: params?.name,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: params?.name,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  //Construct pagination

  const totalCount = await prismaService.owners.count({
    where: {
      AND: filterArray,
    },
  });
  const recordsPerPage = parseInt(params.pageSize) || 10;
  const totalPages = Math.ceil(totalCount / recordsPerPage);

  const page = params.page || 1;

  const owners = await prismaService.owners.findMany({
    where: {
      AND: filterArray,
    },
    omit: {
      password: true,
    },
    include: {
      _count: {
        select: {
          books: true,
        },
      },
    },
    orderBy:
      params.sortField === "uploads"
        ? {
            books: {
              _count: params.sortOrder,
            },
          }
        : params.sortField === "name"
        ? {
            firstName: params.sortOrder,
          }
        : {
            [params.sortField]: params.sortOrder,
          },
    skip: (page - 1) * recordsPerPage,
    take: recordsPerPage,
  });

  return {
    data: owners,
    pagination: {
      totalPages,
      pageSize: recordsPerPage,
      page: parseInt(page),
      totalCount,
    },
  };
}
