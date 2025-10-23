import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivacyBanner from "./components/common/PrivacyBanner";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenDashboard from "./pages/CitizenDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  // Apply theme to <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Toaster position="top-right" />
          <PrivacyBanner />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            {/* Protected Routes - Citizen */}
            <Route
              path="/citizen/dashboard"
              element={
                <ProtectedRoute allowedRoles={["citizen"]}>
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Officer */}
            <Route
              path="/officer/dashboard"
              element={
                <ProtectedRoute allowedRoles={["officer"]}>
                  <OfficerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect based on role */}
            <Route path="/dashboard" element={<RoleBasedRedirect />} />

            {/* 404 Not Found */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Role-based redirect
const RoleBasedRedirect = () => {
  const { userData } = useAuth();

  if (!userData) return <Navigate to="/login" />;

  switch (userData.role) {
    case "citizen":
      return <Navigate to="/citizen/dashboard" />;
    case "officer":
      return <Navigate to="/officer/dashboard" />;
    case "admin":
      return <Navigate to="/admin/dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
};

export default App;
export { App };
