import React from "react";
import { Package, Truck, CheckCircle, TimerReset } from "lucide-react";
import { Order } from "@/types/types";
import Link from "next/link";

const OrdersPage = ({ orders }: { orders: Order[] }) => {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      Payment Status : {order.paymentStatus}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {order.status === "pending" ? (
                      <TimerReset className="w-5 h-5 text-orange-500 mr-2" />
                    ) : (
                      <Truck className="w-5 h-5 text-blue-500 mr-2" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        order.status === "pending"
                          ? "text-orange-500"
                          : "text-blue-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <img
                        src={item?.product?.images?.[0] || "/placeholder.png"}
                        alt={item.id}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="ml-4 flex-1">
                        <Link href={`/product/${item?.product?.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                          {item?.product?.name}
                        </Link>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <p>Size: {item.size}</p>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            {/* <span>Color:</span>
                            <div
                              className="ml-1 w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.color }}
                            /> */}
                          </div>
                          <span className="mx-2">•</span>
                          <p>Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer */}
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      Track Order
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      View Invoice
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-lg font-medium text-gray-900">
                      ₹{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
