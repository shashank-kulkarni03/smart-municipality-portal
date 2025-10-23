// src/components/citizen/LocationPicker.jsx
import React, { useState, useEffect } from "react";

const LocationPicker = ({ onLocationSelected }) => {
  const [location, setLocation] = useState(null);
  const [locationType, setLocationType] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [manualLocation, setManualLocation] = useState({
    latitude: "",
    longitude: "",
    address: "",
  });

  // Auto-fetch GPS location
  const fetchAutoLocation = () => {
    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "Auto-detected location",
            locationType: "auto",
          };
          setLocation(loc);
          onLocationSelected(loc, "auto");
          setLoading(false);
        },
        (error) => {
          alert("Unable to get location. Please enter manually.");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (!manualLocation.latitude || !manualLocation.longitude) {
      alert("Please enter both latitude and longitude");
      return;
    }

    const loc = {
      latitude: parseFloat(manualLocation.latitude),
      longitude: parseFloat(manualLocation.longitude),
      address: manualLocation.address || "Manually entered location",
      locationType: "manual",
    };

    setLocation(loc);
    onLocationSelected(loc, "manual");
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Location *
      </label>

      {/* Toggle buttons */}
      <div className="flex gap-3 mb-4">
        <button
          type="button"
          onClick={() => {
            setLocationType("auto");
            fetchAutoLocation();
          }}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            locationType === "auto"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          📍 Auto-detect
        </button>
        <button
          type="button"
          onClick={() => setLocationType("manual")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            locationType === "manual"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          ✏️ Enter Manually
        </button>
      </div>

      {/* Manual entry fields */}
      {locationType === "manual" && (
        <div className="space-y-3">
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={manualLocation.latitude}
            onChange={(e) =>
              setManualLocation({ ...manualLocation, latitude: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={manualLocation.longitude}
            onChange={(e) =>
              setManualLocation({
                ...manualLocation,
                longitude: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Address (optional)"
            value={manualLocation.address}
            onChange={(e) =>
              setManualLocation({ ...manualLocation, address: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button
            type="button"
            onClick={handleManualSubmit}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Confirm Location
          </button>
        </div>
      )}

      {/* Location Display */}
      {location && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="font-medium text-green-800">✓ Location Confirmed</p>
          <p className="text-sm text-green-700 mt-1">
            Lat: {location.latitude.toFixed(6)}, Lng:{" "}
            {location.longitude.toFixed(6)}
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Fetching location...</p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
