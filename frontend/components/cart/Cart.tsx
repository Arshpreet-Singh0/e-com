"use client";

import React from "react";
import { X, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  CartItem,
  closeCartDrawer,
  deleteCartItemServer,
  removeFromCart,
  toggleCartDrawer,
} from "@/lib/store/features/cartSlice";
import Image from "next/image";
import CartQuantityHandler from "./CartQuantityHandler";
import { useRouter } from "next/navigation";

const CartDrawer = () => {
  const dispatch = useAppDispatch();
  const { isCartOpen, items, isLoading } = useAppSelector((store) => store.cart);
  const { user } = useAppSelector((store) => store.auth);
  const router = useRouter();

  const totalPrice: number = items?.reduce(
    (total: number, item: CartItem) =>
      total + (item.product.price - (item.product.price * item.product.discount) / 100),
    0
  );

  const onClose = () => {
    dispatch(toggleCartDrawer());
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="relative h-full flex flex-col bg-white shadow-xl">
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                  <button onClick={onClose} className="ml-3 h-7 flex items-center justify-center">
                    <X size={24} />
                  </button>
                </div>

                {items.length === 0 ? (
                  <div className="mt-20 text-center">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                    <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart</p>
                  </div>
                ) : (
                  <div className="mt-8">
                    <div className="flow-root">
                      <ul className="divide-y divide-gray-200">
                        {items.map((item: CartItem, idx: number) => (
                          <li key={idx} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
                              <Image
                                src={item?.product?.images?.[0]}
                                alt={item.id || " "}
                                className="w-full h-full object-cover"
                                height={100}
                                width={100}
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.product.name}</h3>
                                <p className="ml-4">
                                  ₹
                                  {((item?.product?.price - (item?.product?.price * item?.product?.discount) / 100) * item.quantity).toFixed(2)}
                                </p>
                              </div>
                              <div className="flex-1 flex items-center justify-between text-sm">
                                <div>
                                  <div className="mb-2">
                                    <p>Size: {item.size}</p>
                                  </div>
                                  <CartQuantityHandler item={item} />
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    user != null
                                      ? dispatch(deleteCartItemServer(item?.id || ""))
                                      : dispatch(
                                          removeFromCart({
                                            id: item?.product?.id,
                                            size: item?.size,
                                          })
                                        )
                                  }
                                  className="font-medium text-red-600 hover:text-red-500 cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Subtotal ({items.length} items)</p>
                  <p>₹{totalPrice.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => {
                    dispatch(closeCartDrawer());
                    router.push("/checkout");
                  }}
                  className="w-full bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Checkout
                </button>
                <div className="mt-6 flex justify-center text-sm text-gray-500">
                  <p>
                    or{" "}
                    <button
                      type="button"
                      className="font-medium text-black hover:text-gray-800"
                      onClick={onClose}
                    >
                      Continue Shopping
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
