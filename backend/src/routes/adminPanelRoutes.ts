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
router.get("/dashboard/feedbacks", getFeedbacks);
router.get("/dashboard/feedbacks/popularity", getStats);
router.get("/dashboard/feedbacks/ratings", getPopularFeedback);

export default router;
