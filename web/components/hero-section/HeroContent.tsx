"use client";
export default function HeroContent() {
  return (
    <header className="w-full flex flex-col items-center text-center gap-2 py-3 px-2 max-w-md mx-auto">
      <h2 className="text-base sm:text-lg font-bold text-green-200 tracking-wide">
        જય શ્રી કૃષ્ણા
      </h2>
      <h1 className="font-black text-white leading-tight drop-shadow-md mb-1 text-xl sm:text-3xl md:text-4xl">
        Sanskar Malvi Swarnkar Community:
        <span className="block bg-gradient-to-r from-green-300 via-lime-300 to-emerald-400 bg-clip-text text-transparent mt-1">
          Saving Together, Growing Together
        </span>
      </h1>
      <p className="text-sm sm:text-base max-w-sm text-gray-300 leading-relaxed">
        Join hands for trust, cultural belonging, and growth—because together,
        we make a stronger tomorrow.
      </p>
    </header>
  );
}
