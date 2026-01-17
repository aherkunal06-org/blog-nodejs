"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import blogsApi from "../../services/api/blogs.api";
import productsApi from "../../services/api/products.api";
import { useThemeContext } from "../../context/ThemeContext";
import { useDynamicColors } from "../../utils/useDynamicColors";

const HeroWithProduct = () => {
  const { theme } = useThemeContext();
  const colors = useDynamicColors();
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [blogData, productsData] = await Promise.all([
          blogsApi.getFeatured('latest'),
          productsApi.getAll({ status: 'active', limit: 5 }),
        ]);

        if (blogData.blog) {
          setFeaturedBlog(blogData.blog);
        }
        setFeaturedProducts(productsData.products || []);
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (featuredProducts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateReadTime = (content) => {
    if (!content) return "2 min";
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className={`w-full min-h-[70vh] hero-gradient-mesh ${theme === "dark" ? "bg-black" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="relative">
            <div className="w-full h-[500px] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-3xl" />
            <div className="hidden lg:block absolute -bottom-8 right-8 w-80 h-96 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-2xl shadow-2xl" />
          </div>
        </div>
      </section>
    );
  }

  const currentProduct = featuredProducts[currentProductIndex];

  return (
    <section className={`w-full min-h-[70vh] hero-gradient-mesh relative overflow-hidden ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 relative">
        <div className="mb-8 animate-fade-in-up">
          <span className={`font-inter text-sm font-medium tracking-widest uppercase ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}>
            Featured Story
          </span>
        </div>

        <div className="relative">
          {featuredBlog && (
            <Link
              href={`/${featuredBlog.slug}`}
              className="group block animate-fade-in-up animation-delay-100"
            >
              <div className={`relative rounded-3xl overflow-hidden ${
                theme === "dark" ? "bg-gray-900/50" : "bg-white"
              } shadow-xl hover:shadow-2xl transition-all duration-500`}>
                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden img-hover-zoom">
                  {featuredBlog.image ? (
                    <Image
                      src={featuredBlog.image}
                      alt={featuredBlog.imageAlt || featuredBlog.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className={`w-full h-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`} />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-14 lg:pr-96">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featuredBlog.categories.slice(0, 2).map((cat) => (
                        <span
                          key={cat}
                          className="px-4 py-1.5 text-xs font-semibold rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/20"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    <h1 className="heading-editorial text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 max-w-3xl group-hover:text-gray-100 transition-colors">
                      {featuredBlog.title}
                    </h1>

                    {featuredBlog.metaDescription && (
                      <p className="font-inter text-gray-200 text-base md:text-lg mb-6 max-w-2xl line-clamp-2">
                        {featuredBlog.metaDescription}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                          {(featuredBlog.author.username || featuredBlog.author.name || "A")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {featuredBlog.author.username || featuredBlog.author.name}
                          </p>
                          <p className="text-gray-300 text-xs">
                            {formatDate(featuredBlog.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{calculateReadTime(featuredBlog.metaDescription || "")}</span>
                      </div>

                      <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors">
                        Read Article
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {currentProduct && (
            <div className="hidden lg:block absolute -bottom-6 right-8 w-80 animate-slide-in-right animation-delay-300 z-10">
              <div className={`rounded-2xl overflow-hidden shadow-2xl card-hover-lift ${
                theme === "dark" ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-100"
              }`}>
                <div className="flex justify-center gap-1.5 pt-3 pb-2">
                  {featuredProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentProductIndex(index);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentProductIndex ? "w-6 bg-purple-500" : "w-1.5 bg-gray-300 dark:bg-gray-700"
                      }`}
                      aria-label={`View product ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="px-4 pb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured Product
                  </span>
                </div>

                {currentProduct.image && (
                  <div className="relative w-full aspect-square mx-4 mb-3 rounded-xl overflow-hidden" style={{ width: 'calc(100% - 2rem)' }}>
                    <Image
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      fill
                      className="object-cover"
                    />
                    {currentProduct.salePrice && currentProduct.price && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                        {Math.round(((currentProduct.price - currentProduct.salePrice) / currentProduct.price) * 100)}% OFF
                      </div>
                    )}
                  </div>
                )}

                <div className="px-4 pb-4">
                  <h3 className={`font-semibold text-base mb-2 line-clamp-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    {currentProduct.name}
                  </h3>

                  {currentProduct.rating > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < Math.floor(currentProduct.rating) ? "text-yellow-400" : "text-gray-300"}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        ({currentProduct.reviewCount})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {formatPrice(currentProduct.salePrice || currentProduct.price)}
                    </span>
                    {currentProduct.salePrice && currentProduct.price && (
                      <span className={`text-sm line-through ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                        {formatPrice(currentProduct.price)}
                      </span>
                    )}
                  </div>

                  <Link
                    href={currentProduct.ipshopyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-4 text-center text-white text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/25"
                  >
                    Shop on ipshopy.com →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {currentProduct && (
          <div className="lg:hidden mt-8 animate-fade-in-up animation-delay-200">
            <div className={`rounded-2xl overflow-hidden shadow-xl ${
              theme === "dark" ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-100"
            }`}>
              <div className="flex">
                {currentProduct.image && (
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <Image
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white mb-2">
                      ⭐ Featured
                    </span>
                    <h3 className={`font-semibold text-sm line-clamp-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {currentProduct.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {formatPrice(currentProduct.salePrice || currentProduct.price)}
                    </span>
                    <Link
                      href={currentProduct.ipshopyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroWithProduct;

