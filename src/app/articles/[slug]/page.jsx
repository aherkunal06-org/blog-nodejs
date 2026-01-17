import { CONFIG } from "@/config/constants";
import CategoryPageClient from "./CategoryPageClient";

// Generate static params for ISR (Incremental Static Regeneration)
// Optional: Pre-renders category pages at build time for better performance
// If API is unavailable, routes will be generated on-demand (SSR)
export async function generateStaticParams() {
  try {
    if (!CONFIG?.API_URL) return [];
    
    const apiUrl = `${CONFIG.API_URL}/blogs/categories?status=approved`;
    
    const response = await fetch(apiUrl, {
      // Use revalidate for ISR - cache for 1 hour
      next: { revalidate: 3600 },
    });
    
    if (!response || !response.ok) return [];
    
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return [];
    
    const data = await response.json();
    const categories = data?.categories || data?.data || [];
    
    if (Array.isArray(categories) && categories.length > 0) {
      return categories
        .filter((cat) => cat?.slug)
        .map((cat) => ({ slug: String(cat.slug) }));
    }
  } catch (error) {
    // If API fails, return empty array - routes will be generated on-demand
    console.warn('generateStaticParams: API unavailable, using SSR fallback');
  }
  
  return [];
}

// Allow dynamic routes - if slug not in generateStaticParams, generate on-demand
export const dynamicParams = true;

// Enable dynamic rendering for real-time content
export const dynamic = 'force-dynamic';

export default function CategoryPage() {
  return <CategoryPageClient />;
}
