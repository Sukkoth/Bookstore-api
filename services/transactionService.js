import parseId from "../utils/parseId.js";
import prismaService from "./prismaService.js";

/**
 *
 * @param {number} userId
 * @param {number} ownerId
 * @param {number} amount
 * @param {number} rentalId
 */
export async function makeTransaction(userId, ownerId, amount, rentalId) {
  const transaction = await prismaService.$transaction([
    prismaService.transaction.create({
      data: {
        rentalId,
        userId,
        amount,
      },
    }),

    prismaService.wallets.upsert({
      where: {
        ownerId: parseId(ownerId),
      },
      create: {
        ownerId,
        balance: 0.0,
      },
      update: {
        balance: {
          increment: amount,
        },
      },
    }),
  ]);

  return transaction[0]; //leave out wallet information
}
