// ============================================================================
// Garamond Goods — editorial image shot list (art-direction manifest)
// ============================================================================
// One entry per image. generate.mjs sends  PREAMBLE + "\n\n" + shot.prompt  to
// Replicate's openai/gpt-image-2 and writes the result to ../img/<id>.webp.
//
// PREAMBLE is the shared "house style" — it's what makes every frame read as one
// shoot (still life, north light, cream paper + linen, no people, no logos).
// Each shot's `prompt` only describes the subject + palette.
//
// The four season palettes below are the live swatch hexes from palette.js.
// If palette.js changes, re-sync those four blocks.
//
// gpt-image-2 supports only three aspect ratios: "1:1", "3:2", "2:3".

export const PREAMBLE = [
  "Editorial still-life photograph, medium-format film look with fine natural grain.",
  "Soft north-facing window daylight, gentle directional shadows, no harsh specular highlights.",
  "Arranged on warm cream paper (hex F2EBDC) and natural oatmeal linen.",
  "Color is muted, true-to-life and slightly desaturated — never glossy, neon or oversaturated.",
  "Props are strictly limited to neatly folded men's cotton crew-neck tees and small plain",
  "printed color swatch cards, plus at most one brass loupe. Absolutely no people, no hands,",
  "no faces, no mannequins, no hangers, no logos, no brand names, and no lettering or text",
  "of any kind anywhere in the frame. Realistic cotton jersey texture with soft fabric folds.",
  "Calm, considered atelier mood, composed with generous negative space.",
].join(" ");

// Lighter "warm boho" house style for hanging / lifestyle shots. A shot that sets
// `preamble: BOHO` uses this instead of PREAMBLE. Same no-people / no-logo rules.
export const BOHO = [
  "Editorial menswear lifestyle photograph, medium-format film look with fine natural grain.",
  "Soft natural window daylight, gentle directional shadows.",
  "Warm, earthy, relaxed bohemian mood with natural materials — a warm lime-washed plaster wall,",
  "pale wood, a touch of rattan or woven texture, and the occasional dried botanical.",
  "Muted, true-to-life, slightly desaturated warm color; clean and uncluttered despite the warmth.",
  "No people, no hands, no faces, no mannequins, no logos, no brand names, no text anywhere.",
  "Realistic cotton jersey texture with natural fabric drape.",
].join(" ");

// Minimal "shirt swatch" house style for the homepage season strips — kept
// deliberately identical scene-to-scene so all 12 read as one consistent set.
export const SWATCH = [
  "Overhead flat-lay product photograph, shot perfectly straight from directly above,",
  "medium-format clarity with fine natural grain. Soft, even, almost shadowless daylight.",
  "Plain smooth warm cream paper background (hex F2EBDC) and nothing else — no linen,",
  "no swatch cards, no loupe, no props or other objects of any kind.",
  "Muted, true-to-life, slightly desaturated color; realistic cotton jersey texture.",
  "No people, no hands, no faces, no logos, no brand names, no text anywhere.",
  "Clean, identical, repeatable studio composition.",
].join(" ");

// Helper for the four marquee season flat-lays.
const season = (key, surface, light, colors) => ({
  id: `season-${key}`,
  slot: `/seasons/${key} — page hero`,
  aspect_ratio: "3:2",
  prompt:
    `Overhead flat-lay of four neatly folded men's cotton crew tees laid out with even ` +
    `spacing on ${surface}. The four tees are exactly these colors: ` +
    colors.map(([n, h]) => `${n} (hex ${h.replace("#", "")})`).join(", ") +
    `. One small plain swatch card rests at the edge of the frame. ${light}`,
});

// One horizontal "shirt swatch" strip per season — six folded tees in a row, on
// a plain cream background, identical composition across all twelve.
const swatch = (key, colors) => ({
  id: `swatch-${key}`,
  slot: `homepage season grid — ${key}`,
  aspect_ratio: "3:2",
  preamble: SWATCH,
  prompt:
    "Six folded men's cotton crew tees arranged edge to edge in a single neat horizontal row " +
    "that evenly fills the full width of the frame, vertically centered, like a row of fabric " +
    "color swatches. The six tees, from left to right, are exactly: " +
    colors.map(([n, h]) => `${n} (hex ${h.replace("#", "")})`).join(", ") + ".",
});

export const SHOTS = [
  {
    id: "hero",
    slot: "homepage hero — Plate 01",
    aspect_ratio: "3:2",
    prompt:
      "Overhead flat-lay of six neatly folded men's cotton crew tees in a loose 3-by-2 grid " +
      "on textured warm cream paper, in a rich True Autumn palette. The six tees are exactly: " +
      "light camel (hex D9C39A), mustard gold (hex B5842E), rust (hex A4502A), deep olive " +
      "(hex 4B5A2C), chestnut (hex 6B3A2A) and forest teal (hex 2F4E4A). Two small plain cream " +
      "swatch cards rest at the lower edge. Soft daylight rakes in from the upper left.",
  },
  {
    id: "method",
    slot: "§01 How it works — Plate 02",
    aspect_ratio: "2:3",
    prompt:
      "A color-atelier desk seen from a steep overhead angle on oatmeal linen: an opened fan of " +
      "plain printed color swatch cards spread in a gentle arc through warm earth tones (olive, " +
      "rust, camel, bone, charcoal), a small brass loupe resting on the cards, and two neatly " +
      "folded cotton tees in deep olive and bone stacked at one side. Shallow depth of field, " +
      "35mm, quiet editorial stillness.",
  },
  season("true-autumn", "warm cream paper", "Soft even daylight from the left.", [
    ["light camel", "#D9C39A"], ["rust", "#A4502A"], ["deep olive", "#4B5A2C"], ["chestnut", "#6B3A2A"],
  ]),
  season("true-winter", "cool pale grey linen", "Crisp, clear daylight with a cool white balance.", [
    ["pure white", "#F4F4F4"], ["true black", "#0B0B10"], ["navy", "#14213F"], ["true red", "#C20E2E"],
  ]),
  season("true-summer", "soft greige linen", "Soft, slightly cool overcast daylight.", [
    ["bone", "#E4DED3"], ["denim blue", "#6E8AA6"], ["slate blue", "#4A6375"], ["mulberry", "#9E7A86"],
  ]),
  season("true-spring", "warm ivory paper", "Bright warm golden morning daylight.", [
    ["warm cream", "#EFE3C8"], ["camel", "#C99A5B"], ["honey gold", "#E6B325"], ["coral", "#E4724A"],
  ]),
  // remaining 8 season flat-lays — complete the set (all on cream/linen so the
  // twelve read as one shoot; the tees carry the color, the surface tints warm/cool)
  season("bright-spring", "warm cream paper", "Bright, clear, sunlit daylight.", [
    ["poppy", "#E85D3D"], ["marigold", "#F2A900"], ["clear green", "#4FB477"], ["true blue", "#2D6FE0"],
  ]),
  season("light-spring", "warm ivory paper", "Soft bright morning daylight.", [
    ["buttercream", "#F4E3A1"], ["soft peach", "#F4C7A8"], ["light green", "#B7CE96"], ["sky", "#9ED3D6"],
  ]),
  season("light-summer", "cool pale grey linen", "Soft, diffused, cool daylight.", [
    ["shell", "#EFE9E4"], ["powder blue", "#C5D4E2"], ["dove grey", "#AAB5C6"], ["petal", "#D5B6C0"],
  ]),
  season("soft-summer", "muted greige linen", "Soft overcast, slightly cool light.", [
    ["oat", "#DFD8CC"], ["mushroom taupe", "#8F8577"], ["steel grey", "#6F7E86"], ["ash rose", "#A68E8B"],
  ]),
  season("soft-autumn", "warm oatmeal linen", "Soft, muted, warm daylight.", [
    ["linen", "#D9CFB9"], ["wheat", "#9A7F5A"], ["olive grove", "#7E8460"], ["clay", "#8F6A5A"],
  ]),
  season("dark-autumn", "warm oatmeal linen", "Low, warm, moody daylight.", [
    ["old gold", "#A88A55"], ["espresso", "#3A2018"], ["oxblood", "#6B2222"], ["dark moss", "#3B4A1F"],
  ]),
  season("dark-winter", "cool grey linen", "Crisp, cool, low-key daylight.", [
    ["true white", "#ECEDEF"], ["jet black", "#14161C"], ["dark navy", "#1E2A44"], ["bordeaux", "#5E1A2B"],
  ]),
  season("bright-winter", "cool light grey paper", "Crisp, bright, clear daylight.", [
    ["porcelain", "#F7F7F2"], ["obsidian", "#0E0E0E"], ["true blue", "#1A53D0"], ["clear red", "#DE1E3C"],
  ]),
  {
    id: "spectrum",
    slot: "homepage full-bleed spectrum band",
    aspect_ratio: "3:2",
    prompt:
      "Wide overhead flat-lay of about fourteen neatly folded men's cotton crew tees arranged " +
      "edge to edge in one long horizontal row that flows as a continuous color gradient across " +
      "the full spectrum: from bone and cream into butter and gold, into rust and terracotta, " +
      "into olive and forest green, into teal and slate blue, into deep navy, into plum and " +
      "burgundy, finishing in charcoal and black. Even spacing, on warm cream paper, soft even " +
      "daylight, shot perfectly straight overhead.",
  },
  {
    id: "texture",
    slot: "fabric-quality macro",
    aspect_ratio: "3:2",
    prompt:
      "Extreme macro close-up of folded heavyweight cotton jersey tees in deep olive and rust, " +
      "raking soft daylight revealing the fine knit loops, the clean ribbed collar edge and a " +
      "soft fold shadow. Very shallow depth of field, tactile and premium.",
  },
  // Warm-boho hanging shots (use the BOHO art-direction, not the atelier PREAMBLE)
  {
    id: "hang-rail",
    slot: "catalog lede — shirts on a rail",
    aspect_ratio: "3:2",
    preamble: BOHO,
    prompt:
      "Four men's cotton crew tees on simple pale-wood hangers, hung in an evenly spaced row from " +
      "a thin natural wooden rail against a warm lime-washed plaster wall; the tees in bone, camel, " +
      "rust and deep olive. A trailing green plant and a few dried pampas stems sit softly out of " +
      "focus at one edge. Side daylight casts long, gentle shadows across the wall.",
  },
  {
    id: "hang-single",
    slot: "sleek single hanging tee",
    aspect_ratio: "2:3",
    preamble: BOHO,
    prompt:
      "Clean, close composition of a single men's cotton tee in warm rust draped on a smooth " +
      "pale-wood hanger against a warm plaster backdrop; soft directional daylight rakes across the " +
      "fabric, showing its drape and the ribbed collar. One small dried botanical sprig leans in at " +
      "the lower edge as a quiet boho accent. Shallow depth of field, sleek and minimal.",
  },
  // 12 "shirt swatch" strips for the homepage season grid (palette.js swatch colors)
  swatch("bright-spring", [["poppy","#E85D3D"],["marigold","#F2A900"],["clear green","#4FB477"],["bright teal","#2FB6AD"],["true blue","#2D6FE0"],["ivory","#F4EFD8"]]),
  swatch("true-spring", [["warm cream","#EFE3C8"],["camel","#C99A5B"],["honey gold","#E6B325"],["leaf green","#6FA84B"],["teal","#2FA8A1"],["coral","#E4724A"]]),
  swatch("light-spring", [["paper","#F5EEDC"],["buttercream","#F4E3A1"],["soft peach","#F4C7A8"],["light green","#B7CE96"],["sky","#9ED3D6"],["periwinkle","#8FA6D6"]]),
  swatch("light-summer", [["shell","#EFE9E4"],["powder blue","#C5D4E2"],["dove grey","#AAB5C6"],["soft sage","#C2CDB4"],["petal","#D5B6C0"],["slate blue","#8EA7B5"]]),
  swatch("true-summer", [["bone","#E4DED3"],["denim blue","#6E8AA6"],["slate blue","#4A6375"],["eucalyptus","#6E9089"],["mulberry","#9E7A86"],["raspberry","#A64158"]]),
  swatch("soft-summer", [["oat","#DFD8CC"],["mushroom taupe","#8F8577"],["steel grey","#6F7E86"],["lichen","#8C9E83"],["ash rose","#A68E8B"],["graphite","#4F5B66"]]),
  swatch("soft-autumn", [["linen","#D9CFB9"],["wheat","#9A7F5A"],["olive grove","#7E8460"],["caramel","#B58762"],["clay","#8F6A5A"],["fern","#5B6C60"]]),
  swatch("true-autumn", [["light camel","#D9C39A"],["mustard gold","#B5842E"],["rust","#A4502A"],["deep olive","#4B5A2C"],["chestnut","#6B3A2A"],["forest teal","#2F4E4A"]]),
  swatch("dark-autumn", [["old gold","#A88A55"],["espresso","#3A2018"],["oxblood","#6B2222"],["dark moss","#3B4A1F"],["tobacco","#7A4A1F"],["ink pine","#1D2A2A"]]),
  swatch("dark-winter", [["true white","#ECEDEF"],["jet black","#14161C"],["dark navy","#1E2A44"],["bordeaux","#5E1A2B"],["spruce","#0E3B3A"],["aubergine","#2B1F3F"]]),
  swatch("true-winter", [["pure white","#F4F4F4"],["true black","#0B0B10"],["navy","#14213F"],["royal blue","#1746C0"],["true red","#C20E2E"],["emerald","#0A6B4A"]]),
  swatch("bright-winter", [["porcelain","#F7F7F2"],["obsidian","#0E0E0E"],["true blue","#1A53D0"],["emerald","#0AA06A"],["clear red","#DE1E3C"],["icy blue","#BDD0E6"]]),
];

// `node tools/shots.mjs` → print the shot list
if (import.meta.url === `file://${process.argv[1]}`) {
  for (const s of SHOTS) console.log(`${s.id.padEnd(20)} ${s.aspect_ratio}  ${s.slot}`);
}
