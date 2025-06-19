"use client";

import FeedbackForm from "@/components/feedbackForm.tsx/FeedBackForm";
import { productAPI } from "@/lib/api";
import { useFeedbackStore } from "@/store/store";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
	id: string;
	name: string;
	description: string;
	category: string;
	price: number;
	image: string;
}
const ProductDetail = () => {
	const params = useParams();
	const productId = params.id as string;
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const setProductId = useFeedbackStore((state) => state.setProductId);
	// debugger;
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await productAPI.getProduct(productId);
				setProduct(response);
				setProductId(productId);
			} catch (error) {
				console.error("Error fetching product:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [productId]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!product) {
		return <div>Product not found</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
				<div className="col-span-1 bg-white p-4 pb-10 rounded-xl shadow-lg border border-neutral-300 space-y-4">
					<h1 className="text-3xl font-semibold text-neutral-800">
						{product.name}
					</h1>
					<Image
						src={product.image}
						alt={product.name}
						width={500}
						height={500}
						className="w-full h-100 object-cover rounded-lg mb-4"
					/>
					<p>{product.description}</p>
					<p className="text-neutral-800 font-semibold">
						Category:{" "}
						<span className="py-1 px-4 text-sm bg-blue-800 text-white font-semibold rounded-full">
							{product.category}
						</span>
					</p>
					<p className="text-neutral-800 text-lg font-semibold">
						Price: ${product.price}
					</p>
				</div>
				<div className="col-span-2 pt-10 pb-20 bg-neutral-50 w-full rounded-xl shadow-lg border border-neutral-300">
					<FeedbackForm />
				</div>
			</div>
		</div>
	);
};

export default ProductDetail;
