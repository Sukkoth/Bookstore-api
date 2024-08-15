import express from "express";
import * as UserController from "../controllers/usersController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/books/rent/:rentBookId", protect, UserController.rentBook);

export default router;
