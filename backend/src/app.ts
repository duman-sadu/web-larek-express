import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errors } from "celebrate";
import path from "path";

import { PORT, DB_ADDRESS, ORIGIN_ALLOW } from "./config";

import { requestLogger, errorLogger } from "./middlewares/logger";

import errorHandler from "./middlewares/error-handler";

import router from "./routes";

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ORIGIN_ALLOW,
    credentials: true,
  })
);

app.use(requestLogger);

app.use(router);

app.use(errors());

app.use(errorLogger);

app.use(errorHandler);

mongoose
  .connect(DB_ADDRESS)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

export default app;