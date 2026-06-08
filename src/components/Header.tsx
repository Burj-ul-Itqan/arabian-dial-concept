"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";

export default function Header() {
  const { openCart, itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-obsidian/80 backdrop-blur-xl border-b border-white/[0.04]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <a
            href="#"
            className="font-serif text-xl md:text-2xl tracking-[0.2em] uppercase text-ivory hover:text-champagne transition-colors duration-300"
          >
            Arabian Dial
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            {[
              { label: "Collection", href: "#collection" },
              { label: "Specifications", href: "#specifications" },
              { label: "Atelier", href: "#atelier" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-[13px] font-sans tracking-[0.15em] uppercase text-mist hover:text-ivory transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-champagne transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative p-2 group"
            aria-label="Open cart"
            id="cart-button"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-ivory group-hover:text-champagne transition-colors duration-300"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-champagne text-obsidian text-[10px] font-sans font-semibold flex items-center justify-center animate-scale-in">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
