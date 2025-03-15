"use client";

import React, { useState } from "react";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addToCart, addToCartServer } from "@/lib/store/features/cartSlice";
import { toast } from "sonner";
import Image from "next/image";

const ProductDetailsPage = ({ product }: { product: Product }) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.auth);

  const handleAddToCart = (product: {
    id : string;
    price : number;
    name : string;
    images : string[]
  }) => {
    if (!selectedSize) {
      toast.error("Please Select a size");
      return;
    }
    if (user) {
      dispatch(
        addToCartServer({ id: product.id, quantity, size: selectedSize })
      );
    } else {
      dispatch(addToCart({ quantity, size: selectedSize, product }));
      toast.success("Product added to cart.");
    }
  };

  const productImages = product?.images;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );

  return (
    <div className=" bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="bg-white max-w-6xl w-full rounded-lg overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Product Images */}
          <div className="w-full md:w-3/5 relative">
            <div className="aspect-square relative">
              <Image
                src={productImages[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                height={500}
                width={500}
                unoptimized
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      currentImageIndex === index ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-2/5 p-8">
            <h2 className="text-3xl font-bold mb-4">{product.name} </h2>
            <div className="flex gap-5 items-center">
              <p className="text-2xl font-semibold mb-6"> ₹ {product.price} </p>
              {product?.discount && (
                <p className="text-xl font-semibold mb-6 text-red-600">
                  save {Math.floor(product.price * product?.discount) / 100}
                </p>
              )}
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {product?.sizes?.map((size) => (
                  <button
                    key={size.size}
                    onClick={() => setSelectedSize(size.size)}
                    className={`py-2 text-sm font-medium rounded-md ${
                      selectedSize === size.size
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Quantity
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-2 border rounded-md hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-2 border rounded-md hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="space-y-4">
              <button
                className="w-full bg-black text-white py-4 rounded-md hover:bg-gray-800 flex items-center justify-center space-x-2"
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
              <button className="w-full border border-black py-4 rounded-md hover:bg-gray-100 flex items-center justify-center space-x-2">
                <Heart size={20} />
                <span>Add to Wishlist</span>
              </button>
            </div>

            {/* Product Details */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Product Details</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
