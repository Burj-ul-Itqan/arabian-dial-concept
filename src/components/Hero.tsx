"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[700px] flex items-end overflow-hidden"
    >
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/95 to-onyx" />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-transparent to-obsidian/60" />

      {/* Subtle radial glow — champagne accent top-right */}
      <div className="absolute top-0 right-[15%] w-[600px] h-[600px] bg-champagne/[0.03] rounded-full blur-[180px]" />

      {/* Grain texture overlay */}
      <div className="grain-overlay absolute inset-0" />

      {/* Content — ASYMMETRIC: pinned left, bottom third */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pb-24 md:pb-32 lg:pb-40">
        <div className="max-w-2xl">
          {/* Collection tag */}
          <div
            className={`mb-6 transition-all duration-1000 delay-300 ${
              loaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-[11px] font-sans tracking-[0.3em] uppercase text-champagne/70">
              <span className="w-8 h-px bg-champagne/40" />
              Yawm & Tareekh Collection
            </span>
          </div>

          {/* Heading — staggered line reveal */}
          <h1 className="font-serif font-light leading-[0.95] tracking-[-0.02em]">
            <span
              className={`block text-[clamp(2.8rem,7vw,5.5rem)] text-ivory transition-all duration-1000 delay-500 ${
                loaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Precision.
            </span>
            <span
              className={`block text-[clamp(2.8rem,7vw,5.5rem)] text-ivory transition-all duration-1000 delay-700 ${
                loaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Heritage.
            </span>
            <span
              className={`block text-[clamp(2.8rem,7vw,5.5rem)] text-champagne transition-all duration-1000 delay-900 ${
                loaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Calligraphy.
            </span>
          </h1>

          {/* Subline */}
          <p
            className={`mt-8 text-[15px] md:text-base font-sans text-mist/80 max-w-md leading-relaxed transition-all duration-1000 delay-[1100ms] ${
              loaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Custom Arabic day-date timepieces. Miyota 8285 automatic movements
            encased in marine-grade steel. Each dial, a script of time.
          </p>

          {/* CTA */}
          <div
            className={`mt-10 transition-all duration-1000 delay-[1300ms] ${
              loaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <a
              href="#collection"
              className="group inline-flex items-center gap-4 text-[13px] font-sans tracking-[0.15em] uppercase text-champagne hover:text-ivory transition-colors duration-300"
            >
              Explore the Collection
              <span className="w-10 h-px bg-champagne/50 group-hover:w-16 transition-all duration-500" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator — bottom center */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-[1600ms] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-mist/40">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-champagne/40 to-transparent animate-pulse-glow" />
      </div>
    </section>
  );
}
