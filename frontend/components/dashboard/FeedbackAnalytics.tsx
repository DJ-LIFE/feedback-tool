import { dashBoardAPI } from "@/lib/api";
import { DashboardResponse } from "@/types";
import React, { useEffect, useState } from "react";
import Loading from "../ui/Loading";
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
} from "chart.js";

import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title
);

const FeedbackAnalytics = () => {
	const [feedbackData, setFeedbackData] = useState<DashboardResponse | null>(
		null
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchFeedbackData = async () => {
			try {
				setLoading(true);
				const data = await dashBoardAPI.getDashboardStats();

				if (!data.success) {
					setError(data.message || "Failed to fetch feedback data");
					return;
				}

				setFeedbackData(data);
			} catch (error) {
				console.error("Error fetching feedback data:", error);
				setError("Failed to fetch feedback data");
			} finally {
				setLoading(false);
			}
		};
		fetchFeedbackData();
		// debugger
	}, []);

	console.log("Feedback Data:", feedbackData);
	if (loading) {
		return <Loading />;
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
				<p>{error}</p>
			</div>
		);
	}

	const ratingLabels = feedbackData?.data?.stats?.ratingDistribution || [];
	console.log(ratingLabels, "Rating Distribution Labels");
	console.log(Object.keys(ratingLabels)[0], "First Rating Label");
	const ratingData = {
		rating: Object.keys(ratingLabels).map(
			(rating) => `${rating} Star${parseInt(rating) > 1 ? "s" : ""}`
		),
		labels: Object.keys(ratingLabels),
		datasets: [
			{
				label: "Rating Distribution",
				data: Object.values(ratingLabels),
				backgroundColor: [
					"rgba(255, 99, 132, 0.6)",
					"rgba(255, 159, 64, 0.6)",
					"rgba(255, 205, 86, 0.6)",
					"rgba(75, 192, 192, 0.6)",
					"rgba(54, 162, 235, 0.6)",
				],
				borderColor: [
					"rgb(255, 99, 132)",
					"rgb(255, 159, 64)",
					"rgb(255, 205, 86)",
					"rgb(75, 192, 192)",
					"rgb(54, 162, 235)",
				],
				borderWidth: 1,
			},
		],
	};
	const timeline = feedbackData?.data?.stats?.timelineData || [];
	const ratingTimeLineData = {
		labels:
			Object.keys(timeline).map((date) => {
				const data = new Date(date);
				return data.toLocaleDateString("en-IN", {
					timeZone: "Asia/Kolkata",
					month: "short",
					day: "numeric",
					year: "numeric",
				});
			}) || [],
		datasets: [
			{
				label: "Feedback Count Over Time",
				data: Object.values(timeline).map((item) => item.count) || [],
				backgroundColor: "rgba(75, 192, 192, 0.6)",
				borderColor: "rgb(75, 192, 192)",
				borderWidth: 1,
			},
			{
				label: "Average Rating Over Time",
				data:
					Object.values(timeline).map((item) => item.avgRating) || [],
				backgroundColor: "rgba(255, 99, 132, 0.6)",
				borderColor: "rgb(255, 99, 132)",
				borderWidth: 1,
			},
		],
	};

	const timelineOptions = {
		responsive: true,
		interaction: {
			mode: "index" as const,
			intersect: false,
		},
		stacked: false,
		plugins: {
			title: {
				display: true,
				text: "Feedback Trends Over Time",
			},
		},
		scales: {
			y: {
				type: "linear" as const,
				display: true,
				position: "left" as const,
				title: {
					display: true,
					text: "Feedback Count",
				},
			},
			y1: {
				type: "linear" as const,
				display: true,
				position: "right" as const,
				grid: {
					drawOnChartArea: false,
				},
				min: 0,
				max: 5,
				title: {
					display: true,
					text: "Avg Rating",
				},
			},
		},
	};

	// console.log(feedbackData?.data?.stats?.ratingDistribution, "Rating Distribution Keys");
	return (
		<>
			<div className="space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-white p-4 rounded-lg shadow">
						<h2 className="text-lg font-semibold mb-2">
							Feedback Count
						</h2>
						<p className="text-2xl font-bold">
							{feedbackData?.data?.stats?.totalFeedbacks || 0}
						</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow">
						<h2 className="text-lg font-semibold mb-2">
							Average Rating
						</h2>
						<p className="text-2xl font-bold">
							{feedbackData?.data?.stats?.averageRating.toFixed(
								1
							) || 0}
						</p>
					</div>
				</div>
			</div>
			<div className="bg-yellow-50 p-4 rounded-lg grid-cols-1 md:grid-cols-2 gap-4 shadow">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-white p-4 rounded-lg shadow">
						<h2 className="text-lg font-semibold mb-2">
							Feedback Rating Distribution
						</h2>
						{/* <div>{ratingData['5'] || 0}</div> */}
						<Pie data={ratingData} options={{ responsive: true }} />
					</div>
					<div className="bg-white p-4 rounded-lg shadow">
						<h2 className="text-lg font-semibold mb-2">
							Feedback Over Time
						</h2>
						<Line
							data={ratingTimeLineData}
							options={{ ...timelineOptions, responsive: true }}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default FeedbackAnalytics;
