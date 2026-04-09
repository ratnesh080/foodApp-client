import React, { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FaPaypal } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CheckoutForm = ({ price, cart }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [cardError, setCardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false); // New state for button feedback

  useEffect(() => {
    if (typeof price !== "number" || price < 1) return;
    
    axiosSecure
      .post("/create-payment-intent", { cartItems: cart.map((item) => item._id) })
      .then((res) => {
      setClientSecret(res.data?.data?.clientSecret || res.data?.clientSecret);
      });
  }, [price, cart, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (card == null) return;

    setProcessing(true); // Start loading

    // 1. Create Payment Method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setCardError(error.message);
      setProcessing(false);
      return;
    }

    // 2. Confirm the Payment
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.displayName || "anonymous",
            email: user?.email || "unknown",
          },
        },
      }
    );

    if (confirmError) {
      setCardError(confirmError.message);
      setProcessing(false);
      return;
    }

    // 3. Handle Success
    if (paymentIntent.status === "succeeded") {
      const paymentInfo = {
        transactionId: paymentIntent.id,
        cartItems: cart.map((item) => item._id),
      };

      // Send to backend and navigate
      try {
        const res = await axiosSecure.post("/payments", paymentInfo);
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: `Transaction ID: ${paymentIntent.id}`,
          });
          navigate("/order");
        }
      } catch (err) {
        console.error("Backend error:", err);
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-start gap-8">
      <div className="md:w-1/2 w-full space-y-3">
        <h4 className="text-lg text-green font-semibold italic">Order Summary</h4>
        <p className="text-black font-medium">Total Price: ${price.toFixed(2)}</p>
        <p className="text-black font-medium">Number of Items: {cart.length}</p>
      </div>

      <div className="md:w-1/2 w-full space-y-3 card shrink-0 shadow-2xl bg-base-100 px-4 py-8">
        <h4 className="text-lg font-semibold">Process your payment</h4>
        <h5 className="font-medium text-sm text-gray-500">Credit/Debit Card</h5>

        <form onSubmit={handleSubmit}>
          <div className="border p-3 rounded-md bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
                },
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!stripe || !clientSecret || processing}
            className="btn btn-sm mt-5 bg-green btn-primary w-full text-white border-none"
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
        </form>

        {cardError && <p className="text-red-600 text-xs italic mt-2">{cardError}</p>}

        <div className="mt-5 text-center">
          <hr className="mb-4" />
          <button type="button" className="btn btn-sm bg-blue-600 hover:bg-blue-800 text-white w-full">
            <FaPaypal /> Pay with PayPal
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;