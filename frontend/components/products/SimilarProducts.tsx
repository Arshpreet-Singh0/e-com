"use client"; // Ensure it's a client component

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import ProductCard from "./ProductCard";
import { Product } from "@/types/types";

export function SimilarProducts({ id }: { id: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/product/${id}/recommendation`);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching similar products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading similar products...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold mb-8">Similar Products</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}
    </div>
  );
}
