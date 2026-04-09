import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ORDER_STATUSES = [
  "Order pending",
  "Preparing",
  "On the way",
  "Delivered",
  "Cancelled",
];
const ALLOWED_TRANSITIONS = {
  "Order pending": ["Preparing", "Cancelled"],
  Preparing: ["On the way", "Cancelled"],
  "On the way": ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
};

const getStatusBadgeClass = (status) => {
  if (status === "Delivered") return "bg-green-500 text-white";
  if (status === "On the way") return "bg-blue-500 text-white";
  if (status === "Preparing") return "bg-yellow-500 text-white";
  if (status === "Cancelled") return "bg-red-500 text-white";
  return "bg-orange-400 text-white";
};

const ManageBookings = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["admin-orders", statusFilter],
    queryFn: async () => {
      const query = statusFilter === "all" ? "" : `?status=${encodeURIComponent(statusFilter)}`;
      const res = await axiosSecure.get(`/payments/admin-orders${query}`);
      return res.data?.data || {};
    },
  });

  const orders = data?.items || [];

  const handleStatusUpdate = async (orderId, nextStatus) => {
    const key = ["admin-orders", statusFilter];
    const previous = queryClient.getQueryData(key);
    queryClient.setQueryData(key, (old) => {
      if (!old?.items) return old;
      return {
        ...old,
        items: old.items.map((order) =>
          order._id === orderId ? { ...order, status: nextStatus } : order
        ),
      };
    });
    try {
      await axiosSecure.patch(`/payments/${orderId}/status`, { status: nextStatus });
      Swal.fire({
        icon: "success",
        title: "Order updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      queryClient.setQueryData(key, previous);
      Swal.fire({
        icon: "error",
        title: "Failed to update order",
        text: error?.response?.data?.message || error.message,
      });
    } finally {
      refetch();
    }
  };

  return (
    <div className="w-full md:w-[950px] px-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-4">
        <h2 className="text-2xl font-semibold">
          Manage <span className="text-green">Bookings</span>
        </h2>
        <select
          className="select select-bordered max-w-xs"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {isPending ? (
        <div className="py-20 text-center">Loading orders...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-green text-white">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Transaction</th>
                <th>Amount</th>
                <th>Items</th>
                <th>Status</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order._id}>
                  <td>{idx + 1}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>{order.email}</td>
                  <td className="font-mono text-xs">{order.transactionId || "-"}</td>
                  <td>${Number(order.price || 0).toFixed(2)}</td>
                  <td>{order.quantity}</td>
                  <td>
                    <span
                      className={`badge border-none mb-2 ${getStatusBadgeClass(order.status)}`}
                    >
                      {order.status}
                    </span>
                    <select
                      className="select select-bordered select-sm"
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option
                          key={status}
                          value={status}
                          disabled={
                            status !== order.status &&
                            !(ALLOWED_TRANSITIONS[order.status] || []).includes(status)
                          }
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-xs bg-green text-white border-none"
                      disabled={order.status !== "On the way"}
                      onClick={() => handleStatusUpdate(order._id, "Delivered")}
                    >
                      Mark Delivered
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    No orders found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
