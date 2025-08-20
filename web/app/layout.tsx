import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins, Satisfy } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/globals.css";
import NavbarWrapper from "@/components/nav-bar/NavbarWrapper";
import ScrollToTop from "./ScrollToTop";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "./SessionWrapper";
import ThemeProvider from "@/components/ui/ThemeProvider";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});
const satisfy = Satisfy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-satisfy",
});

// Dynamic base URL
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://sanskarmalviswarnkar.com");

// Metadata config
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sanskar Malvi Swarnkar",
    template: "%s | Sanskar Malvi Swarnkar",
  },
  description:
    "Secure and intelligent loan & savings system built with modern tech.",
  keywords: ["Sanskar", "Finance", "Loans", "Savings", "Swarnkar"],
  authors: [{ name: "Deepak Soni", url: siteUrl }],
  creator: "Mohit Mehto",
  openGraph: {
    title: "Sanskar Malvi Swarnkar",
    description: "Empowering secure financial management.",
    url: siteUrl,
    siteName: "Sanskar Malvi Swarnkar",
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "black",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${satisfy.variable}`}
    >
      <body className="font-sans antialiased bg-slate-950 text-white">
        <SessionWrapper>
          <ThemeProvider>
            <ScrollToTop />
            <NavbarWrapper>{children}</NavbarWrapper>
            <Toaster position="top-center" />
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
