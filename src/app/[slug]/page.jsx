import { notFound } from "next/navigation";
import Image from "next/image";
import BlogComments from "@/components/BlogComments";
import BlogProducts from "@/components/BlogProducts";
import AdSlot from "@/components/ads/AdSlot";
import BlogPageWrapper from "@/components/BlogPageWrapper";
import BlogSectionCard from "@/components/BlogSectionCard";
import BlogTitle from "@/components/BlogTitle";
import BlogMetaInfo from "@/components/BlogMetaInfo";
import BlogHeading from "@/components/BlogHeading";
import FAQItem from "@/components/FAQItem";
import BlogProseContent from "@/components/BlogProseContent";
import blogsApi from "@/services/api/blogs.api";
import { CONFIG } from "@/config/constants.js";

// Generate static params for ISR (Incremental Static Regeneration)
// Optional: Pre-renders popular blog posts at build time for better performance
// If API is unavailable, routes will be generated on-demand (SSR)
export async function generateStaticParams() {
  try {
    if (!CONFIG?.API_URL) return [];
    
    const apiUrl = `${CONFIG.API_URL}/blogs?limit=1000&fields=slug`;
    
    const response = await fetch(apiUrl, {
      // Use revalidate for ISR - cache for 1 hour
      next: { revalidate: 3600 },
    });
    
    if (!response || !response.ok) return [];
    
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return [];
    
    const data = await response.json();
    const blogs = data?.blogs || data?.data || [];
    
    if (Array.isArray(blogs) && blogs.length > 0) {
      return blogs
        .filter((blog) => blog?.slug)
        .map((blog) => ({ slug: String(blog.slug) }));
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

async function getBlogBySlug(slug) {
  try {
    const data = await blogsApi.getBySlug(slug);
    return data.blog || null;
  } catch (err) {
    console.error("Error fetching blog:", err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Blog Post Not Found", description: "Blog not found" };

  const keywordsArray = blog.metaKeywords
    ? blog.metaKeywords.split(",").map((kw) => kw.trim())
    : blog.metaTitle
      ? blog.metaTitle.split(" ").map((w) => w.toLowerCase())
      : blog.title.split(" ").map((w) => w.toLowerCase());

  const baseUrl = CONFIG.BASE_URL;

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.title,
    keywords: keywordsArray.join(", "),
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.title,
      url: `${baseUrl}/${blog.slug}`,
      siteName: "ipshopyBlogs",
      images: blog.image ? [{ url: blog.image, width: 800, height: 600, alt: blog.title }] : [],
      type: "article",
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
    },
    twitter: {
      card: blog.image ? "summary_large_image" : "summary",
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.title,
      creator: blog.author.username ? `@${blog.author.username}` : undefined,
      images: blog.image ? [blog.image] : [],
    },
    alternates: { canonical: `${baseUrl}/${blog.slug}` },
  };
}

export default async function BlogPage({ params }) {
  const { slug } = await params;
  
  // Exclude known non-blog routes and file extensions
  const excludedPaths = ['admin', 'articles', 'about', 'contact', 'events', 'privacy-policy', 'terms', 'profile', 'auth'];
  const fileExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.css', '.js', '.json', '.xml'];
  
  // Check if slug is an excluded path
  if (excludedPaths.includes(slug)) {
    notFound();
  }
  
  // Check if slug has a file extension (static file)
  if (fileExtensions.some(ext => slug.toLowerCase().endsWith(ext))) {
    notFound();
  }
  
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <BlogPageWrapper>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-5 pt-12">
        {/* Main Content Area - 2 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            {/* Title */}
            <BlogTitle>{blog.title}</BlogTitle>

            {/* Author & Date Info */}
            <BlogMetaInfo
              author={blog.author.username || blog.author.name || "Anonymous"}
              createdAt={formatDate(blog.createdAt)}
              updatedAt={formatDate(blog.updatedAt)}
            />

            {/* Featured Image */}
            {blog.image && (
              <div className="w-full h-64 sm:h-80 md:h-96 relative rounded-2xl overflow-hidden shadow-xl mb-10 group">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            )}

            {/* Article Content */}
            <BlogProseContent content={blog.content} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 self-start lg:sticky lg:top-24 space-y-4 p-4">
            {/* Featured Products Sidebar */}
            <BlogSectionCard noPadding className="p-4 md:p-6">
              <BlogProducts blogSlug={blog.slug} variant="sidebar" limit={3} title="Recommended Products" />
            </BlogSectionCard>

            {/* Ads Sidebar */}
            <AdSlot
              placement="sidebar"
              blogSlug={blog.slug}
              maxAds={2}
              className="space-y-4"
            />
          </div>
        </div>

        {/* Full Width Sections Below */}

        {/* Similar Articles Section */}
        {blog.relatedArticles && blog.relatedArticles.length > 0 && (
          <div className="mt-16">
            <BlogHeading level={2} className="mb-6">Similar Articles</BlogHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {blog.relatedArticles.slice(0, 4).map(
                (rel) =>
                  rel.relatedBlog && (
                    <a
                      key={rel.relatedBlog.id}
                      href={`/${rel.relatedBlog.slug}`}
                      className="group block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-900"
                    >
                      <div className="relative w-full h-40 overflow-hidden">
                        <Image
                          src={rel.relatedBlog.image || "/placeholder.png"}
                          alt={rel.relatedBlog.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {rel.relatedBlog.title}
                        </h3>
                      </div>
                    </a>
                  )
              )}
            </div>
          </div>
        )}

        {/* Related Products Section */}
        <div className="mt-12">
          <BlogProducts blogSlug={blog.slug} variant="grid" title="Related Products" limit={4} />
        </div>

        {/* After Content Ads */}
        <div className="mt-12">
          <AdSlot
            placement="after-content"
            blogSlug={blog.slug}
            maxAds={4}
            className="mb-8"
          />
        </div>

        {/* FAQs Section */}
        {blog.faqs && blog.faqs.length > 0 && (
          <div className="mt-12">
            <BlogSectionCard className="p-8 md:p-12">
              <BlogHeading level={2} className="mb-8 text-center">
                Frequently Asked Questions
              </BlogHeading>
              <div className="space-y-6">
                {blog.faqs.map((faq, index) => (
                  <FAQItem key={faq.id} faq={faq} index={index} />
                ))}
              </div>
            </BlogSectionCard>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-16 mb-16">
          <BlogComments blogId={blog.id} />
        </div>
      </div>
    </BlogPageWrapper>
  );
}
