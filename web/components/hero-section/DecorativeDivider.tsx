"use client";

// Decorative divider for creative touch
export default function DecorativeDivider() {
  return (
    <div className="relative w-full flex justify-center my-8">
      <div className="h-1 w-48 bg-gradient-to-r from-green-400/80 to-emerald-900/80 rounded-full blur-[1px]" />
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex">
        <span className="inline-block w-6 h-6 bg-gradient-to-br from-yellow-100 via-green-200 to-emerald-700 rounded-full shadow-xl opacity-80" />
      </div>
    </div>
  );
}
