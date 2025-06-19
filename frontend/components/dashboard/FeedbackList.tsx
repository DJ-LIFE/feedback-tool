import { dashBoardAPI } from "@/lib/api";
import { FeedbackItem } from "@/types";
import React, { useEffect, useState } from "react";
import Loading from "../ui/Loading";

const FeedbackList = () => {
	const [feedbackData, setFeedbackData] = useState<FeedbackItem | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchFeedbackData = async () => {
			try {
				setLoading(true);
				const data = await dashBoardAPI.getFeedbacks();

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
		return (
			<Loading />
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
				<p>{error}</p>
			</div>
		);
	}
	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">Feedback List</h2>
			<ul className="space-y-4 max-h-150 overflow-y-auto">
				{feedbackData?.data?.feedbacks?.map((feedback) => (
					<li
						key={feedback.id}
						className="border border-blue-200 bg-blue-50 p-2 rounded-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]  py-2"
					>
						<p className="font-semibold">Name: {feedback.name}</p>
						<p className="font-semibold">
							Email:{" "}
							<span className="text-neutral-600 text-sm font-medium">
								{feedback.email}
							</span>
						</p>
						<p className="mt-1 font-semibold">
							Feedback:{" "}
							<span className="text-neutral-600 font-medium">
								{feedback.feedback}
							</span>
						</p>
						<p className="mt-1 font-semibold">
							Rating:{" "}
							<span className="font-normal">
								{feedback.rating}
							</span>
						</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default FeedbackList;
