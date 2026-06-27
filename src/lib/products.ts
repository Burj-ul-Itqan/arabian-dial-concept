export interface Product {
  id: string;
  collection: string;
  collectionArabic: string;
  /** Marketing display name shown in UI overlays (matches the reference video). */
  variant: string;
  variantArabic: string;
  /** Numeric price kept for cart math. */
  price: number;
  /** Pre-formatted price label shown in the focus view (e.g. "₹14,990"). */
  priceLabel: string;
  currency: string;
  /** Flat photo used for cart thumbnail + dial texture fallback. */
  image: string;
  /** Real dial photograph mapped onto the 3D dial face. */
  dialTexture: string;
  /** 3D material colors. */
  caseColor: string;
  strapColor: string;
  /** Tint multiplied onto the dial texture. */
  dialColor: string;
  /** UI accent + backdrop glow (rgba). */
  accentColor: string;
  glow: string;
  /** Hotspot label for the strap (varies by colorway). */
  strapLabel: string;
  specifications: string[];
  movement: string;
  caseSize: string;
  caseMaterial: string;
  crystal: string;
  waterResistance: string;
  bracelet: string;
  caseback: string;
  powerReserve: string;
}

/** Range shown on the initial gallery screen (matches the reference video). */
export const GALLERY_PRICE_RANGE = "₹4,990 – ₹35,000";

/**
 * Order is layout-significant:
 *   index 0 → LEFT   (Sky Blue)
 *   index 1 → CENTER (Olive of Green — primary tap target)
 *   index 2 → RIGHT  (Pure Black)
 */
export const products: Product[] = [
  {
    id: "yt-sky-blue",
    collection: "Yawm & Tareekh",
    collectionArabic: "يوم و تاريخ",
    variant: "Sky Blue",
    variantArabic: "سماء زرقاء",
    price: 240.0,
    priceLabel: "₹14,990",
    currency: "USD",
    image: "/watches/sky-blue.png",
    dialTexture: "/watches/dial-blue.jpg",
    caseColor: "#d6dbe2",
    strapColor: "#24405c",
    dialColor: "#bcd4e8",
    accentColor: "rgba(160, 196, 230, 0.9)",
    glow: "rgba(38, 78, 120, 0.10)",
    strapLabel: "Premium Leather",
    specifications: [
      "Miyota Automatic",
      "Sapphire Crystal",
      "5 ATM / 50m",
      "Open Caseback",
    ],
    movement: "Reliable Japanese Miyota Automatic / Quartz Movement",
    caseSize: "Premium Case",
    caseMaterial: "Premium Stainless Steel Casing",
    crystal: "Scratch-Resistant Sapphire Crystal",
    waterResistance: "5 ATM (50 Meters)",
    bracelet: "Solid Stainless Steel Link Bracelet",
    caseback: "Open Caseback — Movement Visible",
    powerReserve: "41 Hours",
  },
  {
    id: "yt-olive-green",
    collection: "Yawm & Tareekh",
    collectionArabic: "يوم و تاريخ",
    variant: "Olive of Green",
    variantArabic: "أخضر زيتوني",
    price: 240.0,
    priceLabel: "₹14,990",
    currency: "USD",
    image: "/watches/olive-green.png",
    dialTexture: "/watches/dial-olive.jpg",
    caseColor: "#e3c48f",
    strapColor: "#3a4a25",
    dialColor: "#9fae6f",
    accentColor: "rgba(212, 175, 55, 0.95)",
    glow: "rgba(70, 84, 34, 0.12)",
    strapLabel: "Premium Leather",
    specifications: [
      "Miyota Automatic",
      "Sapphire Crystal",
      "5 ATM / 50m",
      "Open Caseback",
    ],
    movement: "Reliable Japanese Miyota Automatic / Quartz Movement",
    caseSize: "Premium Case",
    caseMaterial: "Premium Stainless Steel Casing",
    crystal: "Scratch-Resistant Sapphire Crystal",
    waterResistance: "5 ATM (50 Meters)",
    bracelet: "Croco-Grain Premium Leather Strap",
    caseback: "Open Caseback — Movement Visible",
    powerReserve: "41 Hours",
  },
  {
    id: "yt-pure-black",
    collection: "Yawm & Tareekh",
    collectionArabic: "يوم و تاريخ",
    variant: "Pure Black",
    variantArabic: "أسود نقي",
    price: 240.0,
    priceLabel: "₹14,990",
    currency: "USD",
    image: "/watches/pure-black.png",
    dialTexture: "/watches/dial-black.jpg",
    caseColor: "#d9dde2",
    strapColor: "#1b1d22",
    dialColor: "#c8ccd2",
    accentColor: "rgba(220, 224, 230, 0.9)",
    glow: "rgba(40, 44, 52, 0.12)",
    strapLabel: "Premium Leather",
    specifications: [
      "Miyota Automatic",
      "Sapphire Crystal",
      "5 ATM / 50m",
      "Open Caseback",
    ],
    movement: "Reliable Japanese Miyota Automatic / Quartz Movement",
    caseSize: "Premium Case",
    caseMaterial: "Premium Stainless Steel Casing",
    crystal: "Scratch-Resistant Sapphire Crystal",
    waterResistance: "5 ATM (50 Meters)",
    bracelet: "Solid Stainless Steel Link Bracelet",
    caseback: "Open Caseback — Movement Visible",
    powerReserve: "41 Hours",
  },
];
