import asyncHandler from "express-async-handler";
import * as categoryService from "../services/categoryService.js";

const countBooks = asyncHandler(async (req, res) => {
  const {
    userType,
    user: { id },
  } = req;

  const count = await categoryService.countBooks(userType, id);

  return res.json({
    code: 200,
    count,
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories();
  return res.json({
    code: 200,
    categories,
  });
});

export { countBooks, getCategories };
