"use client";

import React, { useState } from "react";
import { Mail, Search, Filter, ChevronDown, X } from "lucide-react";
import { Order } from "@/types/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import OrderEmailTemplate from '../../components/emails/OrderEmailTemplate';

const ORDER_STATUSES = [
  "pending",
  "processing",
  "in transit",
  "delivered",
  "cancelled",
];
// const ORDER_STATUSES_COLORS = {
//     'pending': 'bg-yellow-100 text-yellow-800',
//     'processing': 'bg-blue-100 text-blue-800',
//     'in Transit': 'bg-orange-100 text-orange-800',
//     'delivered': 'bg-green-100 text-green-800',
//     'cancelled': 'bg-red-100 text-red-800'
//   };
// const ORDER_STATUSES_ICONS = {
//     'Pending': <Search />,
//     'Processing': <Package />,
//     'In Transit': <Truck />,
//     'Delivered': <CheckCircle />,
//     'Cancelled': <X />
// };

const AdminOrdersPage = ({ orders }: { orders: Order[] }) => {
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(
    null
  );
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.address?.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (id: string, status: string) => {
    try {
    } catch (error) {}
  };

  // const handleStatusChange = (orderId: string, newStatus: string) => {
  //   // In a real app, this would update the status in the backend
  //   console.log(`Updating order ${orderId} status to ${newStatus}`);
  // };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the email using a service like Resend
    console.log("Sending email:", {
      to: selectedOrder?.address?.email,
      subject: emailSubject,
      message: emailMessage,
    });
    setIsEmailModalOpen(false);
    setEmailSubject("");
    setEmailMessage("");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Order Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
            >
              <option value="all">All Statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <Filter
              className="absolute right-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-500">
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
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{order.address?.firstName}</p>
                    <p className="text-sm text-gray-500">
                      {order?.address?.email}
                    </p>
                  </div>
                </td>
                <td
                  className={`px-6 py-4 ${
                    order.paymentStatus == "failed" ||
                    order.paymentStatus == "pending"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {order.paymentStatus}
                </td>
                <td className="px-6 py-4 font-medium">
                  ₹{order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsEmailModalOpen(true);
                      }}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Mail size={20} />
                    </button>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Order Details</h2>
                  <p className="text-gray-500">{selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <p>{selectedOrder?.address?.firstName}</p>
                  <p>{selectedOrder?.address?.email}</p>
                  <h3 className="font-medium mb-1 mt-2">Customer Address</h3>
                  <p className="text-gray-500">
                    {selectedOrder?.address?.firstName}{" "}
                    {selectedOrder?.address?.lastName}
                  </p>
                  <p className="text-gray-500">
                    {selectedOrder?.address?.phone}
                  </p>
                  <p className="text-gray-500">
                    street : {selectedOrder?.address?.street}, city :{" "}
                    {selectedOrder?.address?.city}
                  </p>
                  <p className="text-gray-500">
                    state : {selectedOrder?.address?.state} , pincode :{" "}
                    {selectedOrder?.address?.pincode}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <p>Status: {selectedOrder.status}</p>
                  <p>
                    Date:{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  <p>Total: ₹{selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <h3 className="font-medium mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center border-b pb-4"
                  >
                    <Image
                      src={item.product?.images?.[0]}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded"
                      width={100}
                      height={100}
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{item.product?.name}</h4>
                      <div className="text-sm text-gray-500">
                        <p>Size: {item.size}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Update Order Status</h3>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="pending">Pending</option>
                  <option value="pending">processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {selectedStatus === "shipped" && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Tracking Number</h3>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="Enter Tracking Number"
                  />
                </div>
              )}

              <Button
                onClick={() =>
                  updateOrderStatus(selectedOrder.id, selectedStatus)
                }
                className="mt-4 w-full "
              >
                update order
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {isEmailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
            <form onSubmit={handleSendEmail} className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold">Send Email</h2>
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="text"
                    value={selectedOrder?.address?.email}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
