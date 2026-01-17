"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import productsApi from "../../services/api/products.api";
import { useThemeContext } from "../../context/ThemeContext";

const ProductShowcaseCarousel = ({
  title = "Featured Products",
  autoRotate = true,
  rotateInterval = 4000,
  limit = 12,
}) => {
  const { theme } = useThemeContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getAll({ status: 'active', limit });
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  useEffect(() => {
    if (!autoRotate || isPaused || products.length <= 4 || !scrollRef.current) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const cardWidth = 280;
        
        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, isPaused, products.length, rotateInterval]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
        behavior: "smooth",
      });
    }
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <section className={`w-full py-16 md:py-20 ${theme === "dark" ? "bg-gray-900/50" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-64 h-80 ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                } animate-pulse rounded-2xl`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className={`w-full py-16 md:py-20 ${theme === "dark" ? "bg-gray-900/50" : "bg-white"}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-10 animate-fade-in-up">
          <div>
            <span className={`font-inter text-sm font-medium tracking-widest uppercase ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}>
              Shop Now
            </span>
            <h2 className="heading-editorial text-3xl md:text-4xl lg:text-5xl mt-2">
              <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{title.split(" ")[0]} </span>
              <span className="gradient-text">{title.split(" ").slice(1).join(" ") || "Products"}</span>
            </h2>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className={`p-3 rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                  : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-md hover:shadow-lg"
              }`}
              aria-label="Previous products"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className={`p-3 rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                  : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-md hover:shadow-lg"
              }`}
              aria-label="Next products"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative">
          <div className={`hidden md:block absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none ${
            theme === "dark" 
              ? "bg-gradient-to-r from-gray-900/50 to-transparent" 
              : "bg-gradient-to-r from-white to-transparent"
          }`} />
          <div className={`hidden md:block absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none ${
            theme === "dark" 
              ? "bg-gradient-to-l from-gray-900/50 to-transparent" 
              : "bg-gradient-to-l from-white to-transparent"
          }`} />

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth-x scrollbar-hide pb-4 -mx-4 px-4"
          >
            {products.map((product, index) => (
              <Link
                key={product.id}
                href={product.ipshopyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex-shrink-0 w-64 animate-fade-in-up`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`h-full rounded-2xl overflow-hidden transition-all duration-300 card-hover-lift ${
                  theme === "dark"
                    ? "bg-gray-800/50 border border-gray-700/50 hover:border-gray-600"
                    : "bg-gray-50 border border-gray-100 hover:border-gray-200"
                }`}>
                  <div className="relative w-full aspect-square overflow-hidden img-hover-zoom">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                      }`}>
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {product.salePrice && product.price && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg">
                        {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-full shadow-lg">
                        View Product
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                          ({product.reviewCount})
                        </span>
                      </div>
                    )}

                    <h3 className={`font-semibold text-sm mb-3 line-clamp-2 min-h-[40px] transition-colors ${
                      theme === "dark"
                        ? "text-white group-hover:text-purple-400"
                        : "text-gray-900 group-hover:text-purple-600"
                    }`}>
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {formatPrice(product.salePrice || product.price)}
                      </span>
                      {product.salePrice && product.price && (
                        <span className={`text-sm line-through ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    <div className="w-full py-2.5 px-4 text-center text-white text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 group-hover:from-purple-700 group-hover:to-blue-700 transition-all duration-300 shadow-md shadow-purple-500/20">
                      Shop on ipshopy.com
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="https://ipshopy.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-800 text-white border border-gray-700"
                : "bg-white text-gray-900 border border-gray-200 shadow-md"
            }`}
          >
            View All Products
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseCarousel;

