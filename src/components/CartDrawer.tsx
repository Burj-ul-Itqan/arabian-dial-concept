"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-store";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    openCheckoutModal,
  } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-obsidian/70 backdrop-blur-sm transition-opacity duration-400 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[440px] bg-onyx border-l border-white/[0.06] flex flex-col transition-transform duration-500 cubic-bezier(0.16,1,0.3,1) ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
        id="cart-drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.06]">
          <h2 className="font-serif text-lg text-ivory font-light tracking-[0.05em]">
            Your Atelier
          </h2>
          <button
            onClick={closeCart}
            className="p-1 text-mist hover:text-ivory transition-colors"
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="font-serif text-xl text-ivory/60 font-light mb-3">
                Your atelier is empty
              </p>
              <p className="text-[13px] font-sans text-mist/40 max-w-[240px]">
                Explore the collection and add a timepiece to begin.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-5 pb-6 border-b border-white/[0.04] last:border-0"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-charcoal rounded-sm flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.product.image}
                      alt={item.product.variant}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-champagne-dim mb-0.5">
                      {item.product.collection}
                    </p>
                    <p className="font-serif text-base text-ivory font-light truncate">
                      {item.product.variant}
                    </p>
                    <p className="text-sm font-sans text-mist tabular-nums mt-1">
                      ${item.product.price.toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-7 h-7 flex items-center justify-center border border-white/[0.08] rounded-sm text-mist hover:text-ivory hover:border-white/[0.15] transition-colors text-sm"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="text-sm font-sans text-ivory tabular-nums w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-7 h-7 flex items-center justify-center border border-white/[0.08] rounded-sm text-mist hover:text-ivory hover:border-white/[0.15] transition-colors text-sm"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto text-[11px] font-sans tracking-[0.1em] uppercase text-smoke hover:text-red-400 transition-colors"
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — subtotal + CTA */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-white/[0.06] space-y-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[12px] font-sans tracking-[0.15em] uppercase text-mist">
                Subtotal
              </span>
              <span className="font-serif text-xl text-ivory font-light tabular-nums">
                ${subtotal.toFixed(2)}
                <span className="text-sm text-smoke ml-1 font-sans">USD</span>
              </span>
            </div>

            <button
              onClick={openCheckoutModal}
              className="w-full py-4 bg-champagne text-obsidian text-[13px] font-sans font-medium tracking-[0.15em] uppercase rounded-sm hover:bg-champagne-light transition-colors duration-300"
              id="proceed-to-checkout"
            >
              Proceed to Checkout
            </button>

            <p className="text-[11px] font-sans text-mist/40 text-center">
              Free worldwide shipping · 2-year warranty
            </p>
          </div>
        )}
      </div>
    </>
  );
}
