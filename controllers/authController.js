import asyncHanlder from "express-async-handler";
import * as authService from "../services/authService.js";
import ValidateBodyOnSchema from "../utils/ValidateBodyOnSchema.js";
import LoginSchema from "../zodSchemas/LoginSchema.js";
import RegistrationSchema from "../zodSchemas/RegistrationSchema.js";

/**
 * @desc Login user based on userType
 * @param {object}  {email, password, userType}
 */
const login = asyncHanlder(async (req, res) => {
  const data = ValidateBodyOnSchema(req.body, LoginSchema);
  const { user, token } = await authService.login(data);

  res.json({
    code: 200,
    message: "Logged in successfully",
    user,
    token,
    userType: data.userType,
  });
});

/**
 * @description Register Owner
 * @param {object} request body
 */
const register = asyncHanlder(async (req, res) => {
  const data = ValidateBodyOnSchema(req.body, RegistrationSchema);

  //get {usr, token, userType} from the service
  const registeredData = await authService.register(data);
  return res.json({
    message: "User registered successfully",
    code: 200,
    ...registeredData,
  });
});

export { login, register };
