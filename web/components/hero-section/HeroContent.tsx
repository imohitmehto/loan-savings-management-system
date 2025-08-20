"use client";
import React from "react";

export default function HeroContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-white text-center px-4 gap-6">
      <h1 className="text-4xl sm:text-6xl font-extrabold mb-2 drop-shadow-xl tracking-tight">
        Welcome to{" "}
        <span className="text-green-300">Sanskar Malvi Swarnkar</span>
      </h1>
      <h2 className="text-2xl sm:text-4xl text-green-200 font-bold animate-pulse drop-shadow-md">
        જય શ્રી કૃષ્ણા
      </h2>
      <p className="text-lg sm:text-xl max-w-xl mx-auto text-gray-200/80 mt-2">
        Experience the rich traditions and values of Sanatan Dharma, jewelry
        artistry, and cultural heritage. Discover stories, community, and the
        spirit of devotion.
      </p>
      <div className="flex gap-4 items-center justify-center mt-4">
        <a
          className="rounded-lg bg-gradient-to-r from-green-400 to-emerald-900 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:scale-105 transition"
          href="#about"
        >
          Learn More
        </a>
        <a
          className="rounded-lg border border-green-300 px-6 py-3 text-lg font-semibold text-green-200 hover:bg-green-950/50 transition"
          href="#community"
        >
          Join Community
        </a>
      </div>
    </div>
  );
}
