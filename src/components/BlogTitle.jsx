"use client";

import { useThemeContext } from "../context/ThemeContext";

export default function BlogTitle({ children }) {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
      {children}
    </h1>
  );
}
