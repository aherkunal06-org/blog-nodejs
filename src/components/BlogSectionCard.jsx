"use client";

import { useThemeContext } from "../context/ThemeContext";

export default function BlogSectionCard({ children, className = "", noPadding = false }) {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  const paddingClass = noPadding ? "" : "p-6 md:p-10";

  return (
    <div
      className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-2xl shadow-lg border ${paddingClass} ${className}`}
    >
      {children}
    </div>
  );
}
