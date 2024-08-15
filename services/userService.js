import { AppError } from "../middleware/errorMiddleware.js";
import prismaService from "../services/prismaService.js";
import parseId from "../utils/parseId.js";

export async function rentBook(userId, rentBookId, data) {
  const requestedQuantity = data?.quantity || 1;

  const bookStatus = await prismaService.ownerToBooks.findFirst({
    where: {
      id: parseId(rentBookId),
    },
  });

  if (!bookStatus)
    throw new AppError({
      message: "Requested book not found",
      statusCode: 404,
    });

  if (!bookStatus.approved) {
    throw new AppError({
      message: "You can't borrow unapproved book",
      statusCode: 400,
    });
  }

  console.log("Book exists", bookStatus);

  if (bookStatus.quantity - requestedQuantity <= -1) {
    console.error(
      "quantity does not match",
      bookStatus.quantity,
      requestedQuantity
    );
    throw new AppError({
      message: "Not enough books available",
      statusCode: 422,
    });
  }

  const rentBook = await prismaService.rentals.create({
    data: {
      ...data,
      dueDate: new Date(data.dueDate),
      userId,
      rentBookId: parseId(rentBookId),
    },
  });

  //decrease quantity,
  await prismaService.ownerToBooks.update({
    where: {
      id: parseId(rentBookId),
    },
    data: {
      quantity: {
        decrement: parseId(requestedQuantity),
      },
      status: bookStatus.quantity - requestedQuantity === 0 ? "rented" : "free",
    },
  });

  return { rentBook, ownerId: bookStatus.ownerId, price: bookStatus.price };
}
