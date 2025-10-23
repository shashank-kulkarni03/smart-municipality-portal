// src/pages/CitizenDashboard.jsx - WITH CONTACT BUTTON

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserNotifications } from "../services/notifications";
import ComplaintForm from "../components/citizen/ComplaintForm";
import ComplaintList from "../components/citizen/ComplaintList";
import ContactModal from "../components/citizen/ContactModal";
import Navbar from "../components/common/Navbar";

const CitizenDashboard = () => {
  const [activeTab, setActiveTab] = useState("submit");
  const [refreshKey, setRefreshKey] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const { userData, currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser) return;

    const result = await getUserNotifications(currentUser.uid);
    if (result.success) {
      console.log("📬 Fetched notifications:", result.notifications);
      setNotifications(result.notifications);
    }
  };

  const handleComplaintSubmitted = () => {
    setRefreshKey((prev) => prev + 1);
    setActiveTab("my-complaints");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Contact & Notifications */}
        <div className="mb-8 flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {userData?.name}!
            </h1>
            <p className="text-gray-600 mt-2">
              Submit and track your complaints
            </p>
          </div>

          <div className="flex gap-4">
            {/* Contact Button */}
            <button
              onClick={() => setShowContactModal(true)}
              className="bg-white rounded-lg shadow-md px-6 py-4 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <span className="text-2xl">📞</span>
              <div className="text-left">
                <p className="font-semibold text-gray-800 text-sm">Contact</p>
                <p className="text-xs text-gray-600">Officers & Admin</p>
              </div>
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  fetchNotifications(); // Refresh when opened
                }}
                className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors relative"
              >
                <span className="text-2xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-blue-600 font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <span className="text-4xl block mb-2">📭</span>
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 hover:bg-gray-50 transition-colors ${
                            !notif.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <h4 className="font-medium text-gray-800 text-sm">
                            {notif.title}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {notif.message}
                          </p>
                          <p className="text-gray-400 text-xs mt-2">
                            {notif.createdAt && notif.createdAt.seconds
                              ? new Date(
                                  notif.createdAt.seconds * 1000
                                ).toLocaleString()
                              : "Just now"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("submit")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "submit"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              📝 Submit Complaint
            </button>
            <button
              onClick={() => setActiveTab("my-complaints")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "my-complaints"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              📋 My Complaints
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === "submit" && (
            <ComplaintForm onComplaintSubmitted={handleComplaintSubmitted} />
          )}
          {activeTab === "my-complaints" && <ComplaintList key={refreshKey} />}
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
};

export default CitizenDashboard;
