// src/components/common/PrivacyBanner.jsx

import React, { useState, useEffect } from "react";

const PrivacyBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("privacyAccepted");
    if (!accepted) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("privacyAccepted", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-900 text-white p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm">
          <p className="font-semibold mb-2">
            🔒 Privacy & Data Protection Notice
          </p>
          <p>
            We respect your privacy. This platform collects only necessary
            information (name, email, phone, complaint details) to process
            municipal complaints.{" "}
            <strong>
              No data is shared with third parties or used for marketing.
            </strong>
            All data is securely stored and used solely for complaint resolution
            purposes. By using this service, you consent to our data collection
            practices.
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="bg-white text-blue-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
        >
          I Understand
        </button>
      </div>
    </div>
  );
};

export default PrivacyBanner;
