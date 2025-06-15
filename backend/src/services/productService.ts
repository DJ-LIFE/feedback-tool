import { productData } from "@/data/products";

export interface Product {
	id: string;
	name: string;
	description: string;
	category: string;
	price: number;
	image: string;
}

export class ProductService {
	private products: Product[] = productData;
	getAllProducts(): Product[] {
		return this.products;
	}

	getProductById(id: string): Product | undefined {
		return this.products.find((product) => product.id === id);
	}

	getProductByCategory(category: string): Product[] {
		return this.products.filter(
			(product) =>
				product.category.toLowerCase() === category.toLowerCase()
		);
	}

	getProductByFeedbackCount(
		feedback: any[]
	): (Product & { feedbackCount: number; avgRating: number })[] {
		return this.products.map((product) => {
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
	}
}

export const productService = new ProductService();
