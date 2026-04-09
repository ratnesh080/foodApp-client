import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure"; // Use the hook we debugged earlier

const getStatusBadgeClass = (status) => {
  if (status === "Delivered") return "bg-green-500 text-white";
  if (status === "On the way") return "bg-blue-500 text-white";
  if (status === "Preparing") return "bg-yellow-500 text-white";
  if (status === "Cancelled") return "bg-red-500 text-white";
  return "bg-orange-400 text-white";
};

const Order = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { refetch, data: orders = [] } = useQuery({
    queryKey: ["orders", user?.email],
    enabled: !!user?.email, // Only fetch if email exists
    queryFn: async () => {
      // Using axiosSecure handles the Authorization header automatically
      const res = await axiosSecure.get(`/payments?email=${user?.email}`);
      return res.data?.data?.items || res.data?.items || res.data?.data || res.data;
    },
  });

  // Calculate total spending for the summary section
  const totalSpending = orders.reduce((total, item) => total + item.price, 0);

  const formatDate = (createdAt) => {
    const createdAtDate = new Date(createdAt);
    return createdAtDate.toLocaleDateString();
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-16">
      <div className="bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-28 flex flex-col items-center justify-center">
          <div className="text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Track All your <span className="text-green">Orders</span>
            </h2>
          </div>
        </div>
      </div>

      <div>
        {orders.length > 0 ? (
          <div>
            <div className="overflow-x-auto mt-10">
              <table className="table">
                <thead className="bg-green text-white rounded-sm">
                  <tr>
                    <th>#</th>
                    <th>Order Date</th>
                    <th>Transaction ID</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td className="font-medium">{formatDate(item.createdAt)}</td>
                      <td className="text-sm font-mono">{item.transactionId}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        <span
                          className={`badge badge-ghost badge-sm border-none p-3 ${getStatusBadgeClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          to="/contact"
                          className="btn btn-sm border-none text-red bg-transparent hover:bg-red hover:text-white"
                        >
                          Contact
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <hr className="my-8" />

            <div className="flex flex-col md:flex-row justify-between items-start my-12 gap-8 bg-gray-50 p-8 rounded-lg">
              <div className="md:w-1/2 space-y-3">
                <h3 className="text-xl font-semibold border-b pb-2">Customer Details</h3>
                <p><span className="font-medium">Name:</span> {user?.displayName || "User"}</p>
                <p><span className="font-medium">Email:</span> {user?.email}</p>
                <p><span className="font-medium">User ID:</span> <span className="text-xs text-gray-500">{user?.uid}</span></p>
              </div>
              <div className="md:w-1/2 space-y-3">
                <h3 className="text-xl font-semibold border-b pb-2">Order Summary</h3>
                <p><span className="font-medium">Total Orders:</span> {orders.length}</p>
                <p><span className="font-medium">Total Investment:</span> 
                  <span className="text-green font-bold ml-2">${totalSpending.toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-20">
            <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
            <Link to="/menu">
              <button className="btn bg-green text-white mt-5">Go to Menu</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;