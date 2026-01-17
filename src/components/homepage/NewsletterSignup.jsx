"use client";

import React, { useState } from "react";
import { useThemeContext } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const NewsletterSignup = () => {
  const { theme } = useThemeContext();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement newsletter API endpoint
      toast.success("Thank you for subscribing! Check your email for confirmation.");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`w-full py-16 md:py-24 relative overflow-hidden ${
      theme === "dark" ? "bg-black" : "bg-gray-50"
    }`}>
      <div className="absolute inset-0 hero-gradient-mesh opacity-50" />
      
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 relative">
        <div className={`rounded-3xl overflow-hidden ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 backdrop-blur-sm"
            : "bg-white/90 border border-gray-200/50 backdrop-blur-sm shadow-2xl"
        }`}>
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12 lg:p-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 animate-fade-in-up bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className={`text-sm font-medium ${theme === "dark" ? "text-purple-300" : "text-purple-600"}`}>
                  Join 10,000+ Subscribers
                </span>
              </div>

              <h2 className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-4 animate-fade-in-up animation-delay-100">
                <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Stay in the </span>
                <span className="gradient-text">Loop</span>
              </h2>

              <p className={`font-inter text-base md:text-lg mb-8 animate-fade-in-up animation-delay-200 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                Get exclusive deals, product updates, and expert guides delivered straight to your inbox. Never miss out on what matters.
              </p>

              <form onSubmit={handleSubmit} className="animate-fade-in-up animation-delay-300">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <svg className={`w-5 h-5 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:bg-gray-800"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:shadow-lg"
                      } focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 whitespace-nowrap"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subscribing...
                      </span>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-4 animate-fade-in-up animation-delay-400">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>No spam</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Unsubscribe anytime</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Weekly digest</span>
                </div>
              </div>
            </div>

            <div className={`hidden md:flex items-center justify-center p-8 lg:p-12 ${
              theme === "dark" ? "bg-gray-800/30" : "bg-gradient-to-br from-purple-50 to-blue-50"
            }`}>
              <div className="relative w-full max-w-xs">
                <div className="relative">
                  <div className={`relative z-10 p-6 rounded-2xl shadow-2xl transform rotate-2 animate-float ${
                    theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white"
                  }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>New Deal Alert!</p>
                        <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Just now</p>
                      </div>
                    </div>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      🎉 Exclusive 30% off on electronics. Check it out!
                    </p>
                  </div>

                  <div className={`absolute -bottom-4 -left-4 w-full h-full rounded-2xl -rotate-3 ${
                    theme === "dark" ? "bg-purple-900/30 border border-purple-500/20" : "bg-purple-100"
                  }`} />

                  <div className={`absolute -bottom-8 -left-8 w-full h-full rounded-2xl -rotate-6 ${
                    theme === "dark" ? "bg-blue-900/20 border border-blue-500/10" : "bg-blue-100"
                  }`} />
                </div>

                <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-60 animate-subtle-pulse" />
                <div className="absolute -bottom-2 right-8 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-60 animate-subtle-pulse animation-delay-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;


