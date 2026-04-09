import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { MdDashboard, MdDashboardCustomize } from "react-icons/md";
import {
  FaEdit,
  FaLocationArrow,
  FaPlusCircle,
  FaQuestionCircle,
  FaRegUser,
  FaShoppingBag,
  FaUser,
} from "react-icons/fa";

import logo from "/logo.png";
import { FaCartShopping } from "react-icons/fa6";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const DashboardLayout = () => {
  const { loading, logOut, user } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const axiosSecure = useAxiosSecure();
  const [activating, setActivating] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut()
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'See you next time!',
          showConfirmButton: false,
          timer: 1500
        });
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  const handleActivateAdmin = async () => {
    try {
      setActivating(true);
      await axiosSecure.post("/users/bootstrap-admin");
      Swal.fire({
        icon: "success",
        title: "Admin access activated",
        text: "Reloading dashboard...",
        timer: 1200,
        showConfirmButton: false,
      });
      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Activation failed",
        text: error?.response?.data?.message || error.message,
      });
    } finally {
      setActivating(false);
    }
  };

  const sharedLinks = (
    <>
      <li className="mt-3">
        <Link to="/"><MdDashboard /> Home</Link>
      </li>
      <li>
        <Link to="/menu"><FaCartShopping /> Menu</Link>
      </li>
      <li>
        <Link to="/order"><FaLocationArrow /> Orders Tracking</Link>
      </li>
      <li>
        <Link to="/dashboard/contact"><FaQuestionCircle /> Customer Support</Link>
      </li>
    </>
  );

  // Show a clean loading state instead of jumping to Login UI
  if (loading || isAdminLoading) {
    return <div className="h-screen flex justify-center items-center font-bold">Loading Admin Panel...</div>;
  }

  return (
    <div>
      {isAdmin ? (
        <div className="drawer sm:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2">
            
            {/* Navbar for Mobile */}
            <div className="flex items-center justify-between mx-4 w-full md:w-auto">
              <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                <MdDashboardCustomize />
              </label>
              
              <button 
                onClick={handleLogout}
                className="btn rounded-full px-6 bg-green flex items-center gap-2 text-white sm:hidden mr-4"
              >
                <FaRegUser /> Logout
              </button>
            </div>

            <div className="mt-5 md:mt-2 mx-4 w-full">
              <Outlet />
            </div>
          </div>

          <div className="drawer-side">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
              <li>
                <Link to="/dashboard" className="flex justify-start mb-3">
                  <img src={logo} alt="Logo" className="w-20" />
                  <span className="badge badge-primary">Admin</span>
                </Link>
              </li>
              <hr />
              <li className="mt-3"><Link to="/dashboard"><MdDashboard /> Dashboard</Link></li>
              <li><Link to="/dashboard/bookings"><FaShoppingBag /> Manage Bookings</Link></li>
              <li><Link to="/dashboard/add-menu"><FaPlusCircle /> Add Menu</Link></li>
              <li><Link to="/dashboard/manage-items"><FaEdit /> Manage Items</Link></li>
              <li className="mb-3"><Link to="/dashboard/users"><FaUser /> All Users</Link></li>

              <hr />
              {sharedLinks}
              
              {/* Desktop Logout Button */}
              <li className="mt-auto">
                <button onClick={handleLogout} className="text-red font-semibold hover:bg-red hover:text-white transition-all">
                   <FaRegUser /> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="h-screen flex flex-col gap-4 justify-center items-center">
          <p className="text-xl font-bold text-red">Access Denied: Admin Only</p>
          <p className="text-sm text-gray-500">Signed in as: {user?.email || "unknown user"}</p>
          <button
            className="btn bg-green text-white"
            onClick={handleActivateAdmin}
            disabled={activating}
          >
            {activating ? "Activating..." : "Activate Admin Access"}
          </button>
          <Link to="/">
            <button className="btn bg-green text-white">Back to Home</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;