import { Admin } from "@/types";
import { create } from "zustand";

interface AuthState {
	admin: Admin | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	signup: (admin: Admin, token: string) => void;
	login: (admin: Admin, token: string) => void;
	logout: () => void;
	setLoading: (isLoading: boolean) => void;
	initializeAuth: () => void;
}
interface Feedback {
	productId: string;
	setProductId: (productId: string) => void;
}

export const useFeedbackStore = create<Feedback>((set) => {
	return {
		productId: "",
		setProductId: (productId: string) => set({ productId }),
	};
});

export const useAuthStore = create<AuthState>((set) => ({
	admin: null,
	token: null,
	isAuthenticated: false,
	isLoading: false,
	signup: (admin: Admin, token: string) => {
		localStorage.setItem("adminToken", token);
		localStorage.setItem("adminData", JSON.stringify(admin));
		set({ admin, token, isAuthenticated: true });
	},
	login: (admin: Admin, token: string) => {
		localStorage.setItem("adminToken", token);
		localStorage.setItem("adminData", JSON.stringify(admin));
		set({ admin, token, isAuthenticated: true });
	},
	logout: () => {
		localStorage.removeItem("adminToken");
		localStorage.removeItem("adminData");
		set({
			admin: null,
			token: null,
			isAuthenticated: false,
		});
	},
	setLoading: (isLoading: boolean) => {
		set({ isLoading });
	},
	initializeAuth: () => {
		const token = localStorage.getItem("adminToken");
		const adminData = localStorage.getItem("adminData");
		if (token && adminData) {
			const admin = JSON.parse(adminData);
			set({ admin, token, isAuthenticated: true });
		}
	},
}));
