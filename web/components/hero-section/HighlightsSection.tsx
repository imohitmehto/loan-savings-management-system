'use client';

const highlights = [
  {
    title: 'For Our Community, By Our Community',
    desc: 'Exclusively designed for Sanskar Malvi Swarnkar families—ensuring trust and cultural belonging.',
  },
  {
    title: 'Secure & Transparent',
    desc: 'Every member can track savings and loans—no hidden terms, no outside influence.',
  },
  {
    title: 'Strengthening Bonds Beyond Finance',
    desc: 'It’s about helping each other prosper, just like family.',
  },
];

export default function HighlightsSection() {
  return (
    <section
      className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6"
      aria-labelledby="highlights-heading"
    >
      <h2
        className="text-2xl font-bold text-white mb-6 text-center tracking-tight"
        id="highlights-heading"
      >
        Featured Highlights
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {highlights.map(({ title, desc }, i) => (
          <article
            key={i}
            className="bg-emerald-900/80 rounded-xl shadow-md px-6 py-5 flex flex-col gap-2 border border-emerald-700 transition hover:scale-105 hover:shadow-green-500/40 duration-300"
          >
            <h3 className="text-lg font-bold text-green-300">{title}</h3>
            <p className="text-slate-100/90 text-sm">{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
