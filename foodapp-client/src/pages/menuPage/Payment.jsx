import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import useCart from "../../hooks/useCart";

// Make sure the variable name matches your .env file exactly
const stripePromise = loadStripe(import.meta.env.VITE_Stripe_PK);

const Payment = () => {
  const [cart] = useCart();

  // FIX: Calculate total price by multiplying price * quantity
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalPrice = parseFloat(cartTotal.toFixed(2));

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-28">
      <div className="flex flex-col items-center justify-center mb-10">
        <h2 className="text-3xl font-bold">Complete Your <span className="text-green">Payment</span></h2>
        <p className="text-gray-500 mt-2">Please enter your card details to finalize the order.</p>
      </div>

      {/* Stripe Elements Wrapper */}
      <Elements stripe={stripePromise}>
        {/* Pass the correct total price and cart items to the form */}
        <CheckoutForm price={totalPrice} cart={cart} />
      </Elements>
    </div>
  );
};

export default Payment;