import React from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import bannerImg from "/images/home/banner.png";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 bg-gradient-to-r from-[#FAFAFA] to-[#FCFCFC]">
      <div className="py-24 flex flex-col md:flex-row-reverse items-center justify-between gap-8">
        
        {/* Right side: Images & Floating Cards */}
        <div className="md:w-1/2">
          <img className="rounded-full w-full" src={bannerImg} alt="Delicious Food Banner" />
          
          <div className="flex flex-col md:flex-row items-center justify-around -mt-14 gap-4">
            {/* Food Card 1 */}
            <div className="bg-white px-3 py-2 rounded-2xl flex items-center gap-3 shadow-md w-64 border border-gray-100">
              <img
                src="/images/home/b-food1.png"
                alt="Spicy Noodles"
                className="rounded-2xl w-20"
              />
              <div className="space-y-1">
                <h5 className="font-semibold">Spicy noodles</h5>
                <div className="rating rating-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <input
                      key={`card1-star-${star}`}
                      type="radio"
                      name="rating-card-1" // Unique name for this card
                      className="mask mask-star-2 bg-orange-500"
                      checked={star === 3}
                      readOnly
                    />
                  ))}
                </div>
                <p className="text-red font-bold">$18.00</p>
              </div>
            </div>

            {/* Food Card 2 - Hidden on small screens */}
            <div className="bg-white px-3 py-2 rounded-2xl md:flex items-center gap-3 shadow-md w-64 hidden border border-gray-100">
              <img
                src="/images/home/b-food1.png"
                alt="Vegetarian Pasta"
                className="rounded-2xl w-20"
              />
              <div className="space-y-1">
                <h5 className="font-semibold">Vegetarian pasta</h5>
                <div className="rating rating-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <input
                      key={`card2-star-${star}`}
                      type="radio"
                      name="rating-card-2" // Unique name for this card
                      className="mask mask-star-2 bg-orange-500"
                      checked={star === 4}
                      readOnly
                    />
                  ))}
                </div>
                <p className="text-red font-bold">$15.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Left side: Hero Texts */}
        <div className="md:w-1/2 px-4 space-y-7">
          <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
            Dive into Delights Of Delectable{" "}
            <span className="text-green">Food</span>
          </h2>
          <p className="text-[#4A4A4A] text-xl">
            Where Each Plate Weaves a Story of Culinary Mastery and Passionate
            Craftsmanship.
          </p>
          <button 
            onClick={() => navigate("/menu")}
            className="bg-green font-semibold btn text-white px-8 py-3 rounded-full border-none hover:bg-emerald-600 transition-all"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;