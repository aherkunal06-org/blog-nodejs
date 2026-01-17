"use client";

import { useThemeContext } from "../context/ThemeContext";

export default function BlogPageWrapper({ children }) {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <article className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-white"}`}>
      {children}
    </article>
  );
}
