// src/components/admin/FilterComplaints.jsx
import React, { useState } from "react";
import { REGIONS, COMPLAINT_CATEGORIES } from "../../utils/constants";
import { format } from "date-fns";

const FilterComplaints = ({ complaints, onRefresh }) => {
  const [filters, setFilters] = useState({
    region: "all",
    status: "all",
    category: "all",
    dateFrom: "",
    dateTo: "",
  });

  const filteredComplaints = complaints.filter((complaint) => {
    if (filters.region !== "all" && complaint.region !== filters.region)
      return false;
    if (filters.status !== "all" && complaint.status !== filters.status)
      return false;
    if (filters.category !== "all" && complaint.category !== filters.category)
      return false;
    // Add date filtering logic here
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region
            </label>
            <select
              value={filters.region}
              onChange={(e) =>
                setFilters({ ...filters, region: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date From
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date To
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={() =>
            setFilters({
              region: "all",
              status: "all",
              category: "all",
              dateFrom: "",
              dateTo: "",
            })
          }
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Results ({filteredComplaints.length})
          </h2>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  ID
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Region
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm font-medium">
                    #{complaint.id.substring(0, 8)}
                  </td>
                  <td className="py-3 px-4">{complaint.title}</td>
                  <td className="py-3 px-4 text-sm">{complaint.category}</td>
                  <td className="py-3 px-4 text-sm">{complaint.region}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={complaint.status} />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {complaint.createdAt
                      ? format(complaint.createdAt.toDate(), "MMM dd, yyyy")
                      : "Just now"}
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default FilterComplaints;
