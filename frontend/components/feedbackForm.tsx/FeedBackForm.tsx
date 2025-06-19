"use client";
import Button from "../ui/Button";
import Input from "../ui/Input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { feedbackAPI } from "@/lib/api";
import StarRating from "./StarRating";
import { useState } from "react";
import { useFeedbackStore } from "@/store/store";

const FeedbackForm = () => {
	const [status, setStatus] = useState("");
	const [loading, setLoading] = useState(false);
	const feedbackSchema = z.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.string().email("Invalid email address"),
		feedback: z.string().min(10, "Feedback must be at least 10 characters"),
		rating: z.number().optional(),
	});
	const productId = useFeedbackStore((state) => state.productId);
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: zodResolver(feedbackSchema),
		defaultValues: {
			name: "",
			email: "",
			feedback: "",
			rating: 0,
		},
	});
	console.error(errors, "FeedbackForm errors");
	console.log("FeedbackForm rendered");
	const onSubmit = async (data: z.infer<typeof feedbackSchema>) => {
		try {
			setLoading(true);
			const payload = {
				...data,
				productId: productId,
				rating: data.rating || 0,
			};
			const response = await feedbackAPI.submitFeedback(payload);
			if (response.success) {
				setStatus("Thank You! Your feedback has been submitted.");
			} else {
				console.error(
					"Feedback submission failed:",
					response.message || "Unknown error"
				);
			}
		} catch (error) {
			console.error("Feedback submission error:", error);
		} finally {
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-lg font-semibold">Submitting...</div>
			</div>
		);
	}
	if (status) {
		return (
			<div className="flex items-center justify-center h-full">
				<div>

				</div>
				<div className="text-lg font-semibold text-green-600">
					{status}
				</div>
			</div>
		);
	}
	return (
		<div className="flex flex-col items-center justify-center">
			<form
				className="bg-white p-6 rounded-lg shadow-md w-96"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="mb-4">
					<label
						className="block text-sm font-medium text-gray-700 mb-2"
						htmlFor="name"
					>
						Name
					</label>
					<Input
						{...register("name")}
						type="text"
						id="name"
						placeholder="Your Name"
					/>
					{errors.name && (
						<p className="text-red-500 text-sm">
							{errors.name.message}
						</p>
					)}
				</div>
				<div className="mb-4">
					<label
						className="block text-sm font-medium text-gray-700 mb-2"
						htmlFor="email"
					>
						Email
					</label>
					<Input
						{...register("email")}
						type="email"
						id="email"
						placeholder="Your Email"
					/>
					{errors.email && (
						<p className="text-red-500 text-sm">
							{errors.email.message}
						</p>
					)}
				</div>
				<div className="mb-4">
					<label
						className="block text-sm font-medium text-gray-700 mb-2"
						htmlFor="feedback"
					>
						Feedback
					</label>
					<textarea
						{...register("feedback")}
						id="feedback"
						rows={4}
						className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
						placeholder="Your Feedback"
					></textarea>
					{errors.feedback && (
						<p className="text-red-500 text-sm">
							{errors.feedback.message}
						</p>
					)}
				</div>{" "}
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Rating
					</label>
					<StarRating
						ratingData={ratingData}
						onClick={(value) => {
							setValue("rating", value);
						}}
					/>
				</div>
				<Button type="submit">Submit Feedback</Button>
			</form>
		</div>
	);
};

export default FeedbackForm;

const ratingData = [
	{ id: 1, value: 1 },
	{ id: 2, value: 2 },
	{ id: 3, value: 3 },
	{ id: 4, value: 4 },
	{ id: 5, value: 5 },
];
