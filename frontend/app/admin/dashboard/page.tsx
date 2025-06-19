"use client";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import FeedbackAnalytics from "@/components/dashboard/FeedbackAnalytics";
import FeedbackList from "@/components/dashboard/FeedbackList";
import { useAuthStore } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AdminDashBoard = () => {
	const [activeTab, setActiveTab] = useState("overflow");
	const { isAuthenticated, initializeAuth } = useAuthStore();
	const router = useRouter();
	useEffect(() => {
		initializeAuth();
		if (!isAuthenticated) {
			router.push("/admin/login");
		}
	}, [initializeAuth]);
	return (
		<>
			<h1 className="font-bold text-3xl text-center text-neutral-800 mt-10">
				Admin Dashboard
			</h1>
			<div className="container mx-auto py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
						<h2 className="text-xl font-semibold m-4 ">
							Navigation
						</h2>
						<nav className="space-y-2">
							<button
								className={`w-full text-left p-2 font-semibold rounded cursor-pointer ${
									activeTab === "overflow"
										? "bg-blue-50 text-blue-800"
										: "hover:bg-gray-100"
								}`}
								onClick={() => setActiveTab("overflow")}
							>
								Overview
							</button>
							<button
								className={`w-full text-left p-2 font-semibold rounded cursor-pointer ${
									activeTab === "feedbacks"
										? "bg-blue-50 text-blue-800"
										: "hover:bg-gray-100"
								}`}
								onClick={() => setActiveTab("feedbacks")}
							>
								Feedback List
							</button>
							<button
								className={`w-full text-left p-2 font-semibold rounded cursor-pointer ${
									activeTab === "analytics"
										? "bg-blue-50 text-blue-800"
										: "hover:bg-gray-100"
								}`}
								onClick={() => setActiveTab("analytics")}
							>
								Analytics
							</button>
						</nav>
					</div>
					<div className="col-span-1 md:col-span-3 bg-white p-6 rounded-lg shadow-md">
						{activeTab === "overflow" && <DashboardOverview />}
						{activeTab === "feedbacks" && <FeedbackList />}
						{activeTab === "analytics" && <FeedbackAnalytics />}
					</div>
				</div>
			</div>
		</>
	);
};
export default AdminDashBoard;
