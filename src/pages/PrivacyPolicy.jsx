// src/pages/PrivacyPolicy.jsx - FULL PAGE

import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Privacy Policy & Data Protection
          </h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                🔒 Data Collection Statement
              </h2>
              <p>
                This Municipality Complaint Management Portal is designed to
                help citizens report and track municipal issues. We are
                committed to protecting your privacy and handling your data
                responsibly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                📋 What Information We Collect
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Personal Information:</strong> Name, email address,
                  phone number
                </li>
                <li>
                  <strong>Complaint Data:</strong> Issue description, photos,
                  location coordinates
                </li>
                <li>
                  <strong>Account Data:</strong> Login credentials (encrypted),
                  user role
                </li>
                <li>
                  <strong>Usage Data:</strong> Complaint status, timestamps,
                  officer assignments
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                ✅ How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To process and resolve your complaints</li>
                <li>To assign complaints to appropriate municipal officers</li>
                <li>To communicate complaint status updates</li>
                <li>To generate reports for municipal administration</li>
                <li>To improve service quality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                🚫 What We DO NOT Do
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>We DO NOT sell your data</strong> to third parties
                  </li>
                  <li>
                    <strong>We DO NOT use your data for marketing</strong>{" "}
                    purposes
                  </li>
                  <li>
                    <strong>We DO NOT share your personal information</strong>{" "}
                    outside municipal operations
                  </li>
                  <li>
                    <strong>We DO NOT track you</strong> across other websites
                  </li>
                  <li>
                    <strong>We DO NOT collect data beyond</strong> what's
                    necessary for complaint resolution
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                🔐 Data Security
              </h2>
              <p>
                Your data is stored securely using Firebase (Google Cloud) with
                industry-standard encryption. Access is restricted to authorized
                municipal personnel only. Images and location data are stored
                securely and used only for complaint verification.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                👤 Your Rights
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Right to access your complaint data</li>
                <li>Right to update your personal information</li>
                <li>Right to delete your account (contact admin)</li>
                <li>Right to know how your data is being used</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                ⚠️ Important Disclaimers
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="space-y-2">
                  <li>
                    <strong>Educational/Demo Project:</strong> This is a
                    student/demo project. For real municipal complaints, contact
                    your local government.
                  </li>
                  <li>
                    <strong>No Commercial Use:</strong> This platform is not
                    used for commercial data collection or profit.
                  </li>
                  <li>
                    <strong>Data Retention:</strong> Complaint data is retained
                    for administrative purposes and may be deleted upon request.
                  </li>
                  <li>
                    <strong>Third-Party Services:</strong> We use Firebase
                    (Google) for data storage. Their privacy policy also
                    applies.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                📧 Contact Us
              </h2>
              <p>
                For privacy concerns, data requests, or questions:
                <br />
                Email:{" "}
                <a
                  href="mailto:privacy@municipality-portal.com"
                  className="text-blue-600 hover:underline"
                >
                  privacy@municipality-portal.com
                </a>
              </p>
            </section>

            <section className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-600">
                <strong>Last Updated:</strong> October 2025
                <br />
                <strong>Effective Date:</strong> October 2025
                <br />
                By using this service, you acknowledge that you have read and
                understood this Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
