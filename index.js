import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import AuthRoutes from "./routes/authRoutes.js";

const APP_PORT = process.env.APP_PORT || 8000;
const API_VERSION = "/api/v1";

//init app
const app = express();
//init env
dotenv.config();

if (process.env.APP_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get(API_VERSION, (_, res) => {
  return res.json({
    message: "Welcome to book rental api",
    code: 200,
  });
});

app.use(`${API_VERSION}/auth`, AuthRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
});
