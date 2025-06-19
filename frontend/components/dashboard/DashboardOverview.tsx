import { dashBoardAPI } from "@/lib/api";
import { DashboardResponse } from "@/types";
import React, { useEffect, useState } from "react";

const DashboardOverview = () => {
	const [dashboardData, setDashboardData] =
		useState<DashboardResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchDashboardStats = async () => {
			try {
				setLoading(true);
				const data = await dashBoardAPI.getDashboardStats();

				if (!data.success) {
					setError(data.message || "Failed to fetch dashboard stats");
					return;
				}

				setDashboardData(data);
			} catch (error) {
				console.error("Error fetching dashboard stats:", error);
				setError("Failed to fetch dashboard stats");
			} finally {
				setLoading(false);
			}
		};
		fetchDashboardStats();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
				<p>{error}</p>
			</div>
		);
	}

	const { stats, recentFeedbacks, popularFeedbacks } = dashboardData?.data;
	if (!stats) {
		return (
			<div className="text-center py-8">
				<p>No dashboard data available</p>
			</div>
		);
	}

	return (
		<div>
			<h2 className="text-2xl font-bold mb-6">DashboardOverview</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
					<h2 className="text-lg font-semibold text-blue-800 mb-1">
						Total Feedbacks
					</h2>
					<p className="text-2xl font-bold text-black">
						{stats?.totalFeedbacks}
					</p>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-100">
					<h3 className="text-lg font-semibold text-green-800 mb-1">
						Average Rating
					</h3>
					<p className="text-3xl font-bold">{stats?.averageRating}</p>
					<div className="flex items-center mt-1">
						{[...Array(5)].map((_, i) => (
							<svg
								key={i}
								className={`w-5 h-5 ${
									i < Math.round(Number(stats?.averageRating))
										? "text-yellow-400"
										: "text-gray-300"
								}`}
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
						))}
					</div>
				</div>

				{/* <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
					<h3 className="text-lg font-semibold text-purple-800 mb-1">
						Total Products
					</h3>
					<p className="text-3xl font-bold">{stats?.productCount}</p>
				</div> */}
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
					<h3 className="text-lg font-semibold text-purple-800 mb-1">
						Rating Distribution
					</h3>
					<div className="grid grid-cols-5 gap-1 mt-2">
						{Object.entries(stats.ratingDistribution).map(
							([rating, count]) => (
								<div key={rating} className="text-center">
									<div className="text-sm font-medium flex items-center justify-center">
										<p className="m-1">{rating}</p>{" "}
										<span className="text-yellow-400">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="icon icon-tabler icons-tabler-filled icon-tabler-star "
											>
												<path
													stroke="none"
													d="M0 0h24v24H0z"
													fill="none"
												/>
												<path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
											</svg>
										</span>
									</div>
									<div className="text-lg font-semibold">
										{count as number}
									</div>
								</div>
							)
						)}
					</div>
				</div>
				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4">
						Recent Feedback
					</h3>
					{recentFeedbacks.length === 0 ? (
						<p className="text-gray-500">No feedback available</p>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											User
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Feedback
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Rating
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Date
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{recentFeedbacks
										.slice(0, 5)
										.map((feedback: any) => (
											<tr key={feedback.id}>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{feedback.name ||
															"Anonymous"}
													</div>
													<div className="text-sm text-gray-500">
														{feedback.email}
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="text-sm text-gray-900">
														{feedback.feedback
															.length > 50
															? `${feedback.feedback.substring(
																	0,
																	50
															  )}...`
															: feedback.feedback}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex">
														{[...Array(5)].map(
															(_, i) => (
																<svg
																	key={i}
																	className={`w-5 h-5 ${
																		i <
																		feedback.rating
																			? "text-yellow-400"
																			: "text-gray-300"
																	}`}
																	fill="currentColor"
																	viewBox="0 0 20 20"
																>
																	<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
																</svg>
															)
														)}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{new Date(
														feedback.createdAt
													).toLocaleDateString()}
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					)}
				</div>
				{popularFeedbacks.length > 0 && (
					<div>
						<h3 className="text-xl font-semibold mb-4">
							Popular Feedback
						</h3>
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											User
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Feedback
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Rating
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Popularity Score
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{popularFeedbacks
										.slice(0, 3)
										.map((feedback: any) => (
											<tr key={feedback.id}>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{feedback.name ||
															"Anonymous"}
													</div>
													<div className="text-sm text-gray-500">
														{feedback.email}
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="text-sm text-gray-900">
														{feedback.feedback
															.length > 50
															? `${feedback.feedback.substring(
																	0,
																	50
															  )}...`
															: feedback.feedback}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex">
														{[...Array(5)].map(
															(_, i) => (
																<svg
																	key={i}
																	className={`w-5 h-5 ${
																		i <
																		feedback.rating
																			? "text-yellow-400"
																			: "text-gray-300"
																	}`}
																	fill="currentColor"
																	viewBox="0 0 20 20"
																>
																	<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
																</svg>
															)
														)}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{feedback.popularityScore.toFixed(
														2
													)}
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default DashboardOverview;
