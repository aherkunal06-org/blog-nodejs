"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import apiClient from "../lib/api-client";
import { useThemeContext } from "../context/ThemeContext";
import { useDynamicColors } from "../utils/useDynamicColors";

const ProductWidget = ({
  product,
  variant = "card",
}) => {
  const { theme } = useThemeContext();
  const colors = useDynamicColors();

  const trackClick = async () => {
    try {
      await apiClient.post("/products/click", { productId: product.id });
    } catch (error) {
      // Silent fail for analytics
    }
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (variant === "inline") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        {product.image && (
          <div className="relative w-8 h-8 rounded overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <Link
          href={product.ipshopyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackClick}
          className="font-medium text-purple-600 hover:text-purple-700"
        >
          {product.name}
        </Link>
        {product.salePrice ? (
          <span className="text-sm font-semibold text-purple-600">
            {formatPrice(product.salePrice)}
          </span>
        ) : product.price ? (
          <span className="text-sm text-gray-600">{formatPrice(product.price)}</span>
        ) : null}
      </div>
    );
  }

  // Compact sidebar variant
  if (variant === "sidebar") {
    const discount = product.salePrice && product.price 
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

    return (
      <div className={`group flex items-center gap-3 p-2 rounded-lg border transition-all duration-200 ${
        theme === "dark"
          ? "border-gray-700 hover:border-gray-600 hover:bg-gray-800/30"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}>
        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            }`}>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-0 right-0 px-0.5 py-0 bg-red-500 text-white text-[8px] font-bold rounded-bl">
              -{discount}%
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4
            className={`text-[11px] font-medium line-clamp-2 mb-0.5 transition-colors ${
              theme === "dark" 
                ? "text-gray-200 group-hover:text-purple-400" 
                : "text-gray-800 group-hover:text-purple-600"
            }`}
          >
            {product.name}
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.salePrice && product.price && (
                <span className={`text-[9px] line-through ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <Link
              href={product.ipshopyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackClick}
              className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              Shop →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div
      className={`group flex flex-col rounded-xl overflow-hidden border ${
        theme === "dark"
          ? "bg-gray-900 border-gray-800 hover:border-gray-700"
          : "bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
      } transition-all duration-300`}
    >
      <div className="relative w-full aspect-square">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <span
              className={`text-xs ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              No Image
            </span>
          </div>
        )}
        {product.salePrice && product.price && (
          <div className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            {Math.round(
              ((product.price - product.salePrice) / product.price) * 100
            )}% OFF
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3
          className={`font-medium text-xs mb-1.5 line-clamp-2 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-2">
          {product.salePrice ? (
            <>
              <span
                className={`font-bold text-sm ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {formatPrice(product.salePrice)}
              </span>
              {product.price && (
                <span
                  className={`text-[10px] line-through ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {formatPrice(product.price)}
                </span>
              )}
            </>
          ) : (
            product.price && (
              <span
                className={`font-bold text-sm ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {formatPrice(product.price)}
              </span>
            )
          )}
        </div>

        <Link
          href={product.ipshopyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackClick}
          className="mt-auto w-full py-1.5 px-3 text-center text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
          style={{
            background: colors.getGradient("primary", "secondary"),
          }}
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default ProductWidget;
