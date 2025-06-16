import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
	admin?: {
		id: string;
		username: string;
		email: string;
	};
}

interface JwtPayload {
	adminId: string;
	username: string;
	type: string;
}

export const authMiddleware = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.header("Authorization")?.replace("Bearer", "");

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Access denied. No token provided",
			});
		}

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as JwtPayload;

		if (decoded.type !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Access denied. Alpha privileges required.",
			});
		}

		const admin = await prisma.admin.findUnique({
			where: { id: decoded.adminId },
			select: { id: true, username: true, email: true },
		});

		if (!admin) {
			return res.status(401).json({
				success: false,
				message: "Invalid token. Admin not found.",
			});
		}

		req.admin = admin;
		next();
	} catch (error) {
		console.error("Auth middleware error", error);
		res.status(401).json({
			success: false,
			message: "Invalid Token.",
		});
	}
};

export type { AuthenticatedRequest };
