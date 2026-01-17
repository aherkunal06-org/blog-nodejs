"use client";

import { useThemeContext } from "../context/ThemeContext";

export default function BlogProseContent({ content }) {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <article
      className={`
        prose max-w-none
        ${isDark ? "prose-invert" : ""}
        
        prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight
        prose-h1:text-[28px] prose-h1:leading-[36px] prose-h1:mb-6 prose-h1:mt-8
        prose-h2:text-[24px] prose-h2:leading-[32px] prose-h2:mb-4 prose-h2:mt-8
        prose-h3:text-[20px] prose-h3:leading-[28px] prose-h3:mb-3 prose-h3:mt-6 prose-h3:font-bold
        prose-h4:text-[18px] prose-h4:leading-[26px] prose-h4:mb-2 prose-h4:mt-4 prose-h4:font-bold
        
        prose-a:font-medium prose-a:no-underline hover:prose-a:underline
        
        prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
        
        ${isDark 
          ? `
            prose-headings:text-white
            prose-a:text-blue-400 hover:prose-a:text-blue-300
            prose-strong:text-white
            prose-blockquote:border-gray-600
            prose-code:bg-gray-800 prose-code:text-gray-200
            prose-pre:bg-gray-900
          `
          : `
            prose-headings:text-gray-900
            prose-a:text-blue-600 hover:prose-a:text-blue-700
            prose-strong:text-gray-900
            prose-blockquote:border-gray-300
            prose-code:bg-gray-100 prose-code:text-gray-800
            prose-pre:bg-gray-50
          `
        }
      `}
      style={{
        fontFamily: 'source-serif-pro, Georgia, Cambria, "Times New Roman", Times, serif',
        fontSize: '20px',
        lineHeight: '32px',
        color: isDark ? '#d1d5db' : '#374151',
      }}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          fontSize: '20px',
          lineHeight: '32px',
        }}
      />
      <style jsx global>{`
        article.prose p,
        article.prose li,
        article.prose blockquote {
          font-size: 20px !important;
          line-height: 32px !important;
        }
        
        article.prose p {
          margin-bottom: 1.5em;
        }
        
        article.prose ul,
        article.prose ol {
          margin: 1.5em 0;
        }
        
        article.prose li {
          margin: 0.5em 0;
        }
        
        article.prose blockquote {
          padding-left: 1.5em;
          border-left-width: 4px;
          font-style: italic;
        }
        
        article.prose code {
          font-size: 16px;
          padding: 2px 6px;
          border-radius: 4px;
        }
        
        article.prose pre {
          font-size: 15px;
          line-height: 1.6;
        }
      `}</style>
    </article>
  );
}
