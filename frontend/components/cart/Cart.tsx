"use client";

import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { toggleCartDrawer } from '@/lib/store/features/cartSlice';


const CartDrawer = () => {
//   const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
const dispatch = useAppDispatch();

const {isCartOpen, items} = useAppSelector((store) => store.cart);


const onClose = () => {
    dispatch(toggleCartDrawer());
}

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                  <button
                    onClick={onClose}
                    className="ml-3 h-7 flex items-center justify-center"
                  >
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
                        {items.map((item : any) => (
                          <li key={item.id} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
                              <img
                                src={item.images?.[0]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <div className="mt-1 text-sm text-gray-500">
                                  {/* <p>Size: {item.size}</p> */}
                                  {/* <div className="flex items-center">
                                    <span>Color:</span>
                                    <div
                                      className="ml-2 w-4 h-4 rounded-full border border-gray-300"
                                      style={{ backgroundColor: item.selectedColor }}
                                    /> */}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center border rounded-lg">
                                  <button
                                    // onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-2"
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span className="px-4 py-2">{item.quantity}</span>
                                  <button
                                    // onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-2"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                //   onClick={() => removeItem(item.id)}
                                  className="font-medium text-red-600 hover:text-red-500"
                                >
                                  Remove
                                </button>
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
                  {/* <p>Subtotal ({totalItems} items)</p> */}
                  {/* <p>${totalPrice.toFixed(2)}</p> */}
                </div>
                <button
                //   onClick={onCheckout}
                  className="w-full bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Checkout
                </button>
                <div className="mt-6 flex justify-center text-sm text-gray-500">
                  <p>
                    or{' '}
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