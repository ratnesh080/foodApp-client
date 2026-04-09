import React from "react";
import { Link } from "react-router-dom";

const offers = [
  {
    id: 1,
    title: "Flat 20% Off on First Order",
    code: "WELCOME20",
    description: "New users get 20% off up to $10 on their very first order.",
  },
  {
    id: 2,
    title: "Free Delivery Friday",
    code: "FREEFRIDAY",
    description: "No delivery fee on orders above $15 every Friday.",
  },
  {
    id: 3,
    title: "Buy 2 Get 1 on Popular",
    code: "POPULAR3",
    description: "Add 3 popular dishes and pay for only 2 (lowest priced item free).",
  },
];

const Offers = () => {
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-24">
      <div className="text-center mb-10">
        <p className="subtitle">Special Deals</p>
        <h2 className="title">Today's Offers</h2>
        <p className="text-gray-500 mt-3">Use these promo codes at checkout.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">{offer.title}</h3>
            <p className="text-gray-500 mt-2 text-sm">{offer.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="badge bg-green text-white border-none px-4 py-3">{offer.code}</span>
              <Link to="/menu" className="text-green font-semibold">
                Order now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
