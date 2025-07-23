"use client";

import Image from "next/image";
import ShreeNathJiImg from "@/public/images/shrinathji.jpg";

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* ✅ Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={ShreeNathJiImg}
          alt="Khatu Shyam Ji"
          fill
          className="object-cover object-center brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="flex flex-col items-center justify-center h-screen text-white text-center px-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to Sanskar Malvi Swarnkar
        </h1>
        <h2 className="text-2xl sm:text-4xl text-green-200 font-bold animate-pulse drop-shadow-xl">
          જય શ્રી કૃષ્ણા
        </h2>
      </div>
    </main>
  );
}
