// src/components/citizen/ComplaintForm.jsx - FINAL WITH CLOUDINARY

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { uploadComplaintImages } from "../../services/storage";
import ImageUpload from "./ImageUpload";
import LocationPicker from "./LocationPicker";
import CategorySelect from "./CategorySelect";
import toast from "react-hot-toast";

const ComplaintForm = ({ onComplaintSubmitted }) => {
  const { currentUser, userData } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    images: [],
    location: null,
    locationType: "auto",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImagesSelected = (files) => {
    setFormData({
      ...formData,
      images: files,
    });
  };

  const handleLocationSelected = (location, type) => {
    setFormData({
      ...formData,
      location,
      locationType: type,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (!formData.location) {
      toast.error("Please select or confirm location");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (!formData.title || formData.title.trim().length < 5) {
      toast.error("Title must be at least 5 characters");
      return;
    }

    setLoading(true);
    console.log("🚀 Starting complaint submission...");

    try {
      // STEP 1: Upload images to Cloudinary
      console.log(
        "📤 Uploading",
        formData.images.length,
        "images to Cloudinary..."
      );
      toast.loading("Uploading images...", { id: "upload" });

      const uploadResult = await uploadComplaintImages(
        formData.images,
        `complaint_${Date.now()}`
      );

      toast.dismiss("upload");

      if (!uploadResult.success) {
        throw new Error("Image upload failed: " + uploadResult.error);
      }

      console.log("✅ Images uploaded:", uploadResult.imageUrls);

      // STEP 2: Create complaint in Firestore WITH images
      console.log("💾 Saving complaint to database...");
      toast.loading("Saving complaint...", { id: "save" });

      const complaintsRef = collection(db, "complaints");
      const newComplaint = await addDoc(complaintsRef, {
        citizenId: currentUser.uid,
        citizenName: userData.name,
        citizenPhone: userData.phone,
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        location: formData.location,
        region: "General", // All officers can see
        images: uploadResult.imageUrls, // Images from Cloudinary
        status: "pending",
        assignedOfficer: null,
        officerName: null,
        statusHistory: [
          {
            status: "pending",
            updatedBy: currentUser.uid,
            updatedAt: new Date(),
            note: "Complaint submitted",
          },
        ],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        resolvedAt: null,
      });

      toast.dismiss("save");
      console.log("✅ Complaint created:", newComplaint.id);

      // STEP 3: Success!
      setLoading(false);
      toast.success("✅ Complaint submitted successfully!", { duration: 3000 });

      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
        images: [],
        location: null,
        locationType: "auto",
      });

      // Trigger parent callback
      if (onComplaintSubmitted) {
        setTimeout(() => {
          onComplaintSubmitted();
        }, 500);
      }
    } catch (error) {
      setLoading(false);
      console.error("❌ Error:", error);
      toast.error("Failed: " + error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Submit New Complaint
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <CategorySelect
          selectedCategory={formData.category}
          onSelect={(category) => setFormData({ ...formData, category })}
        />

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complaint Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            minLength="5"
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            placeholder="Brief title for your complaint"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            placeholder="Describe the issue in detail..."
          />
        </div>

        {/* Image Upload */}
        <ImageUpload
          onImagesSelected={handleImagesSelected}
          disabled={loading}
        />

        {/* Location Picker */}
        <LocationPicker
          onLocationSelected={handleLocationSelected}
          disabled={loading}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Submit Complaint"
          )}
        </button>

        {loading && (
          <div className="text-center text-sm text-gray-600">
            <p>⏳ Please wait... Uploading images and saving complaint</p>
            <p className="text-xs mt-1">This may take 10-20 seconds</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ComplaintForm;
