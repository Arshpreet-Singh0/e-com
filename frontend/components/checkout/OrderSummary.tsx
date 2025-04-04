"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { Package, Truck } from "lucide-react";
import CartQuantityHandler from "../cart/CartQuantityHandler";
import { useMemo } from "react";
import Image from "next/image";

const OrderSummary = () => {
  const { items } = useAppSelector((store) => store.cart);

  // Recalculate total price when items change
  const totalPrice = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        (item.product.price - (item.product.price * item.product.discount) / 100) *
          item.quantity,
      0
    );
  }, [items]); // Dependency array ensures recalculation on cart updates

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center">
            <Image
              src={item.product.images?.[0]}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded"
              width={100}
              height={100}
            />
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                {item.product.name}
              </h3>
              <p className="text-sm text-gray-500">
                Size: {item.size} • Qty: {item.quantity}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-4">
                ₹
                {(
                  (item.product.price -
                    (item.product.price * item.product.discount) / 100) *
                  item.quantity
                ).toFixed(2)}
              </p>
              <CartQuantityHandler item={item} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <p>Subtotal</p>
          <p>₹{totalPrice.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <p>Tax</p>
          <p>₹{(totalPrice * 0.1).toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-lg font-medium text-gray-900 pt-4 border-t">
          <p>Total</p>
          <p>₹{(totalPrice * 1.1).toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center text-sm text-gray-500">
          <Truck size={20} className="mr-2" />
          Free shipping on all orders
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Package size={20} className="mr-2" />
          Estimated delivery: 3-5 business days
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
