import asyncHandler from "express-async-handler";
import prismaService from "../../services/prismaService.js";

const getBalance = asyncHandler(async (req, res) => {
  const ownerId = parseInt(req.user.id);

  const wallet =
    (await prismaService.wallets.findFirst({
      where: {
        ownerId: ownerId,
      },
    })) ||
    (await prismaService.wallets.create({
      data: {
        ownerId: ownerId,
        balance: 0.0,
      },
    }));

  const transactions = await prismaService.transaction.findMany({
    where: {
      rental: {
        book: {
          owner: {
            id: ownerId,
          },
        },
      },
    },
  });

  return res.json({
    wallet,
    transactions,
  });
});

export { getBalance };
