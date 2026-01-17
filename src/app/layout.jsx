"use client";

import { Geist, Geist_Mono, Playfair_Display, Inter } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Provider } from "react-redux";
import { store } from "./redux/store/store";
import { ThemeProvider } from "../context/ThemeContext";
import { SiteSettingsProvider } from "../context/SiteSettingsContext";
import SiteLayoutWrapper from "../components/SiteLayoutWrapper";
import { FloatingBg } from "../components/FloatingGig";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${inter.variable} antialiased`}>
        {/* Theme initialization script - runs before React hydrates to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  }
                } catch (e) {
                  // Fallback: default to light mode if localStorage is not available
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
        <SiteSettingsProvider>
          <ThemeProvider>
            <Provider store={store}>
              <Toaster position="top-right" />
              <FloatingBg />
              <SiteLayoutWrapper>
                <Header />
                <main style={{ flex: 1 }}>{children}</main>
                <Footer />
              </SiteLayoutWrapper>
            </Provider>
          </ThemeProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}


