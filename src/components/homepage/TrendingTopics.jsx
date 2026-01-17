"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import blogsApi from "../../services/api/blogs.api";
import { useThemeContext } from "../../context/ThemeContext";

const TrendingTopics = () => {
  const { theme } = useThemeContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await blogsApi.getTrendingCategories(10);
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching trending categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryEmoji = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes("tech") || nameLower.includes("electronic")) return "💻";
    if (nameLower.includes("fashion") || nameLower.includes("cloth")) return "👗";
    if (nameLower.includes("home") || nameLower.includes("kitchen")) return "🏠";
    if (nameLower.includes("beauty") || nameLower.includes("skin")) return "✨";
    if (nameLower.includes("health") || nameLower.includes("fitness")) return "💪";
    if (nameLower.includes("food") || nameLower.includes("grocery")) return "🍕";
    if (nameLower.includes("book") || nameLower.includes("education")) return "📚";
    if (nameLower.includes("game") || nameLower.includes("toy")) return "🎮";
    if (nameLower.includes("sport")) return "⚽";
    if (nameLower.includes("travel")) return "✈️";
    if (nameLower.includes("pet") || nameLower.includes("animal")) return "🐾";
    if (nameLower.includes("garden") || nameLower.includes("plant")) return "🌱";
    if (nameLower.includes("baby") || nameLower.includes("kid")) return "👶";
    if (nameLower.includes("office") || nameLower.includes("stationery")) return "📎";
    return "📦";
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <section className={`w-full py-10 md:py-14 ${theme === "dark" ? "bg-gray-900/30" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`flex-shrink-0 w-36 h-16 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} animate-pulse rounded-full`} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className={`w-full py-10 md:py-14 ${theme === "dark" ? "bg-gray-900/30" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-6 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <h2 className={`font-semibold text-lg md:text-xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Explore Topics
            </h2>
            <div className={`hidden md:block h-px flex-1 max-w-[100px] ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`} />
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className={`p-2 rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              }`}
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className={`p-2 rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              }`}
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative">
          <div className={`hidden md:block absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none ${
            theme === "dark" ? "bg-gradient-to-r from-gray-900/30 to-transparent" : "bg-gradient-to-r from-white to-transparent"
          }`} />
          <div className={`hidden md:block absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none ${
            theme === "dark" ? "bg-gradient-to-l from-gray-900/30 to-transparent" : "bg-gradient-to-l from-white to-transparent"
          }`} />

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth-x scrollbar-hide pb-2 -mx-4 px-4"
          >
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/articles/${category.slug}`}
                className={`group flex-shrink-0 animate-fade-in-up`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gray-800/80 hover:bg-gray-700 border border-gray-700/50 hover:border-gray-600"
                    : "bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}>
                  <span className="text-xl flex-shrink-0">
                    {getCategoryEmoji(category.name)}
                  </span>
                  
                  <div className="flex flex-col">
                    <span className={`font-semibold text-sm whitespace-nowrap transition-colors ${
                      theme === "dark"
                        ? "text-white group-hover:text-purple-400"
                        : "text-gray-900 group-hover:text-purple-600"
                    }`}>
                      {category.name}
                    </span>
                    <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                      {category.blogCount} articles
                    </span>
                  </div>

                  <svg 
                    className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-1 group-hover:ml-0 ${
                      theme === "dark" ? "text-purple-400" : "text-purple-600"
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}

            <Link
              href="/articles"
              className="flex-shrink-0 animate-fade-in-up"
              style={{ animationDelay: `${categories.length * 50}ms` }}
            >
              <div className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30"
                  : "bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border border-purple-200"
              }`}>
                <span className={`font-semibold text-sm whitespace-nowrap ${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`}>
                  View All Topics
                </span>
                <svg className={`w-4 h-4 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingTopics;

