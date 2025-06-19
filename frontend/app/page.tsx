"use client";
import Products from "@/components/Products";
import { useAuthStore } from "@/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const initializeAuth = useAuthStore((state) => state.initializeAuth);
	const logout = useAuthStore((state) => state.logout);
	const router = useRouter();

	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);

	return (
		<>
			<header className="bg-black shadow">
				<div className="container mx-auto py-4 flex justify-between items-center">
					<Link href="/">
						<h1 className="text-2xl text-white font-bold">
							Feedback App
						</h1>
					</Link>

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
									href="/admin/register"
									className="text-xl text-white font-semibold"
								>
									Signup
								</a>
							</>
						) : (
							<>
								<button className="text-xl text-white font-semibold cursor-pointer"
									onClick={() => router.push("/admin/dashboard")}
								>
									Admin
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
			<div className="mx-auto container">
				<h1 className="text-4xl font-bold text-center py-10">
					Feedback Tool
				</h1>
				<Products />
			</div>
		</>
	);
}
