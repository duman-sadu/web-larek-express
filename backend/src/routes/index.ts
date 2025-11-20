import { Router } from "express";

import productRoutes from "./product";
import orderRoutes from "./order";
import authRoutes from "./auth";
import uploadRoutes from "./upload";

import { notFoundHandler } from "../middlewares/not-found-handler";

const router = Router();

router.use("/product", productRoutes);
router.use("/order", orderRoutes);
router.use("/auth", authRoutes);
router.use("/upload", uploadRoutes);

router.use(notFoundHandler);

export default router;