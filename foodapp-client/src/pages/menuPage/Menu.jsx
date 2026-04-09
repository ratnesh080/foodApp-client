import React, { useMemo, useState } from "react";
import Cards from "../../components/Cards";
import { FaFilter } from "react-icons/fa";
import useMenu from "../../hooks/useMenu"; // Import your custom hook
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import Swal from "sweetalert2";

const Menu = () => {
  const [menu, loading] = useMenu(); // Use the hook instead of local fetch
  const [cart] = useCart();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const filteredItems = useMemo(() => {
    const byCategory =
      selectedCategory === "all"
        ? [...menu]
        : menu.filter((item) => item.category === selectedCategory);

    switch (sortOption) {
      case "A-Z":
        return byCategory.sort((a, b) => a.name.localeCompare(b.name));
      case "Z-A":
        return byCategory.sort((a, b) => b.name.localeCompare(a.name));
      case "low-to-high":
        return byCategory.sort((a, b) => a.price - b.price);
      case "high-to-low":
        return byCategory.sort((a, b) => b.price - a.price);
      default:
        return byCategory;
    }
  }, [menu, selectedCategory, sortOption]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {/* Banner Section */}
      <div className="section-container bg-gradient-to-r from-[#FAFAFA] to-[#FCFCFC]">
        <div className="py-20 md:py-24 flex flex-col items-center justify-center">
          <div className="text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold">
              For the Love of Delicious <span className="text-green">Food</span>
            </h2>
            <p className="text-[#4A4A4A] text-xl md:w-4/5 mx-auto">
              Explore our curated menu and enjoy flavors from around the world.
            </p>
            <button
              className="bg-green font-semibold btn text-white px-8 py-3 rounded-full"
              onClick={() => {
                if (!cart?.length) {
                  Swal.fire({
                    icon: "warning",
                    title: "Cart is empty",
                    text: "Please add items to cart first.",
                  });
                  return;
                }
                navigate("/cart-page");
              }}
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Shop Section */}
      <div className="section-container py-12">
        <div className="flex flex-col md:flex-row flex-wrap md:justify-between items-center space-y-3 mb-8">
          
          {/* Category Buttons */}
          <div className="flex flex-row justify-start md:items-center md:gap-8 gap-4 flex-wrap">
            {["all", "salad", "pizza", "soup", "dessert", "drinks"].map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`${selectedCategory === category ? "text-green underline font-bold" : ""} capitalize`}
              >
                {category === "soup" ? "Soups" : category}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex justify-end mb-4 rounded-sm">
            <div className="bg-black p-2"><FaFilter className="text-white h-4 w-4" /></div>
            <select
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              value={sortOption}
              className="bg-black text-white px-2 py-1 rounded-sm outline-none"
            >
              <option value="default">Default</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
            <div className="flex justify-center py-20">Loading Menu...</div>
        ) : (
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
              {currentItems.map((item) => (
                <Cards key={item._id} item={item} />
              ))}
            </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center my-8 flex-wrap gap-2">
        {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-3 py-1 rounded-full transition-all ${
              currentPage === index + 1 ? "bg-green text-white scale-110" : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Menu;