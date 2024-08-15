import asyncHandler from "express-async-handler";
import ValidateBodyOnSchema from "../utils/ValidateBodyOnSchema.js";
import RentBookSchema from "../zodSchemas/RentBookSchema.js";
import * as userService from "../services/userService.js";
import * as transactionService from "../services/transactionService.js";
import calculateRentalPrice from "../utils/calculateRentalPrice.js";

const rentBook = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const rentBookId = req.params.rentBookId;

  const data = ValidateBodyOnSchema(req.body, RentBookSchema);

  const {
    rentBook,
    ownerId,
    price: bookPrice,
  } = await userService.rentBook(userId, rentBookId, data);

  const priceForGivenDate = calculateRentalPrice(rentBook.dueDate, bookPrice);

  const pricePerQuantity = priceForGivenDate * (data.quantity || 1);

  const transaction = await transactionService.makeTransaction(
    userId,
    ownerId,
    pricePerQuantity,
    rentBook.id
  );

  return res.json({
    code: 200,
    message: "Book rented successfully",
    rentBook,
    transaction,
  });
});

export { rentBook };
