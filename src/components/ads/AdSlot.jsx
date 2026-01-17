"use client";

import React, { useEffect, useState } from "react";
import apiClient from "../../lib/api-client";
import { useThemeContext } from "../../context/ThemeContext";

const AdSlot = ({
  placement,
  blogSlug,
  categorySlug,
  isHomepage = false,
  maxAds = 3,
  className = "",
}) => {
  const { theme } = useThemeContext();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        let url = "";

        if (blogSlug) {
          url = `/ads/for-blog/${blogSlug}?placement=${placement}&maxAds=${maxAds}`;
        } else if (isHomepage) {
          url = `/ads/for-homepage?placement=${placement}&maxAds=${maxAds}`;
        } else if (categorySlug) {
          url = `/ads/for-category/${categorySlug}?placement=${placement}&maxAds=${maxAds}`;
        } else {
          setLoading(false);
          return;
        }

        const res = await apiClient.get(url);
        setAds(res.data.ads || []);
      } catch (error) {
        console.error("Error fetching ads:", error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [placement, blogSlug, categorySlug, isHomepage, maxAds]);

  if (loading) {
    const gridClass = placement === "after-content" 
      ? "grid grid-cols-2 lg:grid-cols-4 gap-4"
      : placement === "sidebar"
        ? "space-y-4"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";
    
    return (
      <div className={`${className} ${gridClass}`}>
        {Array.from({ length: maxAds }).map((_, i) => (
          <div
            key={i}
            className={`h-48 ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-200"
            } animate-pulse rounded-lg`}
          />
        ))}
      </div>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  // For now, return null - AdItem component can be added later
  return null;
};

export default AdSlot;


