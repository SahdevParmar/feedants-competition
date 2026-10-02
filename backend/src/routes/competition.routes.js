import express from "express";
import {
  competitionById,
  getCompetitions,
  registerForCompetition,
} from "../controllers/competition.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCompetitions);
router.get("/:id", competitionById);
router.post("/:id/register", authMiddleware, registerForCompetition);
export default router;
