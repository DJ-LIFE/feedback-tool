"use client";
import { useAuthStore } from "@/store/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const initializeAuth = useAuthStore((state) => state.initializeAuth);
	const logout = useAuthStore((state) => state.logout);
	const router = useRouter();
	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
			<header className="bg-black shadow">
				<div className="container mx-auto py-2 flex justify-between items-center">
					<a href="/">
						<span className="flex items-center space-x-2">
							<Image
								src="/logo.svg"
								alt="Logo"
								width={48}
								height={48}
							/>
							<h1 className="text-2xl text-white font-bold">
								Feedback
							</h1>
						</span>
					</a>

					<div className="flex space-x-4">
						{!isAuthenticated ? (
							<>
								<button
									onClick={() => router.push("/admin/login")}
									className="text-xl text-white font-semibold cursor-pointer"
								>
									Login
								</button>
								<span className="text-white">|</span>
								<button
									onClick={() => router.push("/admin/register")}
									className="text-xl text-white font-semibold cursor-pointer"
								>
									Signup
								</button>
							</>
						) : (
							<>
								<button
									className="text-xl text-white font-semibold cursor-pointer"
									onClick={() => router.push("/")}
								>
									Products
								</button>
								<button
									className="text-xl text-white font-semibold cursor-pointer"
									onClick={() => {
										logout();
										router.push("/admin/login");
									}}
								>
									Logout
								</button>
							</>
						)}
					</div>
				</div>
			</header>
			<div className="container mx-auto">{children}</div>
		</div>
	);
};
export default AdminLayout;
