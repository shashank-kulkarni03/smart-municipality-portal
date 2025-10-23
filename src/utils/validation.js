// src/utils/validation.js
// ========================================

export const validateComplaintForm = (formData) => {
  const errors = {};

  if (!formData.title || formData.title.trim().length < 5) {
    errors.title = "Title must be at least 5 characters";
  }

  if (!formData.category) {
    errors.category = "Please select a category";
  }

  if (!formData.location) {
    errors.location = "Location is required";
  }

  if (!formData.images || formData.images.length === 0) {
    errors.images = "At least one image is required";
  }

  if (formData.images && formData.images.length > 5) {
    errors.images = "Maximum 5 images allowed";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegistration = (formData) => {
  const errors = {};

  if (!formData.name || formData.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.phone) {
    errors.phone = "Phone number is required";
  } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
    errors.phone = "Invalid phone number format";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (formData.role === "officer" && !formData.region) {
    errors.region = "Region is required for officers";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
