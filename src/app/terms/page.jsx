"use client";

import { useState, useEffect } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import Image from "next/image";
import { CONFIG } from "@/config/constants.js";

const TermsPage = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";
  const [termsList, setTermsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch(`${CONFIG.API_URL}/information?type=TERMS&status=APPROVED`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch Terms (${res.status})`);

        const data = await res.json();
        if (alive && Array.isArray(data)) setTermsList(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${isDark ? "border-blue-400" : "border-blue-600"}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className={`max-w-md mx-auto text-center p-8 rounded-2xl ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <p className={`${isDark ? "text-red-400" : "text-red-600"}`}>{error}</p>
        </div>
      </div>
    );
  }

  if (termsList.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className={`max-w-md mx-auto text-center p-8 rounded-2xl ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>No Terms content available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} py-12 px-4`}>
      <div className="max-w-4xl mx-auto">
        {termsList.map((term) => (
          <div key={term.id} className={`mb-8 ${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl p-8 shadow-lg`}>
            {term.title && (
              <h1 className={`text-3xl md:text-4xl font-bold mb-6 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
                {term.title}
              </h1>
            )}

            {term.imageUrl && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <Image
                  src={term.imageUrl}
                  alt={term.title || "Terms Image"}
                  width={1200}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div
              className={`prose prose-lg max-w-none ${
                isDark
                  ? "prose-invert text-gray-200 prose-headings:text-white prose-links:text-blue-400"
                  : "text-gray-800 prose-headings:text-gray-900 prose-links:text-blue-600"
              }`}
              dangerouslySetInnerHTML={{ __html: term.content }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsPage;


