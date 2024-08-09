import express from "express";
const router = express.Router();

import * as authRoutes from "../controllers/authController.js";

/** @route  GET BASE_URL/auth/login */
router.post("/login", authRoutes.login);

/** @route  GET BASE_URL/auth/register */
router.post("/register", authRoutes.register);

export default router;
