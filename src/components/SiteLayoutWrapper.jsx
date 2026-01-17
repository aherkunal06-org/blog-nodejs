"use client";

import { useThemeContext } from "../context/ThemeContext";

const SiteLayoutWrapper = ({ children }) => {
  const { theme } = useThemeContext();

  return (
    <div
      style={{ fontFamily: "'Geist', sans-serif", display: "flex", flexDirection: "column", minHeight: "100vh" }}
      className={`antialiased transition-colors duration-300 ${
        theme === "dark" 
          ? "bg-gray-900 text-gray-100" 
          : "bg-white text-gray-900"
      }`}
    >
      {children}
    </div>
  );
};

export default SiteLayoutWrapper;


