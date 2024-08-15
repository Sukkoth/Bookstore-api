import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import * as OwnersBooksController from "../controllers/owners/ownersBooksController.js";
import * as OwnersController from "../controllers/owners/ownersController.js";

const router = express.Router();

router.post("/books", protect, OwnersBooksController.addBook);
router.get("/books", protect, OwnersBooksController.getUserBooks);
router.get("/balance", protect, OwnersController.getBalance);
router.delete("/books/:bookId", protect, OwnersBooksController.deleteUserBook);

export default router;
