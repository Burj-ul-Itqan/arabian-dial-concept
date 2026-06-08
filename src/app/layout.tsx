import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart-store";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arabian Dial — Custom Arabic Day-Date Timepieces",
  description:
    "Discover the Yawm & Tareekh collection. Premium Arabic calligraphy dial watches with Miyota 8285 automatic movements, sapphire crystal, and 316L stainless steel. Digital Atelier Concept.",
  keywords: [
    "Arabian Dial",
    "Arabic watch",
    "Arabic dial watch",
    "Yawm Tareekh",
    "custom Arabic calligraphy dial",
    "Miyota 8285",
    "luxury watch",
    "day date Arabic",
  ],
  openGraph: {
    title: "Arabian Dial — Custom Arabic Day-Date Timepieces",
    description:
      "Premium Arabic calligraphy dial watches. Miyota 8285 automatic movements, sapphire crystal, 316L stainless steel. The Yawm & Tareekh Collection.",
    url: "https://arabian-dial-concept.vercel.app",
    siteName: "Arabian Dial",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arabian Dial — Custom Arabic Day-Date Timepieces",
    description:
      "Premium Arabic calligraphy dial watches. The Yawm & Tareekh Collection.",
  },
  metadataBase: new URL("https://arabian-dial-concept.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-white">
        <CartProvider>
          {children}
          <CartDrawer />
          <CheckoutModal />
        </CartProvider>
      </body>
    </html>
  );
}
