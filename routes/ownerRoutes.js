import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import * as OwnersBooksController from "../controllers/owners/ownersBooksController.js";

const router = express.Router();

router.post("/books", protect, OwnersBooksController.addBook);
router.get("/books", protect, OwnersBooksController.getUserBooks);
router.put("/books/:bookId", protect, OwnersBooksController.updateUserBook);
router.delete("/books/:bookId", protect, OwnersBooksController.deleteUserBook);

export default router;
