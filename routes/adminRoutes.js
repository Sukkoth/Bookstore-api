import express from "express";
import * as AdminBooksController from "../controllers/admin/adminBooksController.js";
import * as AdminsController from "../controllers/admin/adminsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/books", protect, AdminBooksController.getUserBooks);
router.put("/books/:bookId", protect, AdminBooksController.updateUserBook);
router.get("/owners", protect, AdminsController.getOwners);
router.put("/owners/:ownerId", protect, AdminsController.approveOwner);
router.delete("/owners/:ownerId", protect, AdminsController.deleteOwner);

export default router;
