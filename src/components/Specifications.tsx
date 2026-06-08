"use client";

import { useScrollReveal } from "@/lib/use-scroll-reveal";

const specs = [
  {
    label: "Movement",
    value: "Miyota 8285",
    detail: "Japanese Automatic — 21 Jewels, 41h Reserve",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Crystal",
    value: "Sapphire",
    detail: "Scratch-Resistant with Cyclops Magnifier",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        <line x1="12" y1="22" x2="12" y2="15.5" />
        <line x1="22" y1="8.5" x2="12" y2="15.5" />
        <line x1="2" y1="8.5" x2="12" y2="15.5" />
      </svg>
    ),
  },
  {
    label: "Case",
    value: "316L Steel",
    detail: "Marine-Grade, 39mm, Fluted Bezel",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    label: "Caseback",
    value: "Exhibition",
    detail: "Open Display — Movement Visible",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    label: "Bracelet",
    value: "President-Style",
    detail: "Smart-Link Integrated Adjustment",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M18 8h1a4 4 0 010 8h-1" />
        <path d="M6 8H5a4 4 0 000 8h1" />
        <line x1="6" y1="12" x2="18" y2="12" />
      </svg>
    ),
  },
  {
    label: "Water Resistance",
    value: "2 ATM",
    detail: "20m — Everyday Resistant",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
      </svg>
    ),
  },
];

export default function Specifications() {
  const sectionRef = useScrollReveal();

  return (
    <section
      id="specifications"
      ref={sectionRef}
      className="relative py-32 md:py-44 border-t border-white/[0.04]"
    >
      {/* Background glow */}
      <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-champagne/[0.02] rounded-full blur-[180px]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
        {/* Section header — right-aligned for asymmetry */}
        <div className="mb-20 md:mb-28 ml-auto max-w-xl text-right reveal-on-scroll">
          <span className="inline-flex items-center gap-3 text-[11px] font-sans tracking-[0.3em] uppercase text-champagne/60 mb-6 justify-end">
            Technical Craft
            <span className="w-8 h-px bg-champagne/30" />
          </span>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] text-ivory font-light leading-[1.1] tracking-[-0.02em]">
            Built to Endure
          </h2>
          <p className="mt-6 text-[15px] font-sans text-mist/70 leading-relaxed">
            Every component is selected for lasting integrity — from the
            self-winding Miyota caliber to the scratch-proof sapphire lens.
          </p>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-sm overflow-hidden">
          {specs.map((spec, i) => (
            <div
              key={spec.label}
              className={`reveal-on-scroll stagger-${Math.min(i + 1, 4)} bg-obsidian p-8 md:p-10 group hover:bg-onyx transition-colors duration-500`}
            >
              <div className="text-champagne/50 mb-5 group-hover:text-champagne transition-colors duration-500">
                {spec.icon}
              </div>
              <p className="text-[11px] font-sans tracking-[0.2em] uppercase text-smoke mb-1">
                {spec.label}
              </p>
              <p className="font-serif text-xl md:text-2xl text-ivory font-light mb-2">
                {spec.value}
              </p>
              <p className="text-[13px] font-sans text-mist/50 leading-relaxed">
                {spec.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
