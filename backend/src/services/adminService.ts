import { PrismaClient } from "../../generated/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export interface CreateAdminData {
	username: string;
	email: string;
	password: string;
}

export interface LoginData {
	email?: string;
	username?: string;
	password: string;
}

export interface AuthResponse {
	success: boolean;
	message: string;
	admin?: {
		id: string;
		username: string;
		email: string;
	};
	token?: string;
}

export const generateToken = (adminId: string, email: string): string => {
	return jwt.sign(
		{ adminId, email, type: "admin" },
		process.env.JWT_SECRET!,
		{ expiresIn: "24h" }
	);
};

export const registerAdmin = async (
	data: CreateAdminData
): Promise<AuthResponse> => {
	try {
		const existingAdmin = await prisma.admin.findFirst({
			where: {
				OR: [{ username: data.username }, { email: data.email }],
			},
		});

		if (existingAdmin) {
			return {
				success: false,
				message: "Admin already exists",
			};
		}

		const hashedPassword = await bcrypt.hash(data.password, 10);
		const admin = await prisma.admin.create({
			data: {
				username: data.username,
				email: data.email,
				password: hashedPassword,
			},
			select: { id: true, username: true, email: true },
		});

		const token = generateToken(admin.id, admin.username);

		return {
			success: true,
			message: "Admin registered successfully",
			admin: {
				id: admin.id,
				username: admin.username,
				email: admin.email,
			},
			token,
		};
	} catch (error) {
		console.error("Registration error", error);
		return {
			success: false,
			message: "Registration failed",
		};
	}
};

export const loginAdmin = async (data: LoginData): Promise<AuthResponse> => {
	try {
		const admin = await prisma.admin.findFirst({
			where: {
				OR: [{ username: data.username }, { email: data.email }],
			},
		});
		if (!admin || !await bcrypt.compare(data.password, admin.password)) {
			return {
				success: false,
				message: "Invalid credentails",
			};
		}
		const token = generateToken(admin?.id, admin?.username);

		return {
			success: true,
			message: "Login Successful",
			admin: {
				id: admin.id,
				username: admin.username,
				email: admin.username,
			},
			token,
		};
	} catch (error) {
		console.error("Login error", error);
		return {
			success: false,
			message: "Login failed",
		};
	}
};
