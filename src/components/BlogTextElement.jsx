"use client";

import { useThemeContext } from "../context/ThemeContext";

export default function BlogTextElement({ children, variant = "primary", className = "" }) {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";
  
  const colorClasses = {
    primary: isDark ? "text-gray-100" : "text-gray-900",
    secondary: isDark ? "text-gray-300" : "text-gray-600",
  };

  return <span className={`${colorClasses[variant]} ${className}`}>{children}</span>;
}
