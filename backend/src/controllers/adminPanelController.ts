import {
	FeedbackFilters,
	getAllFeedback,
	getFeedbackByPopularity,
	getFeedbackStats,
} from "../services/feedbackService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Request, Response } from "express";

export const getFeedbacks = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<any> => {
	try {
		const filters: FeedbackFilters = {
			minRating: req.query.minRating
				? Number(req.query.minRating)
				: undefined,
			maxRating: req.query.maxRating
				? Number(req.query.maxRating)
				: undefined,
			productId: req.query.productId as string,

			minPopularity: req.query.minPopularity
				? Number(req.query.minPopularity)
				: undefined,
			sortBy: req.query.sortBy as "createdAt" | "rating" | "popularity",
			sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
			page: req.query.page ? Number(req.query.page) : 1,
			limit: req.query.limit ? Number(req.query.limit) : 10,
		};

		const result = await getAllFeedback(filters);

		if (result.success) {
			return res.status(200).json({
				success: true,
				message: result.message,
				data: result.data,
				adminInfo: {
					adminId: req.admin?.id,
					adminName: req.admin?.email,
				},
			});
		} else {
			return res.status(400).json({
				success: false,
				message: result.message,
			});
		}
	} catch (error) {
		console.error("Get feedbacks error:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve feedbacks",
		});
	}
};

// view feedback statistics

export const getStats = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<any> => {
	try {
		const productId = req.query.productId as string;
		const result = await getFeedbackStats(productId);

		if (result.success) {
			return res.status(200).json({
				success: true,
				message: result.message,
				data: result.data,
				adminInfo: {
					adminId: req.admin?.id,
					adminEmail: req.admin?.email,
				},
			});
		}
	} catch (error) {
		console.error("Get feedback stats error:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve feedback stats",
		});
	}
};

export const getPopularFeedback = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<any> => {
	try {
		const limit = req.query.limit ? Number(req.query.limit) : 10;
		const minPopularity = req.query.minPopularity
			? Number(req.query.minPopularity)
			: 0;

		const result = await getFeedbackByPopularity(limit);

		if (result.success) {
			let feedbacks = result.data?.feedbacks || [];
			if (req.query.minPopularity) {
				feedbacks = feedbacks.filter(
					(feedback: any) => feedback.popularity >= minPopularity
				);
			}
			return res.status(200).json({
				success: true,
				message: "Popular feedback entries fetched successfully",
				data: {
					feedbacks,
					pagination: {
						current: 1,
						total: Math.ceil(feedbacks.length / limit),
						count: feedbacks.length,
						limit,
					},
				},
				adminInfo: {
					adminId: req.admin?.id,
					adminEmail: req.admin?.email,
				},
			});
		} else {
			return res.status(400).json({
				success: false,
				message: result.message,
			});
		}
	} catch (error) {
		console.error("Get popular feedback error:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve popular feedback entries",
		});
	}
};

export const getDashboard = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<any> => {
	try {
		const statsResult = await getFeedbackStats();

		const popularResult = await getFeedbackByPopularity(10);

		const recentResult = await getAllFeedback({
			sortBy: "createdAt",
			sortOrder: "desc",
			limit: 10,
		});

		if (
			statsResult.success &&
			popularResult.success &&
			recentResult.success
		) {
			return res.status(200).json({
				success: true,
				message: "Dashboard data retrieved successfully",
				data: {
					stats: statsResult.data,
					popularFeedbacks: popularResult.data?.feedbacks || [],
					recentFeedbacks: recentResult.data?.feedbacks || [],
				},
				adminInfo: {
					adminId: req.admin?.id,
					adminEmail: req.admin?.email,
					lastLogin: new Date().toISOString(),
				},
			});
		} else {
			return res.status(400).json({
				success: false,
				message: "Failed to retrieve dashboard data",
			});
		}
	} catch (error) {
		console.error("Get dashboard error:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve dashboard data",
		});
	}
};
