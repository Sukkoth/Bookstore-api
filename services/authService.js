import { z, ZodError } from "zod";
import { AppError } from "../middleware/errorMiddleware.js";
import prismaService from "./prismaService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @desc Login owner
 * @param {object} request (validated body)
 * @returns {object}  owner, token
 */
async function loginOwner(body) {
  //get owner by email
  const owner = await prismaService.owners.findFirst({
    where: {
      email: body.email,
    },
  });

  //check if owner exist and same password
  if (!owner || !(await bcrypt.compare(body.password, owner.password))) {
    throw new AppError({ message: "Invalid credentials", statusCode: 401 });
  }

  //remove password, generate token
  return {
    owner: { ...owner, password: undefined, id: owner.id.toString() },
    token: generateAuthToken(owner.id.toString()),
  };
}

/**
 * @desc Login admin
 * @param {object} request (validated body)
 * @returns {object}  admin, token
 */
async function loginAdmin(body) {
  //get admin by email
  const admin = await prismaService.admins.findFirst({
    where: {
      email: body.email,
    },
  });
  //check if owner exist and same password
  if (!admin || !(await bcrypt.compare(body.password, admin.password))) {
    throw new AppError({ message: "Invalid credentials", statusCode: 401 });
  }

  //remove password, generate token
  return {
    admin: { ...admin, password: undefined, id: admin.id.toString() },
    token: generateAuthToken(admin.id.toString()),
  };
}

/**
 * @desc Generate auth tokens for user
 * @param {string}  id
 * @returns {string} token
 */
const generateAuthToken = (id) => {
  const token = jwt.sign({ id }, process.env.APP_KEY, {
    expiresIn: "3d",
  });

  return token;
};

async function registerOwner(body) {
  const alreadyFound = await prismaService.owners.findFirst({
    where: {
      OR: [
        {
          email: body.email,
        },
        {
          phone: body.phone,
        },
      ],
    },
  });

  if (alreadyFound) {
    const zodError = new z.ZodError([]);
    if (alreadyFound.email === body.email) {
      zodError.addIssue({
        code: z.ZodIssueCode.invalid_arguments,
        path: ["email"],
        message: "Email address already in use",
      });
      throw new ZodError(zodError.issues);
    }
    if (alreadyFound.phone === body.phone) {
      zodError.addIssue({
        code: z.ZodIssueCode.invalid_arguments,
        path: ["phone"],
        message: "Phone number already in use",
      });
      throw new ZodError(zodError.issues);
    }
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const createdOwner = await prismaService.owners.create({
    data: {
      ...body,
      password: hashedPassword,
    },
  });

  const owner = {
    ...createdOwner,
    password: undefined,
    id: createdOwner.id.toString(),
  };

  return {
    owner,
    token: generateAuthToken(owner.id),
  };
}

export { loginOwner, loginAdmin, registerOwner };
