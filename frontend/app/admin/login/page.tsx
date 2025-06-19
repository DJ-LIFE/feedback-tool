"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/store";
import { feedbackAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

const Login = () => {
	const router = useRouter();
	const loginSchema = z.object({
		username: z.string().min(2).max(100),
		password: z.string().min(6).max(100),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
	});
	const login = useAuthStore((state) => state.login);
	const isLoading = useAuthStore((state) => state.isLoading);
	const setLoading = useAuthStore((state) => state.setLoading);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
		useAuthStore.getState().initializeAuth();
        if (isAuthenticated) {
			router.push("/admin/dashboard");
		}
		if (localStorage.getItem("adminToken")) {
			router.push("/admin/dashboard");
		}

	}, [isAuthenticated, router]);

	// Also redirect if auth state changes to authenticated
	const onSubmit = async (data: z.infer<typeof loginSchema>) => {
		try {
			setLoading(true);
			const response = await feedbackAPI.login(data);
			if (response.success && response.admin && response.token) {
				login(response.admin, response.token);
				router.push("/admin/dashboard");
			} else {
				console.error(
					"Login failed:",
					response.message || "Unknown error"
				);
			}
		} catch (error) {
			console.error("Login error:", error);
		} finally {
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		}
	};
	

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
				<div className="ml-3 text-lg text-neutral-800">
					Logging in...
				</div>
			</div>
		);
	}
	console.log(isLoading, "isLoading state in Login component");
	return (
		<div className="flex justify-center items-center">
			<div className="bg-white p-8 pb-34 rounded-xl shadow-md w-80 md:w-96 mt-40 mx-4">
				<h2 className="text-2xl font-bold mb-6 text-neutral-800">
					Admin Login
				</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-4">
						<label
							className="block text-sm font-medium mb-2 text-neutral-800"
							htmlFor="username"
						>
							Username
						</label>
						<input
							className="border bg-white border-gray-300 p-2 w-full rounded-lg text-neutral-800 placeholder:text-gray-400 placeholder:text-sm"
							{...register("username")}
							type="text"
							id="username"
							placeholder="Enter your email or Username"
							required
						/>
					</div>
					<div className="mb-4">
						<label
							className="block text-sm font-medium mb-2 text-neutral-800"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="border bg-white border-gray-300 p-2 w-full rounded-lg text-neutral-800 placeholder:text-gray-400 placeholder:text-sm"
							{...register("password")}
							type="password"
							id="password"
							placeholder="Enter your password"
							required
						/>
					</div>
					<button
						className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full w-full cursor-pointer hover:bg-blue-600"
						type="submit"
					>
						Login
					</button>
					<p className="text-sm text-neutral-800 mt-4 text-center">
						Don't have an account?{" "}
						<Link
							href="/admin/register"
							className="text-blue-500 hover:underline"
						>
							<span className="font-semibold text-sm">
								Register here
							</span>
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
};
export default Login;
