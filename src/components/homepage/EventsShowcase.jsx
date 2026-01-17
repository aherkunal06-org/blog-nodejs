"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import eventsApi from "../../services/api/events.api";
import { useThemeContext } from "../../context/ThemeContext";

const EventsShowcase = () => {
  const { theme } = useThemeContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventsApi.getUpcoming({ limit: 3, featured: true });
        const fetchedEvents = data.events || [];
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getDaysUntil = (dateString) => {
    const now = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <section className={`w-full py-12 md:py-16 ${theme === "dark" ? "bg-black" : "bg-gray-50/50"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex-shrink-0 w-80 h-40 ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"} animate-pulse rounded-2xl`} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section className={`w-full py-12 md:py-16 ${theme === "dark" ? "bg-black" : "bg-gray-50/50"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-8 animate-fade-in-up">
          <div>
            <span className={`font-inter text-sm font-medium tracking-widest uppercase ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}>
              Don&apos;t Miss Out
            </span>
            <h2 className="heading-editorial text-2xl md:text-3xl mt-2">
              <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Upcoming </span>
              <span className="gradient-text">Events</span>
            </h2>
          </div>
          <Link
            href="https://ipshopy.com/events"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden md:flex items-center gap-2 text-sm font-semibold transition-colors ${
              theme === "dark" ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-700"
            }`}
          >
            View All Events
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {events.map((event, index) => {
            const daysUntil = getDaysUntil(event.startDate);
            const dateInfo = formatDate(event.startDate);
            
            return (
              <Link
                key={event.id}
                href={event.eventUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`relative h-full rounded-2xl overflow-hidden transition-all duration-300 card-hover-lift ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 hover:border-purple-500/40"
                    : "bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 hover:border-purple-200"
                }`}>
                  <div className="flex h-full">
                    <div className={`flex-shrink-0 w-20 flex flex-col items-center justify-center py-6 ${
                      theme === "dark" ? "bg-purple-600/20" : "bg-purple-100"
                    }`}>
                      <span className={`text-3xl font-bold ${
                        theme === "dark" ? "text-purple-400" : "text-purple-600"
                      }`}>
                        {dateInfo.day}
                      </span>
                      <span className={`text-sm font-semibold uppercase ${
                        theme === "dark" ? "text-purple-300" : "text-purple-500"
                      }`}>
                        {dateInfo.month}
                      </span>
                    </div>

                    <div className="flex-1 p-4 flex flex-col justify-center">
                      {daysUntil > 0 && daysUntil <= 7 && (
                        <span className={`inline-flex self-start items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2 ${
                          theme === "dark"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          🔥 {daysUntil} {daysUntil === 1 ? "day" : "days"} left
                        </span>
                      )}

                      <h3 className={`font-semibold text-base line-clamp-2 mb-1 transition-colors ${
                        theme === "dark"
                          ? "text-white group-hover:text-purple-400"
                          : "text-gray-900 group-hover:text-purple-600"
                      }`}>
                        {event.title}
                      </h3>

                      <div className={`flex items-center gap-3 text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {dateInfo.time}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1 truncate max-w-[120px]">
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={`flex-shrink-0 self-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                      theme === "dark" ? "text-purple-400" : "text-purple-600"
                    }`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {event.image && index === 0 && (
                    <div className="absolute inset-0 opacity-10">
                      <Image
                        src={event.image}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link
            href="https://ipshopy.com/events"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 text-sm font-semibold ${
              theme === "dark" ? "text-purple-400" : "text-purple-600"
            }`}
          >
            View All Events
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsShowcase;

