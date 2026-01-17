"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { CONFIG } from "../config/constants.js";

const API_URL = CONFIG.API_URL;

// Default fallback colors
const defaultColors = {
  primary_color: "#9333ea",
  secondary_color: "#3b82f6",
  accent_color: "#ec4899",
  header_bg_color: "#ffffff",
  footer_bg_color: "#1e293b",
  text_color: "#1f2937",
  link_color: "#9333ea",
  button_primary_color: "#9333ea",
  button_secondary_color: "#3b82f6",
  default_theme: "light",
};

const SiteSettingsContext = createContext(undefined);

export const SiteSettingsProvider = ({ children }) => {
  const [colors, setColors] = useState(defaultColors);
  const [loading, setLoading] = useState(true);

  const applyColorsToDocument = (colorsToApply) => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", colorsToApply.primary_color);
    root.style.setProperty("--color-secondary", colorsToApply.secondary_color);
    root.style.setProperty("--color-accent", colorsToApply.accent_color);
    root.style.setProperty("--color-header-bg", colorsToApply.header_bg_color);
    root.style.setProperty("--color-footer-bg", colorsToApply.footer_bg_color);
    root.style.setProperty("--color-text", colorsToApply.text_color);
    root.style.setProperty("--color-link", colorsToApply.link_color);
    root.style.setProperty("--color-button-primary", colorsToApply.button_primary_color);
    root.style.setProperty("--color-button-secondary", colorsToApply.button_secondary_color);
  };

  const fetchColors = async () => {
    try {
      const res = await fetch(`${API_URL}/site-settings/public`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          const colorsMap = {};
          data.settings.forEach((setting) => {
            if (setting.value) {
              colorsMap[setting.key_name] = setting.value;
            }
          });

          const mergedColors = {
            primary_color: colorsMap.primary_color || defaultColors.primary_color,
            secondary_color: colorsMap.secondary_color || defaultColors.secondary_color,
            accent_color: colorsMap.accent_color || defaultColors.accent_color,
            header_bg_color: colorsMap.header_bg_color || defaultColors.header_bg_color,
            footer_bg_color: colorsMap.footer_bg_color || defaultColors.footer_bg_color,
            text_color: colorsMap.text_color || defaultColors.text_color,
            link_color: colorsMap.link_color || defaultColors.link_color,
            button_primary_color: colorsMap.button_primary_color || defaultColors.button_primary_color,
            button_secondary_color: colorsMap.button_secondary_color || defaultColors.button_secondary_color,
            default_theme: colorsMap.default_theme || defaultColors.default_theme,
          };

          setColors(mergedColors);
          applyColorsToDocument(mergedColors);
        } else {
          applyColorsToDocument(defaultColors);
        }
      } else {
        applyColorsToDocument(defaultColors);
      }
    } catch (error) {
      console.error("Error fetching site colors:", error);
      applyColorsToDocument(defaultColors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const refreshColors = async () => {
    setLoading(true);
    await fetchColors();
  };

  return (
    <SiteSettingsContext.Provider value={{ colors, loading, refreshColors }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    return { colors: defaultColors, loading: false, refreshColors: async () => {} };
  }
  return context;
};


