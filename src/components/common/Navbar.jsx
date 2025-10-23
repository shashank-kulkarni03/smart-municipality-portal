// src/components/common/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/auth";
import toast from "react-hot-toast";

const Navbar = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🏛️</span>
            <span className="text-xl font-bold text-gray-800">
              Municipality Portal
            </span>
          </div>

          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="font-medium text-gray-800">{userData?.name}</p>
                <p className="text-gray-600 capitalize">{userData?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
