'use client';
export default function DecorativeDivider() {
  return (
    <div className="relative w-full flex justify-center my-4">
      <div className="h-1 w-40 rounded-full bg-gradient-to-r from-green-400/80 to-emerald-800/80 blur-sm" />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex">
        <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-br from-yellow-100 via-green-200 to-emerald-600 shadow-md opacity-90" />
      </div>
    </div>
  );
}
