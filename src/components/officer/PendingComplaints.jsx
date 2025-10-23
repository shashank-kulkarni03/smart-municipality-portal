// src/components/officer/PendingComplaints.jsx - WITH NOTIFICATIONS

import React, { useState } from "react";
import { updateComplaintStatus } from "../../services/complaints";
import { createNotification } from "../../services/notifications";
import { useAuth } from "../../context/AuthContext";
import { COMPLAINT_STATUS } from "../../utils/constants";
import { format } from "date-fns";
import toast from "react-hot-toast";

const PendingComplaints = ({ complaints, onUpdate }) => {
  const { currentUser } = useAuth();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredComplaints =
    filterStatus === "all"
      ? complaints
      : complaints.filter((c) => c.status === filterStatus);

  const handleStatusUpdate = async (
    complaintId,
    newStatus,
    note,
    citizenId
  ) => {
    const result = await updateComplaintStatus(
      complaintId,
      newStatus,
      currentUser.uid,
      note
    );

    if (result.success) {
      toast.success("Status updated successfully!");

      // Create notification for citizen
      let notificationMessage = "";
      if (newStatus === "in-progress") {
        notificationMessage =
          "Your complaint is now being worked on by our team.";
      } else if (newStatus === "resolved") {
        notificationMessage =
          "✅ Your complaint has been resolved! Thank you for your patience.";
      } else if (newStatus === "assigned") {
        notificationMessage = "Your complaint has been assigned to an officer.";
      }

      if (notificationMessage && citizenId) {
        await createNotification(
          citizenId,
          complaintId,
          `Complaint Status Updated: ${newStatus}`,
          notificationMessage
        );
      }

      onUpdate();
      setSelectedComplaint(null);
    } else {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <FilterButton
          label="All"
          count={complaints.length}
          active={filterStatus === "all"}
          onClick={() => setFilterStatus("all")}
        />
        <FilterButton
          label="Pending"
          count={complaints.filter((c) => c.status === "pending").length}
          active={filterStatus === "pending"}
          onClick={() => setFilterStatus("pending")}
          color="yellow"
        />
        <FilterButton
          label="In Progress"
          count={complaints.filter((c) => c.status === "in-progress").length}
          active={filterStatus === "in-progress"}
          onClick={() => setFilterStatus("in-progress")}
          color="orange"
        />
        <FilterButton
          label="Resolved"
          count={complaints.filter((c) => c.status === "resolved").length}
          active={filterStatus === "resolved"}
          onClick={() => setFilterStatus("resolved")}
          color="green"
        />
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            No Complaints
          </h3>
          <p className="text-gray-600">No complaints found in this category</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onClick={() => setSelectedComplaint(complaint)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

// Filter Button Component
const FilterButton = ({ label, count, active, onClick, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
    orange: "bg-orange-100 text-orange-700 border-orange-300",
    green: "bg-green-100 text-green-700 border-green-300",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium border-2 transition-all ${
        active
          ? colors[color]
          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
      }`}
    >
      {label} ({count})
    </button>
  );
};

// Complaint Card Component
const ComplaintCard = ({ complaint, onClick }) => {
  const statusInfo =
    COMPLAINT_STATUS[complaint.status] || COMPLAINT_STATUS.pending;

  const formatDate = (timestamp) => {
    if (!timestamp) return "Just now";
    try {
      // Handle Firestore Timestamp
      if (timestamp && typeof timestamp.toDate === "function") {
        return format(timestamp.toDate(), "MMM dd, yyyy");
      }
      // Handle Firestore format with seconds
      if (timestamp && timestamp.seconds) {
        return format(new Date(timestamp.seconds * 1000), "MMM dd, yyyy");
      }
      // Handle regular Date
      if (timestamp instanceof Date) {
        return format(timestamp, "MMM dd, yyyy");
      }
      return "Just now";
    } catch (error) {
      console.error("Date format error:", error);
      return "Just now";
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {complaint.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {complaint.category} • {complaint.region}
          </p>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4"
          style={{
            backgroundColor: statusInfo.color + "20",
            color: statusInfo.color,
          }}
        >
          {statusInfo.label}
        </span>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">
        {complaint.description || "No description provided"}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">
          <span className="font-medium">Reported by:</span>{" "}
          {complaint.citizenName}
        </div>
        <div className="text-gray-500">
          📅 {formatDate(complaint.createdAt)}
        </div>
      </div>

      {complaint.images && complaint.images.length > 0 && (
        <div className="mt-4 flex gap-2">
          {complaint.images.slice(0, 3).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Issue ${idx + 1}`}
              className="w-20 h-20 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Complaint Detail Modal
const ComplaintDetailModal = ({ complaint, onClose, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState(complaint.status);
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Just now";
    try {
      if (timestamp.toDate) {
        return format(timestamp.toDate(), "MMM dd, yyyy HH:mm");
      }
      return "Just now";
    } catch {
      return "Just now";
    }
  };

  const handleSubmit = async () => {
    if (newStatus === complaint.status && !note) {
      toast.error("Please select a different status or add a note");
      return;
    }

    setUpdating(true);
    await onStatusUpdate(
      complaint.id,
      newStatus,
      note || `Status changed to ${newStatus}`,
      complaint.citizenId
    );
    setUpdating(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
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

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoField label="Title" value={complaint.title} />
              <InfoField label="Category" value={complaint.category} />
              <InfoField label="Reported By" value={complaint.citizenName} />
              <InfoField label="Contact" value={complaint.citizenPhone} />
            </div>

            <InfoField
              label="Description"
              value={complaint.description || "No description provided"}
            />

            <InfoField
              label="Location"
              value={`📍 ${
                complaint.location?.address ||
                `${complaint.location?.latitude?.toFixed(
                  4
                )}, ${complaint.location?.longitude?.toFixed(4)}`
              }`}
            />

            <InfoField
              label="Submitted On"
              value={formatDate(complaint.createdAt)}
            />

            {/* Images */}
            {complaint.images && complaint.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {complaint.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Evidence ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90"
                      onClick={() => window.open(img, "_blank")}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Status Update Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Update Status
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">✅ Mark as Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Add any notes about this update..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={updating}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {updating ? "Updating..." : "Update Status & Notify Citizen"}
                </button>
              </div>
            </div>

            {/* Status History */}
            {complaint.statusHistory && complaint.statusHistory.length > 1 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Status History
                </h3>
                <div className="space-y-3">
                  {complaint.statusHistory
                    .slice()
                    .reverse()
                    .map((history, idx) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 capitalize">
                            {history.status.replace("-", " ")}
                          </p>
                          {history.note && (
                            <p className="text-gray-700">{history.note}</p>
                          )}
                          <p className="text-gray-500 text-xs mt-1">
                            {history.updatedAt
                              ? format(
                                  new Date(history.updatedAt),
                                  "MMM dd, yyyy HH:mm"
                                )
                              : ""}
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

// Info Field Component
const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <p className="text-gray-800 font-medium">{value}</p>
  </div>
);

export default PendingComplaints;
