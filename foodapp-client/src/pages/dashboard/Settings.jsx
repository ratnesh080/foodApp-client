import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";

const Settings = () => {
  const { user } = useAuth();
  const [cart] = useCart();

  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotionalOffers: false,
    darkMode: false,
  });

  const initials = useMemo(() => {
    if (!user?.displayName) return "U";
    return user.displayName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user?.displayName]);

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    Swal.fire({
      icon: "success",
      title: "Settings saved",
      text: "Your preferences have been updated for this session.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="min-h-screen bg-base-100 px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-green">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account and app preferences.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1 bg-base-200 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-green text-white flex items-center justify-center font-bold">
                  {initials}
                </div>
              )}
              <div>
                <p className="font-semibold">{user?.displayName || "User"}</p>
                <p className="text-xs text-gray-500">{user?.email || "No email"}</p>
              </div>
            </div>

            <div className="divider my-4" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Items in cart</span>
                <span className="font-semibold">{cart?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Account type</span>
                <span className="font-semibold">Customer</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-base-200 rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Preferences</h2>
            <p className="text-sm text-gray-500 mb-4">
              Choose how you want to interact with updates and offers.
            </p>

            <div className="space-y-4">
              <label className="flex items-center justify-between bg-base-100 rounded-xl p-3">
                <span>Order status updates</span>
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={preferences.orderUpdates}
                  onChange={() => handleToggle("orderUpdates")}
                />
              </label>

              <label className="flex items-center justify-between bg-base-100 rounded-xl p-3">
                <span>Promotional offers</span>
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={preferences.promotionalOffers}
                  onChange={() => handleToggle("promotionalOffers")}
                />
              </label>

              <label className="flex items-center justify-between bg-base-100 rounded-xl p-3">
                <span>Dark mode (preview)</span>
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={preferences.darkMode}
                  onChange={() => handleToggle("darkMode")}
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={handleSave} className="btn bg-green text-white">
                Save Changes
              </button>
              <Link to="/update-profile" className="btn btn-outline">
                Edit Profile
              </Link>
              <Link to="/order" className="btn btn-ghost">
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
