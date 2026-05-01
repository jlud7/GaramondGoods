// Twelve-season color analysis system.
// Hex values follow the Sci\ART / Kibbe-derived palettes documented across
// the major color-analysis literature. Each season gets a six-swatch strip
// in canonical order: anchor warm → anchor cool → neutral.

const SEASONS = [
  {
    key: "bright-spring",
    family: "Spring",
    name: "Bright Spring",
    note: "Warm, clear, saturated — the brightest of the warm palettes.",
    swatches: [
      { hex: "#E03A2E", label: "Poppy" },
      { hex: "#F2A900", label: "Marigold" },
      { hex: "#F4D35E", label: "Canary" },
      { hex: "#3CAEA3", label: "Aqua" },
      { hex: "#1F6FEB", label: "True Blue" },
      { hex: "#F8F1E0", label: "Ivory" },
    ],
  },
  {
    key: "true-spring",
    family: "Spring",
    name: "True Spring",
    note: "Warm and clear, a touch softer than Bright — golden-based.",
    swatches: [
      { hex: "#E8743B", label: "Apricot" },
      { hex: "#E6B325", label: "Honey" },
      { hex: "#A8C256", label: "Pear" },
      { hex: "#2FA8A1", label: "Teal" },
      { hex: "#C94F3D", label: "Coral Red" },
      { hex: "#EFE3C8", label: "Cream" },
    ],
  },
  {
    key: "light-spring",
    family: "Spring",
    name: "Light Spring",
    note: "Light and warm — the gentlest end of the spring family.",
    swatches: [
      { hex: "#F4C7B8", label: "Peach" },
      { hex: "#F6E1A1", label: "Buttercream" },
      { hex: "#C7DBA4", label: "Meadow" },
      { hex: "#9ED3D6", label: "Sky" },
      { hex: "#E6A6A8", label: "Rose" },
      { hex: "#F5EEDC", label: "Paper" },
    ],
  },
  {
    key: "light-summer",
    family: "Summer",
    name: "Light Summer",
    note: "Light and cool, with rose and powder tones.",
    swatches: [
      { hex: "#C5D4E2", label: "Powder" },
      { hex: "#AAB5C6", label: "Dove" },
      { hex: "#D5B6C0", label: "Petal" },
      { hex: "#C7CCB2", label: "Sage Mist" },
      { hex: "#8EA7B5", label: "Slate Blue" },
      { hex: "#EFE9E4", label: "Shell" },
    ],
  },
  {
    key: "true-summer",
    family: "Summer",
    name: "True Summer",
    note: "Cool and muted — grey undertones, rosy neutrals.",
    swatches: [
      { hex: "#6E8AA6", label: "Denim" },
      { hex: "#4A6375", label: "Slate" },
      { hex: "#9E7A86", label: "Mulberry" },
      { hex: "#8AA19B", label: "Eucalyptus" },
      { hex: "#B2384F", label: "Raspberry" },
      { hex: "#E4DED3", label: "Bone" },
    ],
  },
  {
    key: "soft-summer",
    family: "Summer",
    name: "Soft Summer",
    note: "Muted, cool-neutral — everything grey-tinted and quiet.",
    swatches: [
      { hex: "#8F8577", label: "Taupe" },
      { hex: "#6F7E86", label: "Steel" },
      { hex: "#A68E8B", label: "Ashrose" },
      { hex: "#8C9E83", label: "Lichen" },
      { hex: "#4F5B66", label: "Graphite" },
      { hex: "#DFD8CC", label: "Oat" },
    ],
  },
  {
    key: "soft-autumn",
    family: "Autumn",
    name: "Soft Autumn",
    note: "Muted and warm — dusty olives, golden neutrals.",
    swatches: [
      { hex: "#9A7F5A", label: "Wheat" },
      { hex: "#7E8460", label: "Olive Grove" },
      { hex: "#B58762", label: "Caramel" },
      { hex: "#8F6A5A", label: "Clay" },
      { hex: "#5B6C60", label: "Fern" },
      { hex: "#D9CFB9", label: "Linen" },
    ],
  },
  {
    key: "true-autumn",
    family: "Autumn",
    name: "True Autumn",
    note: "Warm, rich, earth-saturated — the heart of the autumn family.",
    swatches: [
      { hex: "#8A4B2A", label: "Rust" },
      { hex: "#B5842E", label: "Mustard" },
      { hex: "#4B5A2C", label: "Deep Olive" },
      { hex: "#6B3A2A", label: "Chestnut" },
      { hex: "#2F4E4A", label: "Forest" },
      { hex: "#D9C39A", label: "Camel" },
    ],
  },
  {
    key: "dark-autumn",
    family: "Autumn",
    name: "Dark Autumn",
    note: "Deep, warm, dramatic — the darkest end of the warm palettes.",
    swatches: [
      { hex: "#3A2018", label: "Espresso" },
      { hex: "#6B2222", label: "Oxblood" },
      { hex: "#3B4A1F", label: "Moss" },
      { hex: "#7A4A1F", label: "Tobacco" },
      { hex: "#1D2A2A", label: "Ink Pine" },
      { hex: "#A88A55", label: "Old Gold" },
    ],
  },
  {
    key: "dark-winter",
    family: "Winter",
    name: "Dark Winter",
    note: "Deep, cool, high-contrast — black and jewel tones.",
    swatches: [
      { hex: "#14161C", label: "Jet" },
      { hex: "#2B1F3F", label: "Aubergine" },
      { hex: "#1E3A5F", label: "Night Sky" },
      { hex: "#5E1A2B", label: "Bordeaux" },
      { hex: "#0E3B3A", label: "Spruce" },
      { hex: "#D6D6D6", label: "Snow" },
    ],
  },
  {
    key: "true-winter",
    family: "Winter",
    name: "True Winter",
    note: "Cool and clear — black, white, and primary jewels.",
    swatches: [
      { hex: "#0B0B10", label: "True Black" },
      { hex: "#0F3DA8", label: "Royal" },
      { hex: "#B60028", label: "Pure Red" },
      { hex: "#066A4A", label: "Pine" },
      { hex: "#5C2A70", label: "Imperial" },
      { hex: "#F4F4F4", label: "Pure White" },
    ],
  },
  {
    key: "bright-winter",
    family: "Winter",
    name: "Bright Winter",
    note: "Cool, clear, saturated — the brightest of the cool palettes.",
    swatches: [
      { hex: "#CC0066", label: "Fuchsia" },
      { hex: "#00A2A8", label: "Electric Teal" },
      { hex: "#F2E205", label: "Citron" },
      { hex: "#1746A2", label: "Sapphire" },
      { hex: "#0E0E0E", label: "Obsidian" },
      { hex: "#F7F7F2", label: "Porcelain" },
    ],
  },
];

const FAMILIES = ["Spring", "Summer", "Autumn", "Winter"];

const SUB_BY_FAMILY = {
  Spring: ["Light", "True", "Bright"],
  Summer: ["Light", "True", "Soft"],
  Autumn: ["Soft", "True", "Dark"],
  Winter: ["Dark", "True", "Bright"],
};

const TEE_STYLES = [
  { name: "The Weekend Tee",    cut: "boxy cotton",          price: "$68", swatchIdx: 0 },
  { name: "Garment-Dyed Crew",  cut: "heavyweight crew",     price: "$74", swatchIdx: 3 },
  { name: "Pima Long Sleeve",   cut: "long-sleeve pima",     price: "$88", swatchIdx: 5 },
  { name: "The Everyday",       cut: "regular-fit cotton",   price: "$62", swatchIdx: 1 },
  { name: "Linen Henley",       cut: "linen three-button",   price: "$96", swatchIdx: 2 },
  { name: "Boxy Pocket Tee",    cut: "pocket tee",           price: "$72", swatchIdx: 4 },
];

window.SEASONS = SEASONS;
window.FAMILIES = FAMILIES;
window.SUB_BY_FAMILY = SUB_BY_FAMILY;
window.TEE_STYLES = TEE_STYLES;
