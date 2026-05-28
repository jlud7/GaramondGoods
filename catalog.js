// Seed catalog — real menswear solid-tee styles across brands.
//
// PLACEHOLDER LINKS: `url` points at each brand's site for now. Once Skimlinks is
// live it auto-affiliates these outbound links; direct ShareASale / Impact deep
// links replace them per product as approvals land. `affiliate:false` flags that.
//
// Season tags are NOT stored here — classify.js computes them at runtime from the
// hex, so the palette stays the single source of truth. Images are intentionally
// the garment color itself until affiliate product feeds (with image rights) exist.

const BRAND_URL = {
  "Buck Mason": "https://www.buckmason.com",
  "Reigning Champ": "https://www.reigningchamp.com",
  "BYLT": "https://www.byltbasics.com",
  "Everlane": "https://www.everlane.com",
  "Uniqlo": "https://www.uniqlo.com/us/en",
  "Asket": "https://www.asket.com",
  "Colorful Standard": "https://colorfulstandard.com",
  "J.Crew": "https://www.jcrew.com",
};

// [brand, style name, color name, hex, price]
const RAW = [
  ["Buck Mason", "Slub Crewneck Tee", "White", "#F1F0EC", "$42"],
  ["Buck Mason", "Slub Crewneck Tee", "Navy", "#20304A", "$42"],
  ["Buck Mason", "Slub Crewneck Tee", "Army Olive", "#4E5733", "$42"],
  ["Buck Mason", "Curved Hem Tee", "Vintage Black", "#17171B", "$48"],
  ["Buck Mason", "Venice Wash Tee", "Rust", "#A4502A", "$45"],
  ["Buck Mason", "Pima Crew", "Camel", "#CDA877", "$48"],
  ["Reigning Champ", "Jersey Tee", "Heather Grey", "#9B9C9F", "$65"],
  ["Reigning Champ", "Jersey Tee", "Charcoal", "#36383C", "$65"],
  ["Reigning Champ", "Pima Tee", "Forest", "#234A35", "$70"],
  ["Reigning Champ", "Jersey Tee", "Stone Blue", "#6E8AA6", "$65"],
  ["Reigning Champ", "Jersey Tee", "Powder Blue", "#C5D4E2", "$65"],
  ["BYLT", "Drop-Cut Tee", "Burgundy", "#5E1F2A", "$38"],
  ["BYLT", "Drop-Cut Tee", "Heather Sand", "#C2B280", "$38"],
  ["BYLT", "Premium Crew", "Deep Teal", "#2E5650", "$40"],
  ["BYLT", "Premium Crew", "Coral", "#E4724A", "$40"],
  ["Everlane", "Organic Cotton Crew", "Bone", "#E6DFD0", "$30"],
  ["Everlane", "Organic Cotton Crew", "Camel", "#C2A179", "$30"],
  ["Everlane", "Premium-Weight Tee", "Slate Blue", "#4A6375", "$35"],
  ["Everlane", "Premium-Weight Tee", "Mauve", "#9E7A86", "$35"],
  ["Everlane", "Organic Cotton Crew", "Chocolate", "#4A3220", "$30"],
  ["Everlane", "Organic Cotton Crew", "Buttercream", "#F0DFA0", "$30"],
  ["Uniqlo", "Supima Cotton Crew", "Mustard", "#C99A2E", "$20"],
  ["Uniqlo", "Supima Cotton Crew", "Tomato Red", "#D9492F", "$20"],
  ["Uniqlo", "Supima Cotton Crew", "Sky Blue", "#AFC4D6", "$20"],
  ["Uniqlo", "U Crew Neck Tee", "Cobalt", "#1F4FB0", "$20"],
  ["Uniqlo", "U Crew Neck Tee", "Emerald", "#0A6B4A", "$20"],
  ["Asket", "The Tee", "Ecru", "#D9CFB9", "$45"],
  ["Asket", "The Tee", "Dark Green", "#1F3A2E", "$45"],
  ["Asket", "The Tee", "Stone", "#B8B0A0", "$45"],
  ["Colorful Standard", "Classic Organic Tee", "Dusty Olive", "#7E8460", "$35"],
  ["Colorful Standard", "Classic Organic Tee", "Ash Rose", "#A68E8B", "$35"],
  ["Colorful Standard", "Classic Organic Tee", "Petrol Blue", "#2F5E66", "$35"],
  ["Colorful Standard", "Classic Organic Tee", "Scarlet Red", "#DE1E3C", "$35"],
  ["J.Crew", "Broken-in Tee", "Sage", "#9CA98C", "$30"],
  ["J.Crew", "Broken-in Tee", "Khaki", "#B6A871", "$30"],
  ["J.Crew", "Garment-dyed Tee", "Terracotta", "#B0613E", "$32"],
];

const CATALOG = RAW.map(([brand, name, colorName, hex, priceText], i) => ({
  id: `${brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${colorName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i}`,
  brand,
  name,
  colorName,
  hex,
  priceText,
  url: BRAND_URL[brand],
  affiliate: false,
}));

window.CATALOG = CATALOG;
