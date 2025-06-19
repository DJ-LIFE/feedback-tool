export interface Feedback {
	id: string;
	name?: string;
	email?: string;
	feedback: string;
	rating: number;
	productId: string;
	createdAt: string;
	updatedAt: string;
	popularityScore?: number;
	productAvgRating?: number;
}

export interface FeedbackStats {
	totalFeedbacks: number;
	averageRating: number;
	ratingDistribution: { [key: number]: number };
	timelineData: { [date: string]: { count: number; avgRating: number } };
	popularFeedbacksCount: number;
}

export interface Admin {
	id: string;
	username: String;
	email: string;
}

export interface AuthResponse {
	success: boolean;
	message: string;
	token?: string;
	admin?: Admin;
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

export interface FeedbackItem {
	feedbacks: Array<Feedback>;
	data: {
		feedbacks: Array<Feedback>;
	};
	id: string;
	name: string;
	email: string;
	feedback: string;
	rating: number;
	productId: string;
	createdAt: string;
	updatedAt: string;
	popularityScore: number;
	productAvgRating?: number;
}
export interface DashboardResponse {
	success: boolean;
	message: string;
	data: {
		stats: {
			totalFeedbacks: number;
			averageRating: number;
			ratingDistribution: Record<string, number>;
			timelineData: Record<
				string,
				{
					count: number;
					totalRating: number;
					avgRating: number;
				}
			>;
			popularFeedbacksCount: number;
		};
		popularFeedbacks: Array<FeedbackItem>;
		recentFeedbacks: Array<FeedbackItem>;
	};
	adminInfo: {
		adminId: string;
		adminEmail: string;
		lastLogin: string;
	};
}
