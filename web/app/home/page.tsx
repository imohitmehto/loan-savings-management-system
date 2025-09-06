"use client";

import DecorativeDivider from "@/components/hero-section/DecorativeDivider";
import HeroSection from "@/components/hero-section/HeroSection";
import HighlightsSection from "@/components/hero-section/HighlightsSection";

export default function HomePage() {
  return (
    <main
      className="relative min-h-screen bg-gradient-to-b from-[#15181d] via-[#122512] to-[#124321] flex flex-col"
      style={{
        backgroundImage: `url('/images/shrinathji.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center 70px",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <HeroSection />
        <DecorativeDivider />
        <HighlightsSection />
      </div>
    </main>
  );
}
