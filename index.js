import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import AuthRoutes from "./routes/authRoutes.js";
import BookRoutes from "./routes/bookRoutes.js";
import OwnerRoutes from "./routes/ownerRoutes.js";
import CategoriesRoutes from "./routes/categoriesRoutes.js";
import AdminsRoutes from "./routes/adminRoutes.js";
import UsersRoutes from "./routes/userRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

const APP_PORT = process.env.APP_PORT || 8000;
const API_VERSION = "/api/v1";

//init app
const app = express();
//init env
dotenv.config();

if (process.env.APP_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get(API_VERSION, (_, res) => {
  return res.json({
    message: "Welcome to book rental api",
    code: 200,
  });
});

app.use(`${API_VERSION}/auth`, AuthRoutes);
app.use(`${API_VERSION}/books`, BookRoutes);
app.use(`${API_VERSION}/owners`, OwnerRoutes);
app.use(`${API_VERSION}/categories`, CategoriesRoutes);
app.use(`${API_VERSION}/admins`, AdminsRoutes);
app.use(`${API_VERSION}/users`, UsersRoutes);
app.get(`${API_VERSION}/getUser`, protect, (req, res) => {
  return res.json({
    user: { ...req.user, permissions: undefined },
  });
});

app.use(notFound);
app.use(errorHandler);

app.listen(APP_PORT, () => {
  console.log(
    `Server is running on ${
      process.env.APP_ENV === "development"
        ? `http://localhost:${APP_PORT}`
        : `port ${APP_PORT}`
    }`
  );
});

export default app;
