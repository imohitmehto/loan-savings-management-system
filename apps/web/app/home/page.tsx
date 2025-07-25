'use client';

import HeroImage from '@/components/hero-section/HeroImage';
import HeroContent from '@/components/hero-section/HeroContent';
import DecorativeDivider from '@/components/hero-section/DecorativeDivider';
import ShreeNathJiImg from '@/public/images/shrinathji.jpg';

// Assumption: Navbar exists above, HomePage is rendered below Navbar

export default function HomePage() {
  // Leave empty or fetch data here if needed with error handling
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Hero Background */}
      <div className="absolute inset-0 -z-10">
        <HeroImage src={ShreeNathJiImg} alt="Shree Nath Ji" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Spacing below navbar: replace 24 with your navbar height (e.g., 'mt-20' if navbar=80px high) */}
      <div className="pt-24" />

      {/* Main Content */}
      <HeroContent />
      <DecorativeDivider />

      {/* Add more creative content or cards here */}
      <section className="w-full max-w-4xl mx-auto flex flex-col gap-6 items-center text-gray-200/90 pb-24">
        <h3 className="text-3xl font-bold mb-2 tracking-tight">Featured Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="p-5 bg-black/70 rounded-xl shadow-lg hover:scale-[1.03] transition">
            <h4 className="text-xl font-bold text-green-200">Cultural Heritage</h4>
            <p className="mt-2 text-sm">Delve into the spiritual and artisanal heritage of the community.</p>
          </div>
          <div className="p-5 bg-black/70 rounded-xl shadow-lg hover:scale-[1.03] transition">
            <h4 className="text-xl font-bold text-green-200">Jewelry Artistry</h4>
            <p className="mt-2 text-sm">Explore masterful craftsmanship and timeless designs.</p>
          </div>
          <div className="p-5 bg-black/70 rounded-xl shadow-lg hover:scale-[1.03] transition">
            <h4 className="text-xl font-bold text-green-200">Devotional Stories</h4>
            <p className="mt-2 text-sm">Read inspiring stories centered on devotion and faith.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
