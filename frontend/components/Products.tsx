"use client";
import { productAPI } from "@/lib/api";
import React, { useEffect, useState } from "react";
import Card from "./ui/Card";
import Image from "next/image";
import Button from "./ui/Button";
import { useRouter } from 'next/navigation';

const Products = () => {
	const [products, setProducts] = useState<Product[]>([]);
    const router = useRouter();
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await productAPI.getProducts();
				setProducts(response);
				console.log("Products fetched successfully:", response);
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		};

		fetchProducts();
	}, []);
    const handleProductClick = (productId: string) => {
        
        router.push(`/products/${productId}`);
    }
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
			{products?.map((product) => (
				<ProductCard key={product.id} product={product} onClick={() => handleProductClick(product.id)} />
			))}
		</div>
	);
};

export default Products;

interface Product {
	id: string;
	name: string;
	description: string;
	category: string;
	price: number;
	image: string;
}
const ProductCard = ({ product,onClick }: { product: Product , onClick: () => void }) => {
	return (
		<Card>
			<div className="flex flex-col justify-center pb-10 space-y-1 cursor-pointer">
				<Image
					src={product.image}
					alt={product.name}
					height={320}
					width={350}
					className="mb-2 object-cover aspect-auto h-75 w-full rounded-md"
				/>
				<h3 className="text-xl font-semibold text-neutral-800">{product.name}</h3>
				<p className="text-base text-gray-600">{product.description}</p>
				<p className="text-md font-bold">${product.price}</p>
				<div onClick={onClick}>
					<Button>Give FeedBack</Button>
				</div>
			</div>
		</Card>
	);
};
