import React from "react";
import { FaEnvelope, FaHeadset, FaPhoneAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Request submitted",
      text: "Our support team will get back to you shortly.",
      timer: 1600,
      showConfirmButton: false,
    });
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-base-100 px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green">Customer Support</h1>
          <p className="text-gray-500 mt-2">
            Need help with orders, payments, or account access? We are here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-base-200 rounded-xl p-5">
            <div className="text-green text-xl mb-2">
              <FaHeadset />
            </div>
            <p className="font-semibold">Live Chat</p>
            <p className="text-sm text-gray-500 mt-1">Available 9:00 AM - 10:00 PM</p>
          </div>
          <div className="bg-base-200 rounded-xl p-5">
            <div className="text-green text-xl mb-2">
              <FaPhoneAlt />
            </div>
            <p className="font-semibold">Call Support</p>
            <p className="text-sm text-gray-500 mt-1">+91 98765 43210</p>
          </div>
          <div className="bg-base-200 rounded-xl p-5">
            <div className="text-green text-xl mb-2">
              <FaEnvelope />
            </div>
            <p className="font-semibold">Email</p>
            <p className="text-sm text-gray-500 mt-1">support@foodapp.com</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-base-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Common Questions</h2>
            <div className="space-y-3">
              <div className="collapse collapse-arrow bg-base-100">
                <input type="checkbox" />
                <div className="collapse-title font-medium">My order is delayed. What should I do?</div>
                <div className="collapse-content text-sm text-gray-600">
                  Track your order from the Orders page. If it exceeds the estimated time, contact support with your order ID.
                </div>
              </div>
              <div className="collapse collapse-arrow bg-base-100">
                <input type="checkbox" />
                <div className="collapse-title font-medium">I was charged but order is not confirmed.</div>
                <div className="collapse-content text-sm text-gray-600">
                  Payments usually sync in 1-2 minutes. If not, submit a ticket below and include your transaction ID.
                </div>
              </div>
              <div className="collapse collapse-arrow bg-base-100">
                <input type="checkbox" />
                <div className="collapse-title font-medium">How can I update my profile details?</div>
                <div className="collapse-content text-sm text-gray-600">
                  Go to Profile from your account menu and update your name or photo.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-base-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Raise a Support Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Subject"
                className="input input-bordered w-full"
                required
              />
              <select className="select select-bordered w-full" defaultValue="default" required>
                <option value="default" disabled>
                  Select issue type
                </option>
                <option value="order">Order issue</option>
                <option value="payment">Payment issue</option>
                <option value="account">Account issue</option>
                <option value="other">Other</option>
              </select>
              <textarea
                className="textarea textarea-bordered w-full h-32"
                placeholder="Describe your issue"
                required
              />
              <button type="submit" className="btn bg-green text-white">
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
