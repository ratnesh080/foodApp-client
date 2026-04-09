import React, { useContext, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from "sweetalert2";
import useCart from "../hooks/useCart";
import useAxiosSecure from "../hooks/useAxiosSecure"; // Using the secure hook

const Cards = ({ item }) => {
  const { name, image, price, recipe, _id } = item; // Ensure these match your DB schema

  const { user } = useContext(AuthContext);
  const [cart, refetch] = useCart();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();

  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  // add to cart handler
  const handleAddToCart = () => {
    if (user && user.email) {
      const cartItem = {
        menuItemId: _id,
        name,
        quantity: 1,
        image,
        price,
        email: user.email,
      };

      // Using axiosSecure handles the base URL and Authorization header
      axiosSecure
        .post("/carts", cartItem)
        .then((response) => {
          if (response.data) {
            refetch(); // Global cart count update
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Added to cart!",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || "Something went wrong";
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: errorMessage,
            buttonsStyling: true,
      customClass: {
    confirmButton: 'btn bg-green text-white border-none mx-2', // Adding your own classes
    cancelButton: 'btn bg-red text-white border-none mx-2'
  }
          });
        });
    } else {
      Swal.fire({
        title: "Please login to order",
        text: "You need an account to add items to your cart!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#39DB4A",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login now!",
        buttonsStyling: true,
      customClass: {
    confirmButton: 'btn bg-green text-white border-none mx-2', // Adding your own classes
    cancelButton: 'btn bg-red text-white border-none mx-2'
  }
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
    }
  };

  return (
    <div className="card shadow-xl relative mr-5 md:my-5 bg-white border border-gray-100">
      {/* Heart Icon */}
      <div
        className={`rating gap-1 absolute right-0 top-0 p-4 heartStar bg-green rounded-tr-2xl rounded-bl-3xl ${
          isHeartFilled ? "text-rose-500" : "text-white"
        }`}
        onClick={handleHeartClick}
      >
        <FaHeart className="w-5 h-5 cursor-pointer transition-colors duration-200" />
      </div>

      {/* Product Image */}
      <Link to={`/menu/${_id}`}>
        <figure className="overflow-hidden ">
          <img
            src={image}
            alt={name}
            className=" md:h-72 w-full object-cover"
          />
        </figure>
      </Link>

      {/* Content */}
      <div className="card-body p-5">
        <Link to={`/menu/${_id}`}>
          <h2 className="card-title text-xl font-bold">{name}</h2>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2">
          {recipe || "Delicious and freshly prepared just for you."}
        </p>
        
        <div className="card-actions justify-between items-center mt-4">
          <h5 className="font-bold text-lg">
            <span className="text-sm text-red">$</span> {price}
          </h5>
          <button
            onClick={handleAddToCart}
            className="btn bg-green border-none text-white hover:bg-emerald-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;