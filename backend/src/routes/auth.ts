import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  refreshAccessToken,
  logout,
} from "../controllers/auth";
import auth from "../middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/token", refreshAccessToken);
router.get("/user", auth, getCurrentUser);
router.post("/logout", auth, logout);

export default router;