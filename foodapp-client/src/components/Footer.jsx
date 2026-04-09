import React from "react";
import { Link } from "react-router-dom"; // Import Link for SPA navigation
import logo from "/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white">
      <div className="max-w-screen-2xl container mx-auto">
        {/* Main Footer Content */}
        <div className="footer xl:px-24 py-10 px-4 text-base-content flex flex-col md:flex-row justify-between">
          <aside className="md:w-1/3">
            <Link to="/">
              <img src={logo} alt="Food App Logo" height="100" width="100" />
            </Link>
            <p className="my-3 text-gray-500">
              Savor the artistry where every dish is a culinary masterpiece, 
              crafted with passion and served with love.
            </p>
          </aside>
          
          <div className="footer md:w-2/3 flex flex-wrap justify-between gap-8">
            <nav>
              <header className="footer-title text-black opacity-100">Useful links</header>
              <Link to="/about" className="link link-hover text-gray-500">About us</Link>
              <Link to="/events" className="link link-hover text-gray-500">Events</Link>
              <Link to="/blogs" className="link link-hover text-gray-500">Blogs</Link>
              <Link to="/faq" className="link link-hover text-gray-500">FAQ</Link>
            </nav>
            
            <nav>
              <header className="footer-title text-black opacity-100">Main Menu</header>
              <Link to="/" className="link link-hover text-gray-500">Home</Link>
              <Link to="/offers" className="link link-hover text-gray-500">Offers</Link>
              <Link to="/menu" className="link link-hover text-gray-500">Menus</Link>
              <Link to="/reservation" className="link link-hover text-gray-500">Reservation</Link>
            </nav>
            
            <nav>
              <header className="footer-title text-black opacity-100">Contact Us</header>
              <a href="mailto:support@foodapp.com" className="link link-hover text-gray-500">support@foodapp.com</a>
              <a href="tel:+64958248966" className="link link-hover text-gray-500">+64 958 248 966</a>
              <Link to="/contact" className="link link-hover text-gray-500">Support Center</Link>
            </nav>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Bottom Bar */}
        <div className="footer items-center xl:px-24 px-4 py-6">
          <aside className="items-center grid-flow-col">
            <p className="text-gray-500 text-sm">
              Copyright © {currentYear} - All rights reserved by FoodApp Ltd.
            </p>
          </aside> 
          
          <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            {/* Social Icons with Links */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-green hover:scale-110 transition-transform">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-green hover:scale-110 transition-transform">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-green hover:scale-110 transition-transform">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;