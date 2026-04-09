import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../../src/App.css";
import Footer from "../components/Footer";
import { AuthContext } from "../contexts/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";

const Main = () => {
  const { loading } = useContext(AuthContext);

  return (
    <div className="bg-primaryBG"> {/* Fixed typo: prigmayBG -> primaryBG */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* Navbar stays at the top */}
          <Navbar />
          
          {/* Main content expands to fill space, pushing footer down */}
          <main className="flex-grow">
            <Outlet />
          </main>
          
          {/* Footer stays at the bottom */}
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Main;