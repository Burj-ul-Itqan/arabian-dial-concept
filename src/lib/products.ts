export interface Product {
  id: string;
  collection: string;
  collectionArabic: string;
  variant: string;
  price: number;
  currency: string;
  image: string;
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

export const products: Product[] = [
  {
    id: "yt-olive-green",
    collection: "Yawm & Tareekh",
    collectionArabic: "يوم و تاريخ",
    variant: "Olive Green",
    price: 240.0,
    currency: "USD",
    image: "/watches/olive-green.png",
    specifications: [
      "Miyota 8285 Automatic",
      "39mm 316L Steel",
      "Sapphire Crystal",
      "Exhibition Caseback",
    ],
    movement: "Japanese Miyota 8285 Automatic — 21 Jewels",
    caseSize: "39mm",
    caseMaterial: "Marine-Grade 316L Stainless Steel",
    crystal: "Scratch-Resistant Sapphire with Cyclops Magnifier",
    waterResistance: "2 ATM / 20m — Everyday Resistant",
    bracelet: "President-Style with Integrated Smart-Link Adjustment",
    caseback: "Open Exhibition — Movement Visible",
    powerReserve: "41 Hours",
  },
  {
    id: "yt-pure-black",
    collection: "Yawm & Tareekh",
    collectionArabic: "يوم و تاريخ",
    variant: "Pure Black",
    price: 240.0,
    currency: "USD",
    image: "/watches/pure-black.png",
    specifications: [
      "Miyota 8285 Automatic",
      "39mm 316L Steel",
      "Sapphire Crystal",
      "Exhibition Caseback",
    ],
    movement: "Japanese Miyota 8285 Automatic — 21 Jewels",
    caseSize: "39mm",
    caseMaterial: "Marine-Grade 316L Stainless Steel",
    crystal: "Scratch-Resistant Sapphire with Cyclops Magnifier",
    waterResistance: "2 ATM / 20m — Everyday Resistant",
    bracelet: "President-Style with Integrated Smart-Link Adjustment",
    caseback: "Open Exhibition — Movement Visible",
    powerReserve: "41 Hours",
  },
  {
    id: "yt-sky-blue",
    collection: "Yawm & Tareekh",
    collectionArabic: "يوم و تاريخ",
    variant: "Sky Blue",
    price: 240.0,
    currency: "USD",
    image: "/watches/sky-blue.png",
    specifications: [
      "Miyota 8285 Automatic",
      "39mm 316L Steel",
      "Sapphire Crystal",
      "Exhibition Caseback",
    ],
    movement: "Japanese Miyota 8285 Automatic — 21 Jewels",
    caseSize: "39mm",
    caseMaterial: "Marine-Grade 316L Stainless Steel",
    crystal: "Scratch-Resistant Sapphire with Cyclops Magnifier",
    waterResistance: "2 ATM / 20m — Everyday Resistant",
    bracelet: "President-Style with Integrated Smart-Link Adjustment",
    caseback: "Open Exhibition — Movement Visible",
    powerReserve: "41 Hours",
  },
];
