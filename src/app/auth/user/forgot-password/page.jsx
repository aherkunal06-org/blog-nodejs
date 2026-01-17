"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/api-client";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post("/auth/user/forgot-password", {
        email,
        password,
      });

      const data = response.data;

      if (data.success) {
        toast.success("Password reset successfully!");
        router.push("/auth/user/login");
      } else {
        toast.error(data.message || "Error resetting password");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md border border-gray-300 rounded-lg p-6 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-black text-center">Forgot Password</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 disabled:opacity-50"
        />

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={loading}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 disabled:opacity-50"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          disabled={loading}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 text-white rounded-md py-2 font-semibold hover:bg-indigo-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push("/auth/user/login")}
            className="text-sm text-indigo-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;


