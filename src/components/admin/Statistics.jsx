// src/components/admin/Statistics.jsx
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
import { format, subDays, subMonths } from "date-fns";

const AdminStatistics = ({ complaints }) => {
  // Region-wise distribution
  const regionData = {};
  complaints.forEach((c) => {
    regionData[c.region] = (regionData[c.region] || 0) + 1;
  });

  const regionChartData = Object.entries(regionData).map(([name, count]) => ({
    name,
    count,
  }));

  // Status distribution
  const statusData = [
    {
      name: "Pending",
      value: complaints.filter(
        (c) => c.status === "pending" || c.status === "assigned"
      ).length,
      color: "#fbbf24",
    },
    {
      name: "In Progress",
      value: complaints.filter((c) => c.status === "in-progress").length,
      color: "#fb923c",
    },
    {
      name: "Resolved",
      value: complaints.filter(
        (c) => c.status === "resolved" || c.status === "closed"
      ).length,
      color: "#34d399",
    },
  ];

  // Monthly trend (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const monthStr = format(date, "MMM yyyy");
    const count = complaints.filter((c) => {
      if (!c.createdAt) return false;
      const complaintDate = c.createdAt.toDate();
      return format(complaintDate, "MMM yyyy") === monthStr;
    }).length;

    return { month: monthStr, count };
  });

  // Category distribution
  const categoryData = {};
  complaints.forEach((c) => {
    categoryData[c.category] = (categoryData[c.category] || 0) + 1;
  });

  const categoryChartData = Object.entries(categoryData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          title="Total Complaints"
          value={complaints.length}
          icon="📊"
          color="bg-blue-500"
        />
        <StatCard
          title="Pending"
          value={
            complaints.filter(
              (c) => c.status === "pending" || c.status === "assigned"
            ).length
          }
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
          value={
            complaints.filter(
              (c) => c.status === "resolved" || c.status === "closed"
            ).length
          }
          icon="✅"
          color="bg-green-500"
        />
        <StatCard
          title="This Month"
          value={
            complaints.filter((c) => {
              if (!c.createdAt) return false;
              const thisMonth = format(new Date(), "MMM yyyy");
              const complaintMonth = format(c.createdAt.toDate(), "MMM yyyy");
              return complaintMonth === thisMonth;
            }).length
          }
          icon="📅"
          color="bg-purple-500"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Complaints by Region
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Status Overview
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
                outerRadius={90}
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
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Monthly Trend (Last 6 Months)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Complaints"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Top Categories
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={categoryChartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          label="Avg Response Time"
          value="4.2 hours"
          icon="⚡"
          color="text-blue-600"
        />
        <MetricCard
          label="Avg Resolution Time"
          value="2.8 days"
          icon="⏱️"
          color="text-green-600"
        />
        <MetricCard
          label="Success Rate"
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
          color="text-purple-600"
        />
        <MetricCard
          label="Satisfaction Score"
          value="4.3/5"
          icon="⭐"
          color="text-yellow-600"
        />
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

const MetricCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 text-center">
    <div className={`text-4xl ${color} mb-3`}>{icon}</div>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    <p className="text-sm text-gray-600 mt-2">{label}</p>
  </div>
);

export default AdminStatistics;
