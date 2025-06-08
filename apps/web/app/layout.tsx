import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://sanskarmalviswarnkar.com");

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
