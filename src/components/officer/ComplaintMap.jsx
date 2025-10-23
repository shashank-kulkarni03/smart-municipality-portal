// src/components/officer/ComplaintMap.jsx
// ========================================

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ComplaintMap = ({ complaints }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [13.0358, 77.597],
        12
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add markers for complaints
    complaints.forEach((complaint) => {
      if (
        complaint.location &&
        complaint.location.latitude &&
        complaint.location.longitude
      ) {
        const color = getMarkerColor(complaint.status);

        const marker = L.circleMarker(
          [complaint.location.latitude, complaint.location.longitude],
          {
            radius: 10,
            fillColor: color,
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          }
        ).addTo(mapInstanceRef.current);

        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px;">${complaint.title}</h3>
            <p style="margin: 4px 0;"><strong>Category:</strong> ${complaint.category}</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> ${complaint.status}</p>
            <p style="margin: 4px 0;"><strong>Reported by:</strong> ${complaint.citizenName}</p>
          </div>
        `);
      }
    });

    // Fit bounds to show all markers
    if (complaints.length > 0) {
      const bounds = complaints
        .filter((c) => c.location && c.location.latitude)
        .map((c) => [c.location.latitude, c.location.longitude]);

      if (bounds.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [complaints]);

  const getMarkerColor = (status) => {
    const colors = {
      pending: "#fbbf24",
      assigned: "#3b82f6",
      "in-progress": "#fb923c",
      resolved: "#34d399",
      closed: "#9ca3af",
    };
    return colors[status] || "#gray";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">📍 Complaints Map</h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Resolved</span>
          </div>
        </div>
      </div>
      <div ref={mapRef} style={{ height: "600px", borderRadius: "8px" }}></div>
    </div>
  );
};

export default ComplaintMap;
