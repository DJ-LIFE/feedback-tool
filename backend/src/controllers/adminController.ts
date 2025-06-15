import { loginAdmin, registerAdmin } from "../services/adminService";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response): Promise<any> => {
	try {
		const { username, email, password } = req.body;

		if (!username || !email || !password) {
			return res.status(400).json({
				success: false,
				message: "Username, email, and password are required",
			});
		}
		if (password.length < 6) {
			return res.status(400).json({
				success: false,
				message: "Password must be at least 6 characters long",
			});
		}

		const result = await registerAdmin({ username, email, password });

		if (!result.success) {
			return res.status(400).json(result);
		}
		return res.status(201).json(result);
	} catch (error) {
		console.error("Register controller error", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const login = async (req: Request, res: Response): Promise<any> => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			return res.status(400).json({
				success: false,
				message: "Username and Password are required",
			});
		}

		const result = await loginAdmin({ username, password });

		if (!result.success) {
			return res.status(402).json(result);
		}
		return res.status(200).json(result);
	} catch (error) {
		console.error("Login controller error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
