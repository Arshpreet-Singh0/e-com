import React from "react";
import {
  Truck,
  CheckCircle,
  TimerReset,
  X,
  Loader,
  Box,
} from "lucide-react";

import { Order } from "@/types/types";
import Link from "next/link";
import Image from "next/image";

const OrdersPage = ({ orders }: { orders: Order[] }) => {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.length > 0 ? (
            <>
              {orders.map((order: Order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Order #{order.id}
                        </p>
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
                        <span>{OrderStatus({ order })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <Image
                            src={
                              item?.product?.images?.[0] || "/placeholder.png"
                            }
                            alt={item.id}
                            className="w-20 h-20 object-cover rounded"
                            width={100}
                            height={100}
                          />
                          <div className="ml-4 flex-1">
                            <Link
                              href={`/product/${item?.product?.id}`}
                              className="text-sm font-medium text-gray-900 hover:underline"
                            >
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <h2 className="text-xl font-semibold text-gray-800">
                No Orders Yet
              </h2>
              <p className="text-gray-600 mt-2">
                Have any issues?{" "}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  Contact us
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

const OrderStatus = ({ order }: { order: Order }) => {
  let status, icon, style;

  if (order.paymentStatus === "pending") {
    status = "Cancelled";
    icon = <X className="text-red-500" />;
    style = "text-red-500";
  } else {
    switch (order.status) {
      case "pending":
        status = "Pending";
        icon = <TimerReset className="text-yellow-500" />;
        style = "text-yellow-500";
        break;
      case "processing":
        status = "Processing";
        icon = <Loader className="text-blue-500 animate-spin" />;
        style = "text-blue-500";
        break;
      case "shipped":
        status = "Shipped";
        icon = <Truck className="text-purple-500" />;
        style = "text-purple-500";
        break;
      case "delivered":
        status = "Delivered";
        icon = <CheckCircle className="text-green-500" />;
        style = "text-green-500";
        break;
      case "cancelled":
        status = "Cancelled";
        icon = <X className="text-red-500" />;
        style = "text-red-500";
        break;
      default:
        status = "Unknown";
        icon = <Box className="text-gray-500" />;
        style = "text-gray-500";
    }
  }

  return (
    <p className={`flex items-center gap-2 text-lg font-semibold ${style}`}>
      {icon} {status}
    </p>
  );
};
