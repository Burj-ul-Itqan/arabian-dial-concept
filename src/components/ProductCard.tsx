"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div
      className={`reveal-on-scroll stagger-${index + 1} group relative flex flex-col`}
    >
      {/* Image container — tall ratio for visual drama */}
      <div className="relative aspect-[3/4] bg-onyx rounded-sm overflow-hidden mb-6">
        <Image
          src={product.image}
          alt={`${product.collection} — ${product.variant}`}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Quick-add button on hover */}
        <button
          onClick={() => addItem(product)}
          className="absolute bottom-4 left-4 right-4 py-3 bg-champagne/90 backdrop-blur-sm text-obsidian text-[12px] font-sans font-medium tracking-[0.15em] uppercase text-center rounded-sm opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 hover:bg-champagne"
          id={`add-to-cart-${product.id}`}
        >
          Add to Atelier
        </button>
      </div>

      {/* Text content */}
      <div className="space-y-2">
        {/* Collection + Arabic */}
        <p className="text-[11px] font-sans tracking-[0.2em] uppercase text-champagne-dim">
          {product.collection}
          <span className="ml-2 text-champagne/40 font-normal">
            {product.collectionArabic}
          </span>
        </p>

        {/* Variant name */}
        <h3 className="font-serif text-xl md:text-2xl text-ivory font-light tracking-[-0.01em]">
          {product.variant}
        </h3>

        {/* Price */}
        <p className="text-sm font-sans text-mist tabular-nums">
          ${product.price.toFixed(2)}{" "}
          <span className="text-smoke text-xs">{product.currency}</span>
        </p>

        {/* Spec pills */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {product.specifications.map((spec) => (
            <span
              key={spec}
              className="px-2.5 py-1 text-[10px] font-sans tracking-[0.05em] text-mist/70 border border-white/[0.06] rounded-sm"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
