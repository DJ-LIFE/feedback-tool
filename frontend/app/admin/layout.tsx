"use client";
import { useAuthStore } from "@/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const initializeAuth = useAuthStore((state) => state.initializeAuth);
	const logout = useAuthStore((state) => state.logout);
	const router = useRouter();
	React.useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);
	return (
		<div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50">
			<header className="bg-black shadow">
				<div className="container mx-auto py-4 flex justify-between items-center">
					<a href="/">
						<h1 className="text-2xl text-white font-bold">
							Feedback App
						</h1>
					</a>

					<div className="flex space-x-4">
						{!isAuthenticated ? (
							<>
								<a
									href="/admin/login"
									className="text-xl text-white font-semibold"
								>
									Login
								</a>
								<span className="text-white">|</span>
								<a
									href="/admin/signup"
									className="text-xl text-white font-semibold"
								>
									Signup
								</a>
							</>
						) : (
							<>
								<button
									className="text-xl text-white font-semibold cursor-pointer"
									onClick={() =>
										router.push("/")
									}
								>
									Products
								</button>
								<button
									className="text-xl text-white font-semibold cursor-pointer"
									onClick={logout}
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
