"use client";

import React, { useState, useEffect } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { getUserInfo, isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/api-client";

const Profile = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";
  const router = useRouter();
  const user = getUserInfo();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/user/login");
      return;
    }

    if (user) {
      const nameParts = (user.name || "").split(" ");
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement profile update API endpoint in backend
      const response = await apiClient.put("/user/profile", {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
      });

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setEditing(false);
        // Refresh user info
        window.location.reload();
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return null;
  }

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} py-12 px-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Account Information
          </h1>
          <button
            onClick={() => setEditing(!editing)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              editing
                ? isDark
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : isDark
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {editing ? "Cancel" : "Edit Information"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Section */}
          <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl p-6 shadow-lg`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold ${
                isDark ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-600"
              }`}>
                {getInitials(user?.name || user?.username)}
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!editing || loading}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                        : "bg-white border-gray-300 text-gray-900 disabled:opacity-50"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!editing || loading}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                        : "bg-white border-gray-300 text-gray-900 disabled:opacity-50"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl p-6 shadow-lg`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!editing || loading}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                      : "bg-white border-gray-300 text-gray-900 disabled:opacity-50"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing || loading}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                      : "bg-white border-gray-300 text-gray-900 disabled:opacity-50"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl p-6 shadow-lg`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Security
            </h2>

            {/* Password */}
            <div className={`p-4 rounded-lg border mb-4 ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <svg className={`w-6 h-6 ${isDark ? "text-gray-400" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Password</p>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Last updated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/auth/user/forgot-password")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isDark
                      ? "text-indigo-400 hover:text-indigo-300"
                      : "text-indigo-600 hover:text-indigo-700"
                  }`}
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {editing && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;


