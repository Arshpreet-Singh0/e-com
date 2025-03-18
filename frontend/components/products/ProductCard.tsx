"use client";

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  
  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 h-[300px]" onClick={()=>router.push(`/product/${product?.id}`)}>
        <Image
          src={product?.images?.[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
          height={500}
          width={500}
          unoptimized
        />
        <div className="absolute top-4 right-4 space-y-2">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm text-gray-700">{product.name}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">₹{product.price}</p>
        {/* <div className="mt-1 flex space-x-2">
          {product.colors.map((color) => (
            <div
              key={color}
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default ProductCard;