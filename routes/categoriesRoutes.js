import * as categoriesController from "../controllers/categoriesController.js";

import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", categoriesController.getCategories);
router.get("/countBooks", protect, categoriesController.countBooks);

export default router;
