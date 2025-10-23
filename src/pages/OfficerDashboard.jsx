// src/pages/OfficerDashboard.jsx - FIXED ALL ERRORS

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../services/firebase";
import Navbar from "../components/common/Navbar";
import PendingComplaints from "../components/officer/PendingComplaints";
import ComplaintMap from "../components/officer/ComplaintMap";
import toast from "react-hot-toast";
import Statistics from "../components/officer/Statistics";

const OfficerDashboard = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const fetchAllComplaints = async () => {
    setLoading(true);
    console.log("🔍 Fetching ALL complaints for officer...");

    try {
      // Get ALL complaints - no filters!
      const complaintsRef = collection(db, "complaints");
      const q = query(complaintsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedComplaints = [];
      querySnapshot.forEach((doc) => {
        fetchedComplaints.push({ id: doc.id, ...doc.data() });
      });

      console.log(
        `✅ Fetched ${fetchedComplaints.length} complaints:`,
        fetchedComplaints
      );
      setComplaints(fetchedComplaints);

      // Calculate stats
      const newStats = {
        total: fetchedComplaints.length,
        pending: fetchedComplaints.filter(
          (c) => c.status === "pending" || c.status === "assigned"
        ).length,
        inProgress: fetchedComplaints.filter((c) => c.status === "in-progress")
          .length,
        resolved: fetchedComplaints.filter(
          (c) => c.status === "resolved" || c.status === "closed"
        ).length,
      };

      console.log("📊 Stats:", newStats);
      setStats(newStats);
    } catch (error) {
      console.error("❌ Error fetching complaints:", error);
      toast.error("Error loading complaints: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading officer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Officer Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome, {userData?.name}!
            {userData?.region && ` • Region: ${userData.region}`}
          </p>
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Complaints"
              value={stats.total}
              icon="📊"
              color="bg-blue-500"
            />
            <StatCard
              title="Pending"
              value={stats.pending}
              icon="⏳"
              color="bg-yellow-500"
            />
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              icon="🔧"
              color="bg-orange-500"
            />
            <StatCard
              title="Resolved"
              value={stats.resolved}
              icon="✅"
              color="bg-green-500"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b overflow-x-auto">
            <TabButton
              label="Pending Complaints"
              icon="📋"
              active={activeTab === "pending"}
              onClick={() => setActiveTab("pending")}
            />
            <TabButton
              label="Map View"
              icon="🗺️"
              active={activeTab === "map"}
              onClick={() => setActiveTab("map")}
            />
            <TabButton
              label="Statistics"
              icon="📈"
              active={activeTab === "statistics"}
              onClick={() => setActiveTab("statistics")}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No Complaints Yet
            </h3>
            <p className="text-gray-600">
              No complaints have been submitted yet
            </p>
            <button
              onClick={fetchAllComplaints}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              🔄 Refresh
            </button>
          </div>
        ) : (
          <div>
            {activeTab === "pending" && (
              <PendingComplaints
                complaints={complaints}
                onUpdate={fetchAllComplaints}
              />
            )}
            {activeTab === "map" && <ComplaintMap complaints={complaints} />}
            {activeTab === "statistics" && (
              <Statistics complaints={complaints} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      </div>
      <div
        className={`text-4xl ${color} w-16 h-16 rounded-lg flex items-center justify-center bg-opacity-20`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const TabButton = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 py-4 px-6 text-center font-medium transition-colors whitespace-nowrap ${
      active
        ? "border-b-2 border-blue-500 text-blue-600"
        : "text-gray-600 hover:text-gray-800"
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

export default OfficerDashboard;
