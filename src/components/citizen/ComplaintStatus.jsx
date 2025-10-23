// src/components/citizen/ComplaintStatus.jsx
// ========================================

import React from "react";
import { format } from "date-fns";

const ComplaintStatus = ({ complaint }) => {
  const getStepStatus = (step) => {
    const statusOrder = ["pending", "assigned", "in-progress", "resolved"];
    const currentIndex = statusOrder.indexOf(complaint.status);
    const stepIndex = statusOrder.indexOf(step);

    if (stepIndex <= currentIndex) return "completed";
    return "pending";
  };

  const steps = [
    { id: "pending", label: "Submitted", icon: "📝" },
    { id: "assigned", label: "Assigned", icon: "👤" },
    { id: "in-progress", label: "In Progress", icon: "🔧" },
    { id: "resolved", label: "Resolved", icon: "✅" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Status Timeline
      </h3>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const isCompleted = status === "completed";

            return (
              <div key={step.id} className="relative flex items-start">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl z-10 ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <div className="ml-6 flex-1">
                  <h4
                    className={`font-semibold ${
                      isCompleted ? "text-gray-800" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </h4>

                  {complaint.statusHistory &&
                    complaint.statusHistory.find(
                      (h) => h.status === step.id
                    ) && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          {
                            complaint.statusHistory.find(
                              (h) => h.status === step.id
                            ).note
                          }
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(
                            new Date(
                              complaint.statusHistory.find(
                                (h) => h.status === step.id
                              ).updatedAt
                            ),
                            "MMM dd, yyyy HH:mm"
                          )}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Badge */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">
            Current Status:
          </span>
          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium capitalize">
            {complaint.status.replace("-", " ")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComplaintStatus;
