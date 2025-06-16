import { Request, Response } from "express";
import { submitFeedback } from "../services/feedbackService";

export const feedback = async (req: Request, res: Response): Promise<any> => {
	try {
		const { name, email, feedback, rating } = req.body;

		if (!feedback) {
			return res.status(400).json({
				success: false,
				message: "Feedback is required",
			});
		}
		if (rating < 1 || rating > 5) {
			return res.status(400).json({
				success: false,
				message: "Rating must be between 1 and 5",
			});
		}
		const productId = (req.query.productId as string) || "";
		const feedbackData = {
			name: name || null,
			email: email || null,
			feedback: feedback,
			rating: rating,
			productId: productId,
		};

		const result = await submitFeedback(feedbackData);

		if (result.success) {
			return res.status(201).json(result);
		} else {
			return res.status(400).json(result);
		}
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
