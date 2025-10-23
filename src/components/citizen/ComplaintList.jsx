// src/components/citizen/ComplaintList.jsx - MEGA FIX

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../services/firebase";
import { COMPLAINT_STATUS } from "../../utils/constants";

const ComplaintList = () => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchComplaints();
    }
  }, [currentUser]);

  const fetchComplaints = async () => {
    setLoading(true);
    console.log("🔍 Fetching complaints for user:", currentUser.uid);

    try {
      const complaintsRef = collection(db, "complaints");
      const q = query(
        complaintsRef,
        where("citizenId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const fetchedComplaints = [];

      querySnapshot.forEach((doc) => {
        fetchedComplaints.push({ id: doc.id, ...doc.data() });
      });

      console.log("✅ Fetched complaints:", fetchedComplaints);
      setComplaints(fetchedComplaints);
    } catch (error) {
      console.error("❌ Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusInfo = COMPLAINT_STATUS[status] || COMPLAINT_STATUS.pending;
    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: statusInfo.color + "20",
          color: statusInfo.color,
        }}
      >
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Just now";
    try {
      if (timestamp && timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
      return "Just now";
    } catch (error) {
      return "Just now";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your complaints...</p>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          No Complaints Yet
        </h3>
        <p className="text-gray-600">You haven't submitted any complaints</p>
        <button
          onClick={fetchComplaints}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          🔄 Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Total Complaints:{" "}
          <span className="font-bold text-gray-800">{complaints.length}</span>
        </p>
        <button
          onClick={fetchComplaints}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {complaints.map((complaint) => (
        <div
          key={complaint.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedComplaint(complaint)}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {complaint.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{complaint.category}</p>
            </div>
            {getStatusBadge(complaint.status)}
          </div>

          {complaint.description && (
            <p className="text-gray-700 mb-4 line-clamp-2">
              {complaint.description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>📅 {formatDate(complaint.createdAt)}</span>
            {complaint.assignedOfficer && (
              <span className="text-blue-600">
                👤 Assigned to {complaint.officerName || "Officer"}
              </span>
            )}
          </div>

          {complaint.images && complaint.images.length > 0 && (
            <div className="mt-4 flex gap-2">
              {complaint.images.slice(0, 3).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Complaint ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ))}
              {complaint.images.length > 3 && (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    +{complaint.images.length - 3}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
};

// Complaint Detail Modal Component
const ComplaintDetailModal = ({ complaint, onClose }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return "Just now";
    try {
      if (timestamp && timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleString();
      }
      return "Just now";
    } catch (error) {
      return "Just now";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Complaint Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Title</label>
              <p className="text-lg font-semibold text-gray-800">
                {complaint.title}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Category
              </label>
              <p className="text-gray-800">{complaint.category}</p>
            </div>

            {complaint.description && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Description
                </label>
                <p className="text-gray-800">{complaint.description}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-600">
                Status
              </label>
              <div className="mt-1">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor:
                      COMPLAINT_STATUS[complaint.status]?.color + "20" ||
                      "#FFA07A20",
                    color:
                      COMPLAINT_STATUS[complaint.status]?.color || "#FFA07A",
                  }}
                >
                  {COMPLAINT_STATUS[complaint.status]?.label ||
                    complaint.status}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Location
              </label>
              <p className="text-gray-800">
                📍{" "}
                {complaint.location?.address ||
                  `${complaint.location?.latitude?.toFixed(
                    4
                  )}, ${complaint.location?.longitude?.toFixed(4)}`}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Submitted On
              </label>
              <p className="text-gray-800">{formatDate(complaint.createdAt)}</p>
            </div>

            {complaint.images && complaint.images.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">
                  Images
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {complaint.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Complaint ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-lg cursor-pointer"
                      onClick={() => window.open(img, "_blank")}
                    />
                  ))}
                </div>
              </div>
            )}

            {complaint.statusHistory && complaint.statusHistory.length > 1 && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">
                  Status History
                </label>
                <div className="space-y-2">
                  {complaint.statusHistory
                    .slice()
                    .reverse()
                    .map((history, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-sm p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                        <div>
                          <p className="font-medium text-gray-800 capitalize">
                            {history.status.replace("-", " ")}
                          </p>
                          {history.note && (
                            <p className="text-gray-600">{history.note}</p>
                          )}
                          <p className="text-gray-500 text-xs mt-1">
                            {history.updatedAt
                              ? formatDate({
                                  seconds:
                                    history.updatedAt.seconds ||
                                    Math.floor(
                                      new Date(history.updatedAt).getTime() /
                                        1000
                                    ),
                                })
                              : "Recently"}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintList;
