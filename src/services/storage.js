// src/services/storage.js - FREE CLOUDINARY VERSION

import Compressor from "compressorjs";

export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      maxWidth: 1920,
      maxHeight: 1920,
      success(result) {
        resolve(result);
      },
      error(err) {
        reject(err);
      },
    });
  });
};

export const uploadComplaintImages = async (files, complaintId) => {
  try {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary credentials missing. Check your .env file.");
    }

    console.log("Starting image upload...", files.length, "files");
    console.log("Using cloud name:", cloudName);

    const uploadPromises = files.map(async (file, index) => {
      try {
        // Compress image first
        console.log(`Compressing image ${index + 1}...`);
        const compressedFile = await compressImage(file);

        // Create form data
        const formData = new FormData();
        formData.append("file", compressedFile);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", `municipality/${complaintId}`);

        console.log(`Uploading image ${index + 1} to Cloudinary...`);

        // Upload to Cloudinary
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Upload failed:", errorText);
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(
          `Image ${index + 1} uploaded successfully:`,
          data.secure_url
        );

        return data.secure_url;
      } catch (error) {
        console.error(`Error uploading image ${index + 1}:`, error);
        throw error;
      }
    });

    const imageUrls = await Promise.all(uploadPromises);
    console.log("All images uploaded successfully:", imageUrls);

    return { success: true, imageUrls };
  } catch (error) {
    console.error("Error in uploadComplaintImages:", error);
    return { success: false, error: error.message };
  }
};
