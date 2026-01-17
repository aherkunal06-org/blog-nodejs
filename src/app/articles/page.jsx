"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useThemeContext } from "@/context/ThemeContext";
import blogsApi from "@/services/api/blogs.api";
import productsApi from "@/services/api/products.api";

const ITEMS_PER_PAGE = 12;

// Compact Product Ad Card Component
const ProductAdCard = ({ product, theme }) => {
  const formatPrice = (price) => {
    if (!price) return "";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discount = product.salePrice && product.price 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Link
      href={product.ipshopyUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className={`flex gap-3 p-3 rounded-xl transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600"
          : "bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-md"
      }`}>
        {/* Product Image */}
        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
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
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-0 right-0 px-1 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-bl">
              -{discount}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className={`text-xs font-medium line-clamp-2 mb-1 transition-colors ${
            theme === "dark"
              ? "text-gray-200 group-hover:text-purple-400"
              : "text-gray-800 group-hover:text-purple-600"
          }`}>
            {product.name}
          </h4>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
              {formatPrice(product.salePrice || product.price)}
            </span>
            {product.salePrice && product.price && (
              <span className={`text-[10px] line-through ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function ArticlesPage() {
  const { theme } = useThemeContext();
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBlogs = useCallback(async (page) => {
    try {
      setLoading(true);
      const data = await blogsApi.getWithProducts({ 
        limit: ITEMS_PER_PAGE, 
        page, 
        diverse: true 
      });
      setBlogs(data.blogs || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await productsApi.getAll({ status: 'active', adminPriority: 80, limit: 4 });
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  useEffect(() => {
    fetchBlogs(currentPage);
    fetchProducts();
  }, [currentPage, fetchBlogs, fetchProducts]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return "2 min";
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return `${Math.ceil(words / 200)} min`;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-gray-50"}`}>
      {/* Hero Header */}
      <section className={`w-full py-12 md:py-16 hero-gradient-mesh relative ${theme === "dark" ? "bg-black" : "bg-white"}`}>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
          <div className="text-center animate-fade-in-up">
            <span className={`font-inter text-sm font-medium tracking-widest uppercase ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}>
              Latest Stories
            </span>
            <h1 className="heading-editorial text-3xl md:text-4xl lg:text-5xl mt-3 mb-4">
              <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Browse </span>
              <span className="gradient-text">Articles</span>
            </h1>
            <p className={`font-inter text-base md:text-lg max-w-xl mx-auto ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              Find helpful guides, honest reviews, and tips to shop smarter.
            </p>
            
            {pagination && (
              <div className={`mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                theme === "dark" ? "bg-gray-800/50 text-gray-400" : "bg-gray-100 text-gray-600"
              }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{pagination.total} articles to explore</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content - Articles Grid + Sidebar */}
      <section className={`w-full py-10 md:py-14 ${theme === "dark" ? "bg-black" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Articles Grid - Main Content */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                  {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-80 ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"} animate-pulse rounded-2xl`}
                    />
                  ))}
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-16">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                  }`}>
                    <svg className={`w-10 h-10 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    No articles found
                  </h3>
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                    Check back soon for new content!
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                    {blogs.map((blog, index) => (
                      <Link
                        key={blog.id}
                        href={`/${blog.slug}`}
                        className={`group block animate-fade-in-up`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <article className={`h-full rounded-2xl overflow-hidden transition-all duration-300 card-hover-lift ${
                          theme === "dark"
                            ? "bg-gray-900 border border-gray-800 hover:border-gray-700"
                            : "bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl"
                        }`}>
                          {/* Image */}
                          <div className="relative w-full h-40 overflow-hidden img-hover-zoom">
                            {blog.image ? (
                              <Image
                                src={blog.image}
                                alt={blog.imageAlt || blog.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center ${
                                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                              }`}>
                                <svg className={`w-10 h-10 ${theme === "dark" ? "text-gray-700" : "text-gray-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            
                            {/* Read time badge */}
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/90 text-gray-700 backdrop-blur-sm">
                              {calculateReadTime(blog.metaDescription)} read
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            {/* Title */}
                            <h2 className={`font-semibold text-sm mb-1.5 line-clamp-2 transition-colors ${
                              theme === "dark"
                                ? "text-white group-hover:text-purple-400"
                                : "text-gray-900 group-hover:text-purple-600"
                            }`}>
                              {blog.title}
                            </h2>

                            {/* Description */}
                            {blog.metaDescription && (
                              <p className={`text-xs mb-3 line-clamp-2 ${
                                theme === "dark" ? "text-gray-400" : "text-gray-600"
                              }`}>
                                {blog.metaDescription}
                              </p>
                            )}

                            {/* Meta */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-semibold">
                                  {(blog.author.username || blog.author.name || "A")[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className={`text-[10px] font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                    {blog.author.username || blog.author.name}
                                  </p>
                                  <p className={`text-[10px] ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                                    {formatDate(blog.createdAt)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                                theme === "dark" ? "text-purple-400" : "text-purple-600"
                              }`}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                      {/* Previous Button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        } ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                          .filter(page => {
                            return page === 1 || 
                                   page === pagination.totalPages || 
                                   Math.abs(page - currentPage) <= 1;
                          })
                          .map((page, index, array) => {
                            const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                            
                            return (
                              <React.Fragment key={page}>
                                {showEllipsisBefore && (
                                  <span className={`px-2 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
                                    ...
                                  </span>
                                )}
                                <button
                                  onClick={() => handlePageChange(page)}
                                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    page === currentPage
                                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                                      : theme === "dark"
                                        ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                  }`}
                                >
                                  {page}
                                </button>
                              </React.Fragment>
                            );
                          })}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          currentPage === pagination.totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        } ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Page Info */}
                  {pagination && (
                    <p className={`text-center mt-3 text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                      Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, pagination.total)} of {pagination.total} articles
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Sidebar - Product Ads */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                {/* Featured Products Section */}
                <div className={`rounded-2xl p-4 ${
                  theme === "dark"
                    ? "bg-gradient-to-b from-gray-900 to-gray-900/50 border border-gray-800"
                    : "bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-sm"
                }`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`font-semibold text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        Featured Products
                      </h3>
                      <p className={`text-[10px] ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                        Handpicked for you
                      </p>
                    </div>
                  </div>

                  {/* Product Cards */}
                  <div className="space-y-3">
                    {products.length > 0 ? (
                      products.map((product) => (
                        <ProductAdCard key={product.id} product={product} theme={theme} />
                      ))
                    ) : (
                      // Loading skeleton
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={`h-20 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} animate-pulse rounded-xl`} />
                      ))
                    )}
                  </div>

                  {/* View All Link */}
                  <Link
                    href="https://ipshopy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    View All Products
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>

                {/* Ad Label */}
                <p className={`text-center mt-2 text-[10px] ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
                  Sponsored
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

