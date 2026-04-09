import React, { useContext } from "react";
import useCart from "../../hooks/useCart";
import { AuthContext } from "../../contexts/AuthProvider";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const [cart, refetch] = useCart();
  const axiosSecure = useAxiosSecure();

  // Calculate the total price for each item in the cart
  const calculateTotalPrice = (item) => {
    return item.price * item.quantity;
  };

  // Handle quantity increase
  const handleIncrease = async (item) => {
    try {
      const res = await axiosSecure.put(`/carts/${item._id}`, {
        quantity: item.quantity + 1,
      });
      if (res.data) {
        refetch(); // Let useCart handle the state update globally
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Handle quantity decrease
  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      try {
        const res = await axiosSecure.put(`/carts/${item._id}`, {
          quantity: item.quantity - 1,
        });
        if (res.data) {
          refetch();
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else {
        Swal.fire({
            title: "Quantity cannot be less than 1",
            icon: "warning"
        });
    }
  };

  // Calculate the cart subtotal
  const cartSubtotal = cart.reduce((total, item) => {
    return total + calculateTotalPrice(item);
  }, 0);

  // delete an item
  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      buttonsStyling: true,
      customClass: {
    confirmButton: 'btn bg-green text-white border-none mx-2', // Adding your own classes
    cancelButton: 'btn bg-red text-white border-none mx-2'
  }
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/carts/${item._id}`).then((res) => {
          if (res.status === 200) {
            refetch();
            Swal.fire({
              title: "Deleted",
              text: "Item has been removed from cart.",
              buttonsStyling: true,
              customClass: {
              confirmButton: 'btn bg-[#3085d6] text-white border-none mx-2',
              }
            });
          }
        });
      }
    });
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      {/* banner */}
      <div className="bg-gradient-to-r from-[#FAFAFA] to-[#FCFCFC] py-28 flex flex-col items-center justify-center">
          <div className="text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold">
              Items Added to The<span className="text-green"> Cart</span>
            </h2>
          </div>
      </div>

      {/* cart table */}
      {cart.length > 0 ? (
        <div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-green text-white rounded-sm">
                <tr>
                  <th>#</th>
                  <th>Food</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={item.image} alt={item.name} />
                        </div>
                      </div>
                    </td>
                    <td className="font-medium">{item.name}</td>
                    <td className="flex items-center gap-2 py-4">
                      <button className="btn btn-xs" onClick={() => handleDecrease(item)}>-</button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button className="btn btn-xs" onClick={() => handleIncrease(item)}>+</button>
                    </td>
                    <td>${calculateTotalPrice(item).toFixed(2)}</td>
                    <td>
                      <button className="btn btn-sm border-none text-red bg-transparent" onClick={() => handleDelete(item)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start my-12 gap-8">
            <div className="md:w-1/2 space-y-3 p-5 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold border-b pb-2">Customer Details</h3>
              <p>Name: {user?.displayName || "User"}</p>
              <p>Email: {user?.email}</p>
              <p>User ID: <span className="text-xs">{user?.uid}</span></p>
            </div>
            <div className="md:w-1/2 space-y-3 p-5 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold border-b pb-2">Shopping Details</h3>
              <p>Total Items: {cart.length}</p>
              <p>Total Price: <span className="text-green font-bold text-xl ml-2">${cartSubtotal.toFixed(2)}</span></p>
              <Link to="/process-checkout">
                <button className="btn btn-md bg-green text-white w-full mt-4">Procceed to Checkout</button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20 pb-20">
          <p className="text-xl text-gray-500">Cart is empty. Please add products.</p>
          <Link to="/menu"><button className="btn bg-green text-white mt-5">Back to Menu</button></Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;