import React, { useEffect, useState } from "react";
import logo from "/logo.png";
import { FaRegUser } from "react-icons/fa";
import Modal from "./Modal";
import Profile from "./Profile";
import { Link, NavLink } from "react-router-dom"; // Switched to NavLink/Link
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const { user } = useAuth();
  const [cart] = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setSticky(offset > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = (
    <>
      <li>
        <NavLink to="/" className={({ isActive }) => isActive ? "text-green font-bold" : ""}>Home</NavLink>
      </li>
      <li>
        <NavLink to="/menu" className={({ isActive }) => isActive ? "text-green font-bold" : ""}>Menu</NavLink>
      </li>
      <li>
        <NavLink to="/order" className={({ isActive }) => isActive ? "text-green font-bold" : ""}>
          Order Tracking
        </NavLink>
      </li>
      <li><Link to="/offers">Offers</Link></li>
    </>
  );

  return (
    <header className="max-w-screen-2xl container mx-auto fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out">
      <div className={`navbar xl:px-24 ${isSticky ? "shadow-md bg-base-100" : ""}`}>
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64 space-y-3">
              {navItems}
            </ul>
          </div>
          <Link to="/">
            <img src={logo} alt="Logo" className="w-16 md:w-20" />
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>

        <div className="navbar-end">
          {/* Search Button */}
          <button className="btn btn-ghost btn-circle hidden sm:flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Shopping Cart - Always visible on mobile now */}
          <Link to="/cart-page">
            <div className="btn btn-ghost btn-circle flex items-center justify-center mr-3">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="badge badge-sm indicator-item bg-green text-white border-none">
                  {cart?.length || 0}
                </span>
              </div>
            </div>
          </Link>

          {/* Auth Section */}
          {user ? (
            <Profile user={user} />
          ) : (
            <button
              onClick={() => document.getElementById("my_modal_5").showModal()}
              className="btn flex items-center gap-2 rounded-full px-5 bg-green text-white border-none"
            >
              <FaRegUser className="hidden sm:inline" /> Login
            </button>
          )}
          <Modal />
        </div>
      </div>
    </header>
  );
};

export default Navbar;