"use client";

import { useThemeContext } from "@/context/ThemeContext";
import HeroWithProduct from "@/components/homepage/HeroWithProduct";
import ProductShowcaseCarousel from "@/components/homepage/ProductShowcaseCarousel";
import LatestProductBlogs from "@/components/homepage/LatestProductBlogs";
import EventsShowcase from "@/components/homepage/EventsShowcase";
import TrendingTopics from "@/components/homepage/TrendingTopics";
import NewsletterSignup from "@/components/homepage/NewsletterSignup";

export default function Home() {
  const { theme } = useThemeContext();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      {/* SECTION 1: Hero with Featured Article + Product Spotlight */}
      <HeroWithProduct />

      {/* SECTION 2: Latest Articles - Magazine Grid */}
      <LatestProductBlogs />

      {/* SECTION 3: Featured Products Carousel */}
      <ProductShowcaseCarousel 
        title="Featured Products" 
        autoRotate={true}
        rotateInterval={4000}
        limit={12}
      />

      {/* SECTION 4: Upcoming Events - Compact Cards */}
      <EventsShowcase />

      {/* SECTION 5: Trending Categories - Compact Pills */}
      <TrendingTopics />

      {/* SECTION 6: Newsletter Banner */}
      <NewsletterSignup />
    </div>
  );
}


