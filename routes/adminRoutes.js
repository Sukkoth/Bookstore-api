import express from "express";
import * as AdminBooksController from "../controllers/admin/adminBooksController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/books", protect, AdminBooksController.getUserBooks);

export default router;
