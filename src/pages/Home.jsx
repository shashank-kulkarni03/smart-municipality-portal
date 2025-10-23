// src/pages/Home.jsx - COMPLETE CORRECTED VERSION

import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ADD THIS COMPONENT (was missing)
const RoleBasedRedirect = () => {
  const { userData } = useAuth();

  if (!userData) {
    return <Navigate to="/login" />;
  }

  switch (userData.role) {
    case "citizen":
      return <Navigate to="/citizen/dashboard" />;
    case "officer":
      return <Navigate to="/officer/dashboard" />;
    case "admin":
      return <Navigate to="/admin/dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
};

const Home = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <RoleBasedRedirect />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="text-8xl mb-6">🏛️</div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Smart Municipality Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Report issues, track complaints, and help improve your community. A
            modern platform connecting citizens with municipal services.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <FeatureCard
            icon="👥"
            title="For Citizens"
            description="Submit complaints with photos and location. Track status in real-time."
            color="bg-blue-500"
          />
          <FeatureCard
            icon="🔧"
            title="For Officers"
            description="Manage assigned complaints efficiently. View on map and update status."
            color="bg-green-500"
          />
          <FeatureCard
            icon="📊"
            title="For Admins"
            description="Monitor all operations. Generate reports and analyze trends."
            color="bg-purple-500"
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-6">
          <Link
            to="/login"
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg border-2 border-blue-600"
          >
            Register Now
          </Link>
        </div>

        {/* Statistics */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem label="Complaints Resolved" value="5000+" />
            <StatItem label="Active Users" value="2500+" />
            <StatItem label="Officers" value="150+" />
            <StatItem label="Regions Covered" value="8" />
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Report Issue"
              description="Take a photo, add location, and submit your complaint in minutes."
            />
            <StepCard
              number="2"
              title="Track Progress"
              description="Get real-time updates as officers work on resolving your complaint."
            />
            <StepCard
              number="3"
              title="Issue Resolved"
              description="Receive notification when your complaint is successfully resolved."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg mb-2">🏛️ Smart Municipality Portal</p>
          <p className="text-gray-400">
            Making cities smarter, one complaint at a time.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <Link
              to="/privacy-policy"
              className="text-gray-400 hover:text-white"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <a
              href="mailto:support@municipality.com"
              className="text-gray-400 hover:text-white"
            >
              Contact Us
            </a>
          </div>
          <p className="text-gray-500 mt-4 text-sm">
            © 2025 All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }) => (
  <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
    <div
      className={`text-5xl mb-4 ${color} w-20 h-20 rounded-full flex items-center justify-center mx-auto bg-opacity-20`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
      {title}
    </h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

const StatItem = ({ label, value }) => (
  <div className="text-center">
    <p className="text-4xl font-bold text-blue-600 mb-2">{value}</p>
    <p className="text-gray-600">{label}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="text-center">
    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;
