"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import blogsApi from "../../services/api/blogs.api";
import { useThemeContext } from "../../context/ThemeContext";

const LatestProductBlogs = () => {
  const { theme } = useThemeContext();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogsApi.getWithProducts({ limit: 5, diverse: true });
        setBlogs(data.blogs || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return "2 min";
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return `${Math.ceil(words / 200)} min`;
  };

  if (loading) {
    return (
      <section className={`w-full py-16 md:py-24 ${theme === "dark" ? "bg-black" : "bg-gray-50/50"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[400px] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!loading && blogs.length === 0) {
    return (
      <section className={`w-full py-16 md:py-24 ${theme === "dark" ? "bg-black" : "bg-gray-50/50"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="heading-editorial text-3xl md:text-4xl mb-4">
            <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Latest </span>
            <span className="gradient-text">Articles</span>
          </h2>
          <p className={`font-inter ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            No articles available yet. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  const featuredBlog = blogs[0];
  const sideBblogs = blogs.slice(1, 5);

  return (
    <section className={`w-full py-16 md:py-24 ${theme === "dark" ? "bg-black" : "bg-gray-50/50"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-10 animate-fade-in-up">
          <div>
            <span className={`font-inter text-sm font-medium tracking-widest uppercase ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}>
              Fresh Reads
            </span>
            <h2 className="heading-editorial text-3xl md:text-4xl lg:text-5xl mt-2">
              <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Latest </span>
              <span className="gradient-text">Articles</span>
            </h2>
          </div>
          <Link
            href="/articles"
            className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-900 text-white border border-gray-800 hover:bg-gray-800"
                : "bg-white text-gray-900 border border-gray-200 hover:shadow-lg"
            }`}
          >
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredBlog && (
            <Link
              href={`/${featuredBlog.slug}`}
              className="lg:col-span-2 group animate-fade-in-up animation-delay-100"
            >
              <article className={`relative h-full min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden card-hover-lift ${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              } shadow-lg`}>
                <div className="absolute inset-0 img-hover-zoom">
                  {featuredBlog.image ? (
                    <Image
                      src={featuredBlog.image}
                      alt={featuredBlog.imageAlt || featuredBlog.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10">
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/20">
                      Featured Article
                    </span>
                  </div>

                  <h3 className="heading-editorial text-white text-2xl md:text-3xl lg:text-4xl mb-3 group-hover:text-gray-100 transition-colors">
                    {featuredBlog.title}
                  </h3>

                  {featuredBlog.metaDescription && (
                    <p className="font-inter text-gray-300 text-sm md:text-base mb-4 line-clamp-2 max-w-2xl">
                      {featuredBlog.metaDescription}
                    </p>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                        {(featuredBlog.author.username || featuredBlog.author.name || "A")[0].toUpperCase()}
                      </div>
                      <span className="text-white text-sm font-medium">
                        {featuredBlog.author.username || featuredBlog.author.name}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {formatDate(featuredBlog.createdAt)}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {calculateReadTime(featuredBlog.metaDescription)}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          )}

          <div className="space-y-4 lg:space-y-5">
            {sideBblogs.map((blog, index) => (
              <Link
                key={blog.id}
                href={`/${blog.slug}`}
                className={`group block animate-fade-in-up`}
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <article className={`flex gap-4 p-3 rounded-2xl transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gray-900/50 hover:bg-gray-900 border border-gray-800/50 hover:border-gray-700"
                    : "bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-lg"
                }`}>
                  <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden img-hover-zoom">
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.imageAlt || blog.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`} />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h4 className={`font-semibold text-sm md:text-base line-clamp-2 mb-2 transition-colors ${
                      theme === "dark"
                        ? "text-white group-hover:text-purple-400"
                        : "text-gray-900 group-hover:text-purple-600"
                    }`}>
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>
                        {formatDate(blog.createdAt)}
                      </span>
                      <span className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {calculateReadTime(blog.metaDescription)}
                      </span>
                    </div>
                  </div>

                  <div className={`self-center opacity-0 group-hover:opacity-100 transition-opacity ${
                    theme === "dark" ? "text-purple-400" : "text-purple-600"
                  }`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        <div className="md:hidden mt-8 text-center animate-fade-in-up animation-delay-500">
          <Link
            href="/articles"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-900 text-white border border-gray-800"
                : "bg-white text-gray-900 border border-gray-200 shadow-md"
            }`}
          >
            View All Articles
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestProductBlogs;

