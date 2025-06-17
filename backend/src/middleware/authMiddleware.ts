import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
	admin?: {
		id: string;
		email: string;
		username: string;
	};
}

interface JwtPayload {
	adminId: string;
	email: string;
	username: string;
}

export const authMiddleware = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Promise<any> => {
	try {
		// Get token from Authorization header
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res.status(401).json({
				success: false,
				message: "Access denied. No token provided.",
			});
		}

		// Check if token starts with "Bearer "
		if (!authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				message:
					"Access denied. Invalid token format. Use 'Bearer <token>'",
			});
		}

		// Extract token
		const token = authHeader.substring(7); // Remove "Bearer " prefix

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Access denied. Token is missing.",
			});
		}

		// Verify JWT secret exists
		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			console.error("JWT_SECRET is not defined in environment variables");
			return res.status(500).json({
				success: false,
				message: "Internal server error. JWT configuration missing.",
			});
		}

		// Verify token
		const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

		if (!decoded || !decoded.adminId) {
			return res.status(401).json({
				success: false,
				message: "Access denied. Invalid token payload.",
			});
		}

		// Check if admin exists in database
		const admin = await prisma.admin.findUnique({
			where: { id: decoded.adminId },
			select: { id: true, email: true, username: true },
		});

		if (!admin) {
			return res.status(401).json({
				success: false,
				message: "Access denied. Admin not found.",
			});
		}

		// Add admin info to request
		req.admin = {
			id: admin.id,
			email: admin.email,
			username: admin.username,
		};

		next();
	} catch (error) {
		console.error("Auth middleware error:", error);

		// Handle specific JWT errors
		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({
				success: false,
				message: "Access denied. Invalid token.",
				error:
					process.env.NODE_ENV === "development"
						? error.message
						: undefined,
			});
		}

		if (error instanceof jwt.TokenExpiredError) {
			return res.status(401).json({
				success: false,
				message: "Access denied. Token has expired.",
			});
		}

		return res.status(500).json({
			success: false,
			message: "Internal server error during authentication.",
		});
	}
};
