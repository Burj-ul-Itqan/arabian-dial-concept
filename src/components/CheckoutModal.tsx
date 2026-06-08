"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

export default function CheckoutModal() {
  const { isCheckoutModalOpen, closeCheckoutModal } = useCart();

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCheckoutModalOpen) closeCheckoutModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCheckoutModalOpen, closeCheckoutModal]);

  // Lock body scroll
  useEffect(() => {
    if (isCheckoutModalOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isCheckoutModalOpen]);

  if (!isCheckoutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/85 backdrop-blur-lg animate-fade-in"
        onClick={closeCheckoutModal}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg bg-onyx border border-white/[0.06] rounded-sm p-10 md:p-14 animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-label="Checkout staging notice"
        id="checkout-modal"
      >
        {/* Close button */}
        <button
          onClick={closeCheckoutModal}
          className="absolute top-5 right-5 p-1 text-mist hover:text-ivory transition-colors"
          aria-label="Close modal"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Champagne accent line */}
        <div className="w-12 h-px bg-champagne mb-8" />

        {/* Brand name */}
        <h3 className="font-serif text-2xl md:text-3xl text-ivory font-light tracking-[0.05em] mb-2">
          Arabian Dial
        </h3>
        <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-champagne/60 mb-8">
          Digital Atelier Concept
        </p>

        {/* Message */}
        <p className="text-[15px] font-sans text-mist/80 leading-[1.75] mb-10">
          This checkout pipeline is locked in staging mode. Upon contract
          initialization, this action seamlessly bridges with your chosen
          merchant processor (Shopify Plus, Stripe, or Adyen) to securely
          handle global luxury transactions.
        </p>

        {/* CTA */}
        <button
          onClick={closeCheckoutModal}
          className="w-full py-4 bg-champagne/10 border border-champagne/20 text-champagne text-[13px] font-sans font-medium tracking-[0.15em] uppercase rounded-sm hover:bg-champagne/20 hover:border-champagne/40 transition-all duration-300"
          id="return-to-atelier"
        >
          Return to Atelier
        </button>
      </div>
    </div>
  );
}
