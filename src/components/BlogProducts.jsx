"use client";

import React, { useEffect, useState } from "react";
import ProductWidget from "./ProductWidget";
import { useThemeContext } from "../context/ThemeContext";
import blogsApi from "../services/api/blogs.api";
import { CONFIG } from "../config/constants.js";

const BlogProducts = ({
  blogSlug,
  title = "Products Mentioned",
  variant = "grid",
  limit,
}) => {
  const { theme } = useThemeContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${CONFIG.API_URL}/blogs/${blogSlug}/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        let fetchedProducts = data.products || [];
        
        if (limit) {
          fetchedProducts = fetchedProducts.slice(0, limit);
        }
        
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching blog products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (blogSlug) {
      fetchProducts();
    }
  }, [blogSlug, limit]);

  if (loading) {
    return (
      <div className="w-full">
        {variant === "sidebar" ? (
          <div className="space-y-2">
            {Array.from({ length: limit || 3 }).map((_, i) => (
              <div
                key={i}
                className={`h-14 ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                } animate-pulse rounded-lg`}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: limit || 4 }).map((_, i) => (
              <div
                key={i}
                className={`h-48 ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                } animate-pulse rounded-lg`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  // Sidebar variant
  if (variant === "sidebar") {
    return (
      <div className="w-full">
        <h4
          className={`text-sm font-semibold mb-3 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {title}
        </h4>
        <div className="space-y-2">
          {products.map((product) => (
            <ProductWidget
              key={product.id}
              product={product}
              variant="sidebar"
            />
          ))}
        </div>
      </div>
    );
  }

  // Grid variant
  return (
    <div className="w-full">
      <h3
        className={`text-xl font-bold mb-4 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h3>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductWidget
            key={product.id}
            product={product}
            variant="card"
          />
        ))}
      </div>
    </div>
  );
};

export default BlogProducts;
