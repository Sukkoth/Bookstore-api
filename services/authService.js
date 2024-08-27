import { z, ZodError } from "zod";
import { AppError } from "../middleware/errorMiddleware.js";
import prismaService from "./prismaService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @desc Login user
 * @param {object} request (validated body)
 * @returns {object}  user, token
 */
async function login(body) {
  // get table to fetch data from
  const table =
    body.userType === "admin"
      ? prismaService.admins
      : body.userType === "owner"
      ? prismaService.owners
      : prismaService.users;

  //get user by email
  const user = await table.findFirst({
    where: {
      email: {
        equals: body.email,
        mode: "insensitive",
      },
    },
  });

  //check if user exist and same password
  if (!user || !(await bcrypt.compare(body.password, user.password))) {
    throw new AppError({ message: "Invalid credentials", statusCode: 401 });
  }

  //remove password, generate token
  return {
    user: { ...user, password: undefined, id: user.id.toString() },
    token: generateAuthToken(user.id.toString(), body.userType),
  };
}

/**
 * @desc register owner based on userType
 * @param {object} request (validated body)
 * @returns {object}  owner, token
 */
async function register(body) {
  // get table to fetch data from

  const table =
    body.userType === "admin"
      ? prismaService.admins
      : body.userType === "owner"
      ? prismaService.owners
      : prismaService.users;

  const alreadyFound = await table.findFirst({
    where: {
      OR: [
        {
          email: {
            equals: body.email,
            mode: "insensitive",
          },
        },
        { phone: body.phone },
      ],
    },
  });

  // check for unqiue values
  if (!!alreadyFound) {
    throwParseValidationError(alreadyFound, body.email, body.phone);
    return;
  }

  //get user by email
  let userRole;

  userRole = await prismaService.roles.findFirst({
    where: {
      name: body.userType,
    },
  });

  if (!userRole) {
    console.error("Roles table is empty, probably empty in the table");
    throw new AppError({
      message: "Something went wrong",
      statusCode: 500,
    });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);
  const dataToInsert = {
    ...body,
    password: hashedPassword,
    confirmPassword: undefined, //remove this field
    userType: undefined,
    roleId: userRole.id,
  };

  const createUser = await table.create({
    data: dataToInsert,
  });

  if (!createUser) {
    throw new AppError({
      message: "Could not create user",
      statusCode: 500,
    });
  }

  const user = {
    ...createUser,
    password: undefined,
    id: createUser.id.toString(),
  };

  return {
    user,
    token: generateAuthToken(user.id, body.userType),
    userType: body.userType,
  };
}

/**
 * @desc Generate auth tokens for user
 * @param {string}  id
 * @returns {string} token
 */
const generateAuthToken = (id, userType) => {
  const token = jwt.sign({ id, userType }, process.env.APP_KEY, {
    expiresIn: "3d",
  });

  return token;
};

/**
 * @description check for email | phone found and throw validation error
 * @param {object} foundUser
 * @param {string} email
 * @param {string} phone
 */
function throwParseValidationError(foundUser, email, phone) {
  const zodError = new z.ZodError([]);
  if (foundUser.email.trim().toLowerCase() === email.trim().toLowerCase()) {
    zodError.addIssue({
      code: z.ZodIssueCode.invalid_arguments,
      path: ["email"],
      message: "Email address already in use",
    });
    throw new ZodError(zodError.issues);
  }
  if (foundUser.phone.trim() === phone.trim()) {
    zodError.addIssue({
      code: z.ZodIssueCode.invalid_arguments,
      path: ["phone"],
      message: "Phone number already in use",
    });
    throw new ZodError(zodError.issues);
  }

  throw new Error("Unknown Error Occured");
}

export { login, register };
