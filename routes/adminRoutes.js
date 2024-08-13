import express from "express";
import * as AdminBooksController from "../controllers/admin/adminBooksController.js";
import * as AdminsController from "../controllers/admin/adminsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/books", protect, AdminBooksController.getUserBooks);
router.get("/owners", protect, AdminsController.getOwners);

export default router;
