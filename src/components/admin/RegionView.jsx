// src/components/admin/RegionView.jsx
import React, { useState } from "react";
import { REGIONS } from "../../utils/constants";

const RegionView = ({ officers, complaints }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const getRegionStats = (region) => {
    const regionOfficers = officers.filter((o) => o.region === region);
    const regionComplaints = complaints.filter((c) => c.region === region);

    return {
      officersCount: regionOfficers.length,
      totalComplaints: regionComplaints.length,
      pending: regionComplaints.filter((c) => c.status === "pending").length,
      resolved: regionComplaints.filter((c) => c.status === "resolved").length,
      officers: regionOfficers,
    };
  };

  return (
    <div className="grid gap-6">
      {/* Region Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REGIONS.map((region) => {
          const stats = getRegionStats(region);

          return (
            <div
              key={region}
              onClick={() => setSelectedRegion(region)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📍 {region}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Officers</span>
                  <span className="font-semibold text-gray-800">
                    {stats.officersCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Complaints</span>
                  <span className="font-semibold text-gray-800">
                    {stats.totalComplaints}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">
                    {stats.pending}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Resolved</span>
                  <span className="font-semibold text-green-600">
                    {stats.resolved}
                  </span>
                </div>
              </div>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {/* Region Detail Modal */}
      {selectedRegion && (
        <RegionDetailModal
          region={selectedRegion}
          stats={getRegionStats(selectedRegion)}
          onClose={() => setSelectedRegion(null)}
          complaints={complaints.filter((c) => c.region === selectedRegion)}
        />
      )}
    </div>
  );
};

// Region Detail Modal
const RegionDetailModal = ({ region, stats, onClose, complaints }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">📍 {region}</h2>
              <p className="text-gray-600 mt-1">Region Details & Officers</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Officers</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.officersCount}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalComplaints}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.resolved}
              </p>
            </div>
          </div>

          {/* Officers List */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Officers</h3>
            <div className="space-y-3">
              {stats.officers.map((officer) => {
                const officerComplaints = complaints.filter(
                  (c) => c.assignedOfficer === officer.id
                );

                return (
                  <div key={officer.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {officer.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          📧 {officer.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          📱 {officer.phone}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Assigned Complaints
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {officerComplaints.length}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Complaints */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Recent Complaints
            </h3>
            <div className="space-y-2">
              {complaints.slice(0, 5).map((complaint) => (
                <div
                  key={complaint.id}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">
                        {complaint.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {complaint.category}
                      </p>
                    </div>
                    <StatusBadge status={complaint.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
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
      {status.replace("-", " ")}
    </span>
  );
};

export default RegionView;
