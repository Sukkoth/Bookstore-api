import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import prismaService from "../services/prismaService.js";
import { createAbility } from "../utils/ability.js";
import { interpolate } from "../utils/interpolate.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const { userType, id } = jwt.verify(token, process.env.APP_KEY);

      // get table to fetch data from
      const table =
        userType === "admin"
          ? prismaService.admins
          : userType === "owner"
          ? prismaService.owners
          : prismaService.users;

      const user = await table.findFirst({
        where: { id: parseInt(id) },
        omit: {
          password: true,
        },
      });

      if (!user) {
        console.error("User not found using id in the token");
        throw new Error("User not found");
      }

      const permissions = await prismaService.permissions.findMany({
        where: {
          roleId: user.roleId,
        },
      });

      //attach user permissions;
      const parsedPermissions = createAbility(interpolate(permissions, user));

      console.log({ permissions: permissions });

      req.user = {
        ...user,
        permissions: parsedPermissions,
      };
      req.userType = userType;

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };
