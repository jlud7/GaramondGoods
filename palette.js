// Twelve-Season palette. Six anchor swatches per season.
// Hex values are interpretive anchors used for the brand specimen book —
// they will be refined as the analysis engine and catalog data mature.
window.GG_SEASONS = [
  { group: "Spring", name: "Light Spring",  swatches: ["#F8D8C0","#F2A48C","#E8C868","#A8DCC0","#B8D8E8","#E8D8B0"] },
  { group: "Spring", name: "True Spring",   swatches: ["#E8743C","#F0B428","#74AC4C","#54B8B0","#F09060","#C49A6C"] },
  { group: "Spring", name: "Bright Spring", swatches: ["#E83B5C","#FFC428","#1F8F5B","#1C7CC4","#E94F2C","#08B0AC"] },

  { group: "Summer", name: "Light Summer",  swatches: ["#A4C0DC","#EFC0C0","#C8B4DC","#C8CDD0","#B8DCC8","#E8DCC4"] },
  { group: "Summer", name: "True Summer",   swatches: ["#B86670","#7C90C0","#7C9078","#5C7C9C","#A07CA8","#7E4C5C"] },
  { group: "Summer", name: "Soft Summer",   swatches: ["#B89090","#788898","#B0A498","#5C8884","#9078A0","#A89C8C"] },

  { group: "Autumn", name: "Soft Autumn",   swatches: ["#B89870","#88987C","#BC7858","#84845C","#BC9858","#A05A40"] },
  { group: "Autumn", name: "True Autumn",   swatches: ["#A03C10","#C49414","#5C6C2C","#B45A14","#3E5A35","#7C2C14"] },
  { group: "Autumn", name: "Dark Autumn",   swatches: ["#5C2410","#283C24","#4C1418","#5C3818","#343C18","#241C18"] },

  { group: "Winter", name: "Bright Winter", swatches: ["#D81F2C","#1845B4","#188850","#B8127C","#101010","#F4F4F0"] },
  { group: "Winter", name: "True Winter",   swatches: ["#9C1418","#A8C8DC","#3C2474","#1A3828","#141414","#E8E8E4"] },
  { group: "Winter", name: "Dark Winter",   swatches: ["#4C1424","#14223C","#1A2E24","#34182C","#181818","#241828"] }
];

// Hero cycling order — autumn-priority, with two contrasts for variety.
window.GG_HERO_ORDER = [
  "True Autumn",
  "Dark Autumn",
  "Soft Autumn",
  "Dark Winter",
  "True Summer"
];

// Catalog preview — filtered to True Autumn for the locked landing-page state.
window.GG_CATALOG = [
  { name: "Oxford shirt",      retailer: "AS Colour",     hex: "#3E5A35", price: "$58",  garment: "Cotton oxford" },
  { name: "Heavyweight tee",   retailer: "Buck Mason",    hex: "#A03C10", price: "$45",  garment: "Slub cotton" },
  { name: "Lambswool crew",    retailer: "Drake's",       hex: "#C49414", price: "$245", garment: "Scottish lambswool" },
  { name: "Pleated trouser",   retailer: "Berg & Berg",   hex: "#5C6C2C", price: "$295", garment: "Cotton twill" },
  { name: "Camp collar",       retailer: "Ami",           hex: "#B45A14", price: "$220", garment: "Linen weave" },
  { name: "Watch cap",         retailer: "SNS Herning",   hex: "#7C2C14", price: "$95",  garment: "Merino" },
  { name: "Field jacket",      retailer: "Kestin",        hex: "#3E5A35", price: "$385", garment: "Waxed cotton" },
  { name: "Five-pocket",       retailer: "AS Colour",     hex: "#5C2410", price: "$78",  garment: "Brushed cotton" }
];
