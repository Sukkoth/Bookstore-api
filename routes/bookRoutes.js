import express from "express";
import * as bookController from "../controllers/booksController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, bookController.addBook);
router.get("/", protect, bookController.getBooks);

export default router;
