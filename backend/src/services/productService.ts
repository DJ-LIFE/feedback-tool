import { productData } from "../data/products";

export interface Product {
	id: string;
	name: string;
	description: string;
	category: string;
	price: number;
	image: string;
}

const products: Product[] = productData;
export const getAllProducts = (): Product[] => {
	return products;
};

export const getProductById = (id: string): Product | undefined => {
	return products.find((product) => product.id === id);
};

export const getProductByCategory = (category: string): Product[] => {
	return products.filter(
		(product) => product.category.toLowerCase() === category.toLowerCase()
	);
};

export const getProductByFeedbackCount = (
	feedback: any[]
): (Product & { feedbackCount: number; avgRating: number })[] => {
	return products.map((product) => {
		const productFeedbacks = feedback.filter(
			(f) => f.productId === product.id
		);

		const avgRating =
			productFeedbacks.length > 0
				? productFeedbacks.reduce((sum, f) => sum + f.rating, 0) /
				  productFeedbacks.length
				: 0;

		return {
			...product,
			feedbackCount: productFeedbacks.length,
			avgRating: Math.round(avgRating * 10) / 10,
		};
	});
};
