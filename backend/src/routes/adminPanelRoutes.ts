import {
	getDashboard,
	getFeedbacks,
	getPopularFeedback,
	getStats,
} from "../controllers/adminPanelController";
import { authMiddleware } from "../middleware/authMiddleware";
import { Router } from "express";

const router = Router();

router.use(authMiddleware);

router.get("/dashboard", getDashboard);
router.get("/feedbacks", getFeedbacks);
router.get("/stats", getStats);
router.get("/popular", getPopularFeedback);

export default router;
