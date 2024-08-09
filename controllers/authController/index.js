import asyncHanlder from "express-async-handler";
import { ZodError } from "zod";
import * as authService from "../../services/authService.js";
import LoginSchema from "../../zodSchemas/LoginSchema.js";
import OwnerRegistrationSchema from "../../zodSchemas/OwnerRegistrationSchema.js";

const login = asyncHanlder(async (req, res) => {
  const validation = LoginSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ZodError(validation.error);
  }

  const { data } = validation;
  //construct login data in case successfull
  let loginData = {};

  if (data.userType === "admin") {
    const { admin, token } = await authService.loginAdmin(data);
    loginData = { admin, token };
  }

  if (data.userType === "owner") {
    const { owner, token } = await authService.loginOwner(data);
    loginData = { owner, token };
  }
  res.json({
    code: 200,
    message: "Logged in successfully",
    ...loginData,
  });
});

const register = asyncHanlder(async (req, res) => {
  const validation = OwnerRegistrationSchema.safeParse(req.body);
  if (!validation.success) {
    res.statusCode = 422;
    throw new ZodError(validation.error.issues);
  }

  const data = validation.data;

  //get token and registered owner
  const { owner, token } = await authService.registerOwner(data);

  return res.json({
    message: "User registered successfully",
    code: 200,
    owner,
    token,
  });
});

export { login, register };
