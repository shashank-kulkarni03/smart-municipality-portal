// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getComplaints } from "../services/complaints";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import Navbar from "../components/common/Navbar";
import FilterComplaints from "../components/admin/FilterComplaints";
import RegionView from "../components/admin/RegionView";
import Statistics from "../components/admin/Statistics";
import MonthlyReport from "../components/admin/MonthlyReport";

const AdminDashboard = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pending: 0,
    resolved: 0,
    totalOfficers: 0,
    avgResolutionTime: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch all complaints
    const complaintsResult = await getComplaints({});
    if (complaintsResult.success) {
      setComplaints(complaintsResult.complaints);
      calculateStats(complaintsResult.complaints);
    }

    // Fetch all officers
    const officersQuery = query(
      collection(db, "users"),
      where("role", "==", "officer")
    );
    const officersSnapshot = await getDocs(officersQuery);
    const officersList = [];
    officersSnapshot.forEach((doc) => {
      officersList.push({ id: doc.id, ...doc.data() });
    });
    setOfficers(officersList);
  };

  const calculateStats = (complaints) => {
    const stats = {
      totalComplaints: complaints.length,
      pending: complaints.filter(
        (c) => c.status === "pending" || c.status === "assigned"
      ).length,
      resolved: complaints.filter(
        (c) => c.status === "resolved" || c.status === "closed"
      ).length,
      totalOfficers: officers.length,
      avgResolutionTime: 0, // Calculate based on resolved complaints
    };
    setStats(stats);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            District Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Oversee all municipality operations
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Complaints"
            value={stats.totalComplaints}
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
            title="Resolved"
            value={stats.resolved}
            icon="✅"
            color="bg-green-500"
          />
          <StatCard
            title="Total Officers"
            value={officers.length}
            icon="👥"
            color="bg-purple-500"
          />
          <StatCard
            title="Avg Resolution"
            value="2.5 days"
            icon="⚡"
            color="bg-orange-500"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b overflow-x-auto">
            <TabButton
              label="Overview"
              icon="📊"
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
            <TabButton
              label="Filter Complaints"
              icon="🔍"
              active={activeTab === "filter"}
              onClick={() => setActiveTab("filter")}
            />
            <TabButton
              label="Regions & Officers"
              icon="🗺️"
              active={activeTab === "regions"}
              onClick={() => setActiveTab("regions")}
            />
            <TabButton
              label="Statistics"
              icon="📈"
              active={activeTab === "statistics"}
              onClick={() => setActiveTab("statistics")}
            />
            <TabButton
              label="Monthly Report"
              icon="📄"
              active={activeTab === "report"}
              onClick={() => setActiveTab("report")}
            />
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === "overview" && (
            <OverviewTab complaints={complaints} officers={officers} />
          )}
          {activeTab === "filter" && (
            <FilterComplaints complaints={complaints} onRefresh={fetchData} />
          )}
          {activeTab === "regions" && (
            <RegionView officers={officers} complaints={complaints} />
          )}
          {activeTab === "statistics" && <Statistics complaints={complaints} />}
          {activeTab === "report" && (
            <MonthlyReport complaints={complaints} officers={officers} />
          )}
        </div>
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

// Overview Tab
const OverviewTab = ({ complaints, officers }) => {
  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="grid gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Complaints
        </h2>
        <div className="space-y-3">
          {recentComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {complaint.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {complaint.category} • {complaint.region}
                  </p>
                </div>
                <StatusBadge status={complaint.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Officer Performance
        </h2>
        <div className="space-y-3">
          {officers.slice(0, 5).map((officer) => {
            // Fix: Filter complaints properly
            const officerComplaints = complaints.filter(
              (c) =>
                c.assignedOfficer === officer.uid ||
                c.assignedOfficer === officer.id
            );
            const resolved = officerComplaints.filter(
              (c) => c.status === "resolved"
            ).length;

            return (
              <div
                key={officer.id || officer.uid}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {officer.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {officer.region || "General"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {resolved}/{officerComplaints.length} Resolved
                  </p>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          officerComplaints.length
                            ? (resolved / officerComplaints.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    assigned: "bg-blue-100 text-blue-700",
    "in-progress": "bg-orange-100 text-orange-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        colors[status] || colors.pending
      }`}
    >
      {status}
    </span>
  );
};

export default AdminDashboard;
