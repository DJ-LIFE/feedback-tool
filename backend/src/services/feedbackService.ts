import { Feedback, PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export interface CreateFeedbackData {
	name?: string;
	email?: string;
	feedback: string;
	rating: number;
	productId?: string;
}

export interface FeedbackResponse {
	success: boolean;
	message: string;
	feedback?: any;
	data?: any;
}

export interface FeedbackStats {
	totalFeedbacks: number;
	averageRating: number;
	ratingDistribution?: { [key: number]: number };
	timelineData?: { [date: string]: { count: number; avgRating: number } };
	popularFeedbacksCount?: number;
}

export interface FeedbackFilters {
	minRating?: number;
	maxRating?: number;
	productId?: string;
	minPopularity?: number; // Add popularity filter
	sortBy?: "createdAt" | "rating" | "popularity" | "avgRating";
	sortOrder?: "asc" | "desc";
	page?: number;
	limit?: number;
}

interface FeedbackWithPopularity extends Feedback {
	popularityScore?: number;
	productAvgRating?: number;
}

export const calculatePopularity = (feedback: any): number => {
	const ratingWeight = feedback.rating * 0.6;
	const recentWeight =
		new Date().getTime() - new Date(feedback.createdAt).getTime();
	const daysSinceCreation = recentWeight / (1000 * 60 * 60 * 24);
	const recencyScore = Math.max(0, (30 - daysSinceCreation) / 30) * 0.4;

	return Number((ratingWeight + recencyScore).toFixed(2));
};

// Get product average rating
const getProductAvgRating = async (productId: string): Promise<number> => {
	const result = await prisma.feedback.aggregate({
		where: { productId },
		_avg: { rating: true },
	});
	return Number(result._avg.rating?.toFixed(2)) || 0;
};

export const submitFeedback = async (
	data: CreateFeedbackData
): Promise<FeedbackResponse> => {
	try {
		const feedback = await prisma.feedback.create({
			data: {
				name: data.name || null,
				email: data.email || null,
				feedback: data.feedback,
				rating: data.rating,
				productId: data.productId || "",
				updatedAt: new Date(),
			},
		});
		return {
			success: true,
			message: "Thank you for your feedback!",
			feedback: {
				id: feedback.id,
				rating: feedback.rating,
				submittedAt: feedback.createdAt,
			},
		};
	} catch (error) {
		console.error("Submit feedback error", error);
		return {
			success: false,
			message: "Failed to submit feedback",
		};
	}
};

// Admin Panel - Listing all entries

export const getAllFeedback = async (
	filters: FeedbackFilters = {}
): Promise<FeedbackResponse> => {
	try {
		const {
			minRating,
			maxRating,
			productId,
			minPopularity,
			sortBy = "createdAt",
			sortOrder = "desc",
			page = 1,
			limit = 10,
		} = filters;
		const skip = (page - 1) * limit;

		const where: any = {};

		if (minRating || maxRating) {
			where.rating = {};
			if (minRating) where.rating.gte = minRating;
			if (maxRating) where.rating.lte = maxRating;
		}
		if (productId) {
			where.productId = productId;
		}

		// Get feedbacks - fetch more if we need to filter by popularity or avgRating
		let feedbacks: FeedbackWithPopularity[] =
			await prisma.feedback.findMany({
				where,
				skip:
					sortBy === "popularity" ||
					sortBy === "avgRating" ||
					minPopularity
						? 0
						: skip,
				take:
					sortBy === "popularity" ||
					sortBy === "avgRating" ||
					minPopularity
						? undefined
						: limit,
				orderBy:
					sortBy === "createdAt"
						? { createdAt: sortOrder }
						: sortBy === "rating"
						? { rating: sortOrder }
						: { createdAt: "desc" },
			});

		// Add popularity scores and product avg ratings
		feedbacks = await Promise.all(
			feedbacks.map(async (feedback) => ({
				...feedback,
				popularityScore: calculatePopularity(feedback),
				productAvgRating: await getProductAvgRating(feedback.productId),
			}))
		);

		// Filter by popularity if specified
		if (minPopularity) {
			feedbacks = feedbacks.filter(
				(f) => (f.popularityScore || 0) >= minPopularity
			);
		}

		// Sort by popularity or average rating
		if (sortBy === "popularity") {
			feedbacks.sort((a, b) => {
				const aScore = a.popularityScore || 0;
				const bScore = b.popularityScore || 0;
				return sortOrder === "desc" ? bScore - aScore : aScore - bScore;
			});
		} else if (sortBy === "avgRating") {
			feedbacks.sort((a, b) => {
				const aAvg = a.productAvgRating || 0;
				const bAvg = b.productAvgRating || 0;
				return sortOrder === "desc" ? bAvg - aAvg : aAvg - bAvg;
			});
		}

		// Apply pagination for custom sorting
		if (
			sortBy === "popularity" ||
			sortBy === "avgRating" ||
			minPopularity
		) {
			const total = feedbacks.length;
			feedbacks = feedbacks.slice(skip, skip + limit);

			return {
				success: true,
				message: "Feedback entries fetched successfully",
				data: {
					feedbacks,
					pagination: {
						current: page,
						total: Math.ceil(total / limit),
						count: total,
						limit,
					},
				},
			};
		}

		// Regular pagination count
		const total = await prisma.feedback.count({ where });

		return {
			success: true,
			message: "Feedback entries fetched successfully",
			data: {
				feedbacks,
				pagination: {
					current: page,
					total: Math.ceil(total / limit),
					count: total,
					limit,
				},
			},
		};
	} catch (error) {
		console.error("Get all feedback error:", error);
		return {
			success: false,
			message: "Failed to retrieve feedback entries",
		};
	}
};

export const getFeedbackStats = async (
	productId?: string
): Promise<FeedbackResponse> => {
	try {
		const where = productId ? { productId } : {};

		const [totalFeedbacks, avgRating, ratingCounts, recentFeedbacks] =
			await Promise.all([
				prisma.feedback.count({ where }),
				prisma.feedback.aggregate({
					where,
					_avg: { rating: true },
				}),
				prisma.feedback.groupBy({
					by: ["rating"],
					where,
					_count: { rating: true },
				}),
				// For real-time graphs and charts
				prisma.feedback.findMany({
					where,
					orderBy: { createdAt: "desc" },
					take: 30, // Last 30 days
				}),
			]);

		// Rating distribution for charts
		const ratingDistribution: { [key: number]: number } = {};
		for (let i = 1; i <= 5; i++) {
			ratingDistribution[i] = 0;
		}
		ratingCounts.forEach((item) => {
			ratingDistribution[item.rating] = item._count.rating;
		}); // Timeline data for real-time graphs
		const timelineData = recentFeedbacks.reduce((acc: any, feedback) => {
			const date = feedback.createdAt.toISOString().split("T")[0];
			if (!acc[date]) {
				acc[date] = { count: 0, totalRating: 0, avgRating: 0 };
			}
			acc[date].count++;
			acc[date].totalRating += feedback.rating;
			acc[date].avgRating = Number(
				(acc[date].totalRating / acc[date].count).toFixed(2)
			);
			return acc;
		}, {});

		// Count popular feedbacks (popularity score > 3.0)
		const allFeedbacks = await prisma.feedback.findMany({ where });
		const popularFeedbacksCount = allFeedbacks.filter(
			(feedback) => calculatePopularity(feedback) > 3.0
		).length;

		const stats: FeedbackStats = {
			totalFeedbacks,
			averageRating: Number(avgRating._avg.rating?.toFixed(2)) || 0,
			ratingDistribution,
			timelineData,
			popularFeedbacksCount,
		};

		return {
			success: true,
			message: "Feedback statistics retrieved successfully",
			data: stats,
		};
	} catch (error) {
		console.error("Get feedback stats error:", error);
		return {
			success: false,
			message: "Failed to retrieve feedback statistics",
		};
	}
};

export const getFeedbackByPopularity = async (
	limit: number = 10
): Promise<FeedbackResponse> => {
	try {
		let feedbacks: FeedbackWithPopularity[] =
			await prisma.feedback.findMany({
				take: limit * 2, // Get more to ensure we have enough after filtering
			});

		feedbacks = feedbacks
			.map((feedback) => ({
				...feedback,
				popularityScore: calculatePopularity(feedback),
			}))
			.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
			.slice(0, limit);

		return {
			success: true,
			message: "Popular feedback retrieved successfully",
			data: { feedbacks },
		};
	} catch (error) {
		console.error("Get feedback by popularity error:", error);
		return {
			success: false,
			message: "Failed to retrieve popular feedback",
		};
	}
};
