// src/components/admin/MonthlyReport.jsx
import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const MonthlyReport = ({ complaints, officers }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Municipality Monthly Report", 20, 20);

    doc.setFontSize(12);
    doc.text(
      `Period: ${format(new Date(selectedYear, selectedMonth), "MMMM yyyy")}`,
      20,
      30
    );
    doc.text(`Generated on: ${format(new Date(), "MMM dd, yyyy")}`, 20, 37);

    // Summary Stats
    doc.setFontSize(14);
    doc.text("Summary Statistics", 20, 50);

    const stats = [
      ["Total Complaints", complaints.length],
      ["Pending", complaints.filter((c) => c.status === "pending").length],
      [
        "In Progress",
        complaints.filter((c) => c.status === "in-progress").length,
      ],
      ["Resolved", complaints.filter((c) => c.status === "resolved").length],
      ["Total Officers", officers.length],
    ];

    doc.autoTable({
      startY: 55,
      head: [["Metric", "Count"]],
      body: stats,
      theme: "grid",
    });

    // Complaints by Category
    doc.text("Complaints by Category", 20, doc.lastAutoTable.finalY + 15);

    const categories = {};
    complaints.forEach((c) => {
      categories[c.category] = (categories[c.category] || 0) + 1;
    });

    const categoryData = Object.entries(categories).map(([cat, count]) => [
      cat,
      count,
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Category", "Count"]],
      body: categoryData,
      theme: "striped",
    });

    // Complaints by Region
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Complaints by Region", 20, 20);

    const regions = {};
    complaints.forEach((c) => {
      regions[c.region] = (regions[c.region] || 0) + 1;
    });

    const regionData = Object.entries(regions).map(([region, count]) => [
      region,
      count,
    ]);

    doc.autoTable({
      startY: 25,
      head: [["Region", "Count"]],
      body: regionData,
      theme: "grid",
    });

    // Officer Performance
    doc.text("Officer Performance", 20, doc.lastAutoTable.finalY + 15);

    const officerStats = officers.map((officer) => {
      const officerComplaints = complaints.filter(
        (c) => c.assignedOfficer === officer.id
      );
      const resolved = officerComplaints.filter(
        (c) => c.status === "resolved"
      ).length;

      return [
        officer.name,
        officer.region,
        officerComplaints.length,
        resolved,
        officerComplaints.length > 0
          ? `${Math.round((resolved / officerComplaints.length) * 100)}%`
          : "0%",
      ];
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [
        [
          "Officer Name",
          "Region",
          "Total Assigned",
          "Resolved",
          "Success Rate",
        ],
      ],
      body: officerStats,
      theme: "striped",
    });

    // Save PDF
    doc.save(`Municipality_Report_${format(new Date(), "yyyy-MM")}.pdf`);
  };

  const exportCSV = () => {
    const headers = [
      "ID",
      "Title",
      "Category",
      "Status",
      "Region",
      "Date",
      "Assigned Officer",
    ];
    const rows = complaints.map((c) => [
      c.id.substring(0, 8),
      c.title,
      c.category,
      c.status,
      c.region,
      c.createdAt ? format(c.createdAt.toDate(), "yyyy-MM-dd") : "N/A",
      c.officerName || "Unassigned",
    ]);

    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.map((cell) => `"${cell}"`).join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Complaints_${format(new Date(), "yyyy-MM")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    // Simple Excel-compatible CSV with better formatting
    const headers = [
      "ID",
      "Title",
      "Category",
      "Status",
      "Region",
      "Citizen Name",
      "Phone",
      "Date",
      "Assigned Officer",
      "Location",
    ];
    const rows = complaints.map((c) => [
      c.id.substring(0, 8),
      c.title,
      c.category,
      c.status.toUpperCase(),
      c.region,
      c.citizenName,
      c.citizenPhone,
      c.createdAt ? format(c.createdAt.toDate(), "yyyy-MM-dd HH:mm") : "N/A",
      c.officerName || "Unassigned",
      c.location ? `${c.location.latitude}, ${c.location.longitude}` : "N/A",
    ]);

    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel
    csvContent += headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.map((cell) => `"${cell}"`).join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Municipality_Data_${format(new Date(), "yyyy-MM")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate statistics
  const totalComplaints = complaints.length;
  const pending = complaints.filter(
    (c) => c.status === "pending" || c.status === "assigned"
  ).length;
  const inProgress = complaints.filter(
    (c) => c.status === "in-progress"
  ).length;
  const resolved = complaints.filter(
    (c) => c.status === "resolved" || c.status === "closed"
  ).length;

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Generate Report
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {format(new Date(2025, i), "MMMM")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={generatePDF}
            className="bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl">📄</span>
            Download PDF Report
          </button>
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl">📊</span>
            Export to CSV
          </button>
          <button
            onClick={exportExcel}
            className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl">📗</span>
            Export to Excel
          </button>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Report Preview</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <ReportStat label="Total Complaints" value={totalComplaints} />
          <ReportStat label="Pending" value={pending} color="text-yellow-600" />
          <ReportStat
            label="In Progress"
            value={inProgress}
            color="text-orange-600"
          />
          <ReportStat
            label="Resolved"
            value={resolved}
            color="text-green-600"
          />
        </div>

        <div className="border-t pt-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Top Categories</h3>
          <div className="space-y-2">
            {Object.entries(
              complaints.reduce((acc, c) => {
                acc[c.category] = (acc[c.category] || 0) + 1;
                return acc;
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([category, count]) => (
                <div
                  key={category}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700 font-medium">{category}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / totalComplaints) * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold text-gray-800 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-800 mb-3">
            Performance Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Avg Resolution Time</p>
              <p className="text-2xl font-bold text-blue-600">2.5 days</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Resolution Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {totalComplaints > 0
                  ? Math.round((resolved / totalComplaints) * 100)
                  : 0}
                %
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Active Officers</p>
              <p className="text-2xl font-bold text-purple-600">
                {officers.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {complaints
            .sort((a, b) => {
              const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
              const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
              return dateB - dateA;
            })
            .slice(0, 10)
            .map((complaint, index) => (
              <div
                key={complaint.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {complaint.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {complaint.category} • {complaint.region}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      complaint.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : complaint.status === "in-progress"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {complaint.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {complaint.createdAt
                      ? format(complaint.createdAt.toDate(), "MMM dd")
                      : "Just now"}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const ReportStat = ({ label, value, color = "text-gray-800" }) => (
  <div className="text-center p-4 bg-gray-50 rounded-lg">
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default MonthlyReport;
