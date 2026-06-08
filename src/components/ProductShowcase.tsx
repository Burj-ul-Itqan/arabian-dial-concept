"use client";

import { products } from "@/lib/products";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import ProductCard from "./ProductCard";

export default function ProductShowcase() {
  const sectionRef = useScrollReveal();

  return (
    <section
      id="collection"
      className="relative py-32 md:py-44 lg:py-56"
      ref={sectionRef}
    >
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-champagne/[0.02] rounded-full blur-[150px] -translate-y-1/2" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
        {/* Section header — asymmetric alignment */}
        <div className="mb-20 md:mb-28 max-w-xl reveal-on-scroll">
          <span className="inline-flex items-center gap-3 text-[11px] font-sans tracking-[0.3em] uppercase text-champagne/60 mb-6">
            <span className="w-8 h-px bg-champagne/30" />
            The Collection
          </span>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] text-ivory font-light leading-[1.1] tracking-[-0.02em]">
            Yawm & Tareekh
          </h2>
          <p className="mt-2 font-serif text-[clamp(1.2rem,2.5vw,1.8rem)] text-champagne/50 font-light" dir="rtl">
            يوم و تاريخ
          </p>
          <p className="mt-6 text-[15px] font-sans text-mist/70 leading-relaxed max-w-md">
            Three expressions of Arabic horological craft. Each dial carries
            the day and date in Eastern Arabic script — a living connection
            between precision engineering and calligraphic heritage.
          </p>
        </div>

        {/* Product grid — staggered 3-column with asymmetric heights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {products.map((product, i) => (
            <div
              key={product.id}
              className={`${i === 1 ? "md:mt-16 lg:mt-24" : ""} ${
                i === 2 ? "md:mt-8 lg:mt-12" : ""
              }`}
            >
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
