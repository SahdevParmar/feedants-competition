import express from "express";
import {
  loginController,
  signupController,
  logoutController,
  meController,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", loginController);
router.post("/signup", signupController);
router.post("/logout", logoutController);
router.get("/me", authMiddleware, meController);

export default router;
