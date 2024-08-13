import prismaService from "./prismaService.js";

/**
 * @description get count of books based on categories, if admin, return all, else return based on userID
 * @param {string} userType
 * @param {number} userId
 * @returns category and it's count
 */
async function countBooks(userType, userId) {
  let collector = {}; //stores categories
  let addedIdsToCollector = []; //track which categories are already in collector
  let dataFromDb; //get data from database

  dataFromDb = await prismaService.ownerToBooks.findMany({
    where:
      userType === "owner"
        ? {
            ownerId: userId,
            approved: {
              equals: true,
            },
          }
        : {}, //if admin, no need to filter
    select: {
      quantity: true,
      bookInfo: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  //transform data to more readable form
  dataFromDb.forEach((item) => {
    if (!addedIdsToCollector.includes(item.bookInfo.category.id)) {
      collector[item.bookInfo.category.id] = {
        category: item.bookInfo.category,
        quantity: item.quantity,
      };
      addedIdsToCollector.push(item.bookInfo.category.id);
    } else {
      collector[item.bookInfo.category.id].quantity =
        collector[item.bookInfo.category.id].quantity + item.quantity;
    }
  });

  return Object.values(collector);
}

async function getCategories() {
  const categories = await prismaService.categories.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return categories;
}

export { countBooks, getCategories };
