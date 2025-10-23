// src/components/citizen/ContactModal.jsx - NEW FILE

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebase";

const ContactModal = ({ isOpen, onClose }) => {
  const [officers, setOfficers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchContacts();
    }
  }, [isOpen]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      // Fetch officers
      const officersQuery = query(
        collection(db, "users"),
        where("role", "==", "officer")
      );
      const officersSnap = await getDocs(officersQuery);
      const officersList = [];
      officersSnap.forEach((doc) => {
        officersList.push({ id: doc.id, ...doc.data() });
      });
      setOfficers(officersList);

      // Fetch admins
      const adminsQuery = query(
        collection(db, "users"),
        where("role", "==", "admin")
      );
      const adminsSnap = await getDocs(adminsQuery);
      const adminsList = [];
      adminsSnap.forEach((doc) => {
        adminsList.push({ id: doc.id, ...doc.data() });
      });
      setAdmins(adminsList);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            📞 Contact Directory
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading contacts...</p>
            </div>
          ) : (
            <>
              {/* Emergency Helpline */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <span className="text-2xl">🚨</span>
                  Emergency Helpline
                </h3>
                <p className="text-red-700 text-lg font-bold">
                  📞 1800-XXX-XXXX
                </p>
                <p className="text-red-600 text-sm mt-1">
                  Available 24/7 for urgent complaints
                </p>
              </div>

              {/* District Admins */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">👨‍💼</span>
                  District Administrators
                </h3>

                {admins.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No administrators available
                  </p>
                ) : (
                  <div className="space-y-3">
                    {admins.map((admin) => (
                      <ContactCard key={admin.id} person={admin} role="Admin" />
                    ))}
                  </div>
                )}
              </div>

              {/* Municipal Officers */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">👮</span>
                  Municipal Officers
                </h3>

                {officers.length === 0 ? (
                  <p className="text-gray-500 text-sm">No officers available</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {officers.map((officer) => (
                      <ContactCard
                        key={officer.id}
                        person={officer}
                        role="Officer"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* General Support */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  📧 General Support
                </h3>
                <p className="text-blue-700 text-sm">
                  Email: support@municipality.com
                </p>
                <p className="text-blue-700 text-sm">
                  Website: www.municipality.gov.in
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Contact Card Component
const ContactCard = ({ person, role }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-800">{person.name}</h4>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
        {person.region && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {person.region}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>📧</span>
          <a href={`mailto:${person.email}`} className="hover:text-blue-600">
            {person.email}
          </a>
        </div>

        {person.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📱</span>
            <a href={`tel:${person.phone}`} className="hover:text-blue-600">
              {person.phone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
