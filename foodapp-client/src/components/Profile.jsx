import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import avatarImg from "/images/avatar.jpg";
import { Link, useNavigate } from "react-router-dom";
import useAdmin from "../hooks/useAdmin"; // Custom hook to check admin status
import Swal from "sweetalert2";

const Profile = ({ user }) => {
  const { logOut } = useContext(AuthContext);
  const [isAdmin] = useAdmin(); // Get admin status
  const navigate = useNavigate();
  const closeDrawer = () => {
    const drawerToggle = document.getElementById("my-drawer-4");
    if (drawerToggle) {
      drawerToggle.checked = false;
    }
  };

  const handleLogout = () => {
    closeDrawer();
    logOut()
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Logout successful",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <div>
      <div className="drawer drawer-end z-50">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full border border-green">
              {user.photoURL ? (
                <img alt="User Profile" src={user.photoURL} />
              ) : (
                <img alt="Default Avatar" src={avatarImg} />
              )}
            </div>
          </label>
        </div>
        
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content space-y-2">
            {/* User Header */}
            <div className="p-4 mb-2 bg-white rounded-lg shadow-sm text-center">
                <p className="font-bold text-green">{user.displayName || "User"}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            <li>
              <Link to="/update-profile" onClick={closeDrawer}>Profile</Link>
            </li>
            <li>
              <Link to="/order" onClick={closeDrawer}>Orders</Link>
            </li>
            <li>
              <Link to="/settings" onClick={closeDrawer}>Settings</Link>
            </li>

            {/* Conditional Admin Link */}
            {isAdmin && (
              <li>
                <Link to="/dashboard" className="font-semibold" onClick={closeDrawer}>
                  Dashboard
                </Link>
              </li>
            )}

            <li>
              <button 
                onClick={handleLogout} 
                className="text-red hover:bg-red hover:text-white transition-all"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;