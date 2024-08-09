import express from "express";
const router = express.Router();

import * as authRoutes from "../controllers/authController/index.js";

router.post("/login", authRoutes.login);
router.post("/register", authRoutes.register);

export default router;
