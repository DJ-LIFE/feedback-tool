import { AuthResponse } from "@/types";
import axios from "axios";
import { get } from "http";
import { register } from "module";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("adminToken");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const productAPI = {
	getProducts: async (params?: { category?: string; limit?: number }) => {
		const res = await api.get("/products", { params });
		return res.data;
	},
	getProduct: async (id: string) => {
		const res = await api.get(`/products/${id}`);
		return res.data;
	},
	getProductsByCategory: async (category: string) => {
		const res = await api.get(`/products/category/${category}`);
		return res.data;
	},
	getProductsByFeedbackCount: async (feedback: any[]) => {
		const res = await api.post("/products/feedback", { feedback });
		return res.data;
	},
};

export const dashBoardAPI = {
	getDashboardStats: async () => {
		const res = await api.get("/admin-panel/dashboard");
		if (!res.data) {
			throw new Error("Failed to fetch dashboard stats");
		}
		return res.data;
	},
	getFeedbacks: async (filters = {}) => {
		try {
			const res = await api.get("/feedbacks", { params: filters });
			return res.data;
		} catch (error) {
			console.error("Error fetching feedbacks:", error);
			return {
				success: false,
				message: "Failed to fetch feedbacks",
			};
		}
	},
	getProductStats: async () => {
		try {
			const res = await api.get("/stats");
			return res.data;
		} catch (error) {
			console.error("Error fetching product stats:", error);
			return {
				success: false,
				message: "Failed to fetch product stats",
			};
		}
	},
	// getAnalytics: async() => {
	// 	try {
	// 		const res = await api.get("")
	// 	} catch (error) {
			
	// 	}
	// }
};

export const feedbackAPI = {
	submitFeedback: async (data: {
		name?: string;
		email?: string;
		feedback: string;
		rating: number;
		productId?: string;
	}) => {
		const res = await api.post("/feedback", data);
		return res.data;
	},
	register: async (credentials: {
		username: string;
		email: string;
		password: string;
	}): Promise<AuthResponse> => {
		const res = await api.post("/admin/register", credentials);
		return res.data;
	},
	login: async (credentials: {
		username: string;
		password: string;
	}): Promise<AuthResponse> => {
		const res = await api.post("/admin/login", credentials);
		return res.data;
	},
};

export default api;
