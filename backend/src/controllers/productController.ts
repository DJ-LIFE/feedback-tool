import { Request, Response } from "express";
import {
	getAllProducts,
	getProductById,
	getProductByCategory,
	getProductByFeedbackCount,
} from "../services/productService";

export const getProducts = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		const products = await getAllProducts();
		if (!products || products.length === 0) {
			return res.status(404).json({ message: "No products found" });
		}
		res.status(200).json(products);
	} catch (error) {
		console.error("Error fetching products:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getProduct = async (req: Request, res: Response): Promise<any> => {
	try {
		const id = req.query.id as string;
		const product = await getProductById(id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.status(200).json(product);
	} catch (error) {
		console.error("Error fetching product:", error);
		res.status(500).json({ message: "Error fetching Product" });
	}
};

export const getProductsByCategory = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		const category = req.params.category as string;
		const products = await getProductByCategory(category);
		if (!products || products.length === 0) {
			return res
				.status(404)
				.json({ message: "No products found in this category" });
		}
		res.status(200).json(products);
	} catch (error) {
		console.error("Error fetching products by category:", error);
		res.status(500).json({
			message: "Error fetching products by category",
		});
	}
};

export const getProductsByFeedbackCount = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		const feedback = req.body.feedback || [];
		const products = await getProductByFeedbackCount(feedback);
		if (!products || products.length === 0) {
			return res
				.status(404)
				.json({ message: "No products found with feedback" });
		}
		res.status(200).json(products);
	} catch (error) {
		console.error("Error fetching products by feedback count:", error);
		res.status(500).json({
			message: "Error fetching products by feedback count",
		});
	}
};
