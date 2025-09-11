'use client';
import HeroContent from './HeroContent';

export default function HeroSection() {
  return (
    <section className="relative w-full flex items-end justify-center py-6 sm:py-8 lg:py-12 min-h-[65vh] sm:min-h-[70vh] lg:min-h-[75vh]">
      <div className="w-full max-w-lg sm:max-w-xl px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        <HeroContent />
      </div>
    </section>
  );
}
