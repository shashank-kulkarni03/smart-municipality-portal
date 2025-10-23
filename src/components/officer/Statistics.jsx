// src/components/officer/Statistics.jsx
// ========================================

import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";

const Statistics = ({ complaints }) => {
  // Status distribution data
  const statusData = [
    {
      name: "Pending",
      value: complaints.filter((c) => c.status === "pending").length,
      color: "#fbbf24",
    },
    {
      name: "In Progress",
      value: complaints.filter((c) => c.status === "in-progress").length,
      color: "#fb923c",
    },
    {
      name: "Resolved",
      value: complaints.filter((c) => c.status === "resolved").length,
      color: "#34d399",
    },
  ];

  // Category distribution
  const categoryData = {};
  complaints.forEach((c) => {
    categoryData[c.category] = (categoryData[c.category] || 0) + 1;
  });

  const categoryChartData = Object.entries(categoryData).map(
    ([name, count]) => ({
      name,
      count,
    })
  );

  // Time series data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, "MMM dd");
    const count = complaints.filter((c) => {
      if (!c.createdAt) return false;
      const complaintDate = c.createdAt.toDate();
      return format(complaintDate, "MMM dd") === dateStr;
    }).length;

    return { date: dateStr, count };
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Complaints"
          value={complaints.length}
          icon="📊"
          color="bg-blue-500"
        />
        <StatCard
          title="Pending"
          value={complaints.filter((c) => c.status === "pending").length}
          icon="⏳"
          color="bg-yellow-500"
        />
        <StatCard
          title="In Progress"
          value={complaints.filter((c) => c.status === "in-progress").length}
          icon="🔧"
          color="bg-orange-500"
        />
        <StatCard
          title="Resolved"
          value={complaints.filter((c) => c.status === "resolved").length}
          icon="✅"
          color="bg-green-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Complaints by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Complaints Over Last 7 Days
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={last7Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            label="Average Resolution Time"
            value="2.5 days"
            icon="⏱️"
          />
          <MetricCard
            label="Resolution Rate"
            value={`${
              complaints.length > 0
                ? Math.round(
                    (complaints.filter((c) => c.status === "resolved").length /
                      complaints.length) *
                      100
                  )
                : 0
            }%`}
            icon="📈"
          />
          <MetricCard
            label="Today's Complaints"
            value={
              complaints.filter((c) => {
                if (!c.createdAt) return false;
                const today = format(new Date(), "yyyy-MM-dd");
                const complaintDate = format(
                  c.createdAt.toDate(),
                  "yyyy-MM-dd"
                );
                return complaintDate === today;
              }).length
            }
            icon="📅"
          />
        </div>
      </div>
    </div>
  );
};

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

const MetricCard = ({ label, value, icon }) => (
  <div className="bg-gray-50 rounded-lg p-4 text-center">
    <div className="text-3xl mb-2">{icon}</div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-sm text-gray-600 mt-1">{label}</p>
  </div>
);

export default Statistics;
