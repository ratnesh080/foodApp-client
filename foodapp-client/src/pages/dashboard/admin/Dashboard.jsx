import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaDollarSign, FaUsers, FaUtensils, FaBook } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch admin stats from backend
  const { data: stats = {} } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data?.data || res.data;
    },
  });

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Hi, {user?.displayName}! <span className="text-green">Welcome Back.</span>
      </h2>

      {/* Stats Cards */}
      <div className="stats shadow flex flex-col md:flex-row w-full bg-base-100 mt-8">
        
        <div className="stat border-b md:border-b-0 md:border-r">
          <div className="stat-figure text-secondary">
            <FaDollarSign className="text-3xl" />
          </div>
          <div className="stat-title">Revenue</div>
          <div className="stat-value text-secondary">${stats.revenue || 0}</div>
          <div className="stat-desc">Jan 1st - Now</div>
        </div>

        <div className="stat border-b md:border-b-0 md:border-r">
          <div className="stat-figure text-primary">
            <FaUsers className="text-3xl" />
          </div>
          <div className="stat-title">Users</div>
          <div className="stat-value text-primary">{stats.users || 0}</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>

        <div className="stat border-b md:border-b-0 md:border-r">
          <div className="stat-figure text-green">
            <FaUtensils className="text-3xl" />
          </div>
          <div className="stat-title">Menu Items</div>
          <div className="stat-value text-green">{stats.menuItems || 0}</div>
          <div className="stat-desc">Current active menu</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-orange-500">
            <FaBook className="text-3xl" />
          </div>
          <div className="stat-title">Orders</div>
          <div className="stat-value text-orange-500">{stats.orders || 0}</div>
          <div className="stat-desc">Completed transactions</div>
        </div>

      </div>
      
      {/* You could add a chart here later */}
      <div className="mt-12 p-8 bg-gray-100 rounded-lg text-center">
         <p className="text-gray-500 italic">"Management is doing things right; leadership is doing the right things."</p>
      </div>
    </div>
  );
};

export default Dashboard;