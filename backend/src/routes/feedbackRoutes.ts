import { Router } from "express";
import { feedback } from "../controllers/feedbackController";

const router = Router();

// POST /api/feedback - Submit feedback
router.post("/", feedback);

export default router;
