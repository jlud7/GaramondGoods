// Catalog data model for the aggregator / affiliate shop.
//
// Each product is a solid-color basic that links out to a retailer.
// `seasons` lists the twelve-season palettes the colour suits — a product
// can belong to several. Season names must match window.GG_SEASONS in
// palette.js exactly, since the season filter is driven from that list.
//
// `url` is the outbound affiliate link. Values are placeholders ("#") until
// real affiliate deep-links are wired in per retailer program. Do not
// fabricate retailer URLs — fill these in from each affiliate dashboard.

window.GG_GARMENTS = [
  "Shirts",
  "Tees",
  "Knitwear",
  "Trousers",
  "Outerwear",
  "Accessories"
];

window.GG_CATALOG = [
  // ---- Shirts ----
  { id: "sh-ox-olive",  name: "Oxford shirt",    garment: "Shirts",      retailer: "AS Colour",   price: "$58",  hex: "#3E5A35", url: "#", seasons: ["True Autumn", "Dark Autumn", "Soft Autumn"] },
  { id: "sh-camp-rust", name: "Camp collar",     garment: "Shirts",      retailer: "Ami",         price: "$220", hex: "#B45A14", url: "#", seasons: ["True Autumn", "True Spring"] },
  { id: "sh-ox-blue",   name: "Oxford shirt",    garment: "Shirts",      retailer: "Spier & Mackay", price: "$65", hex: "#A8C8DC", url: "#", seasons: ["Light Summer", "True Summer", "True Winter"] },
  { id: "sh-linen-sky", name: "Linen shirt",     garment: "Shirts",      retailer: "Sunspel",     price: "$185", hex: "#B8D8E8", url: "#", seasons: ["Light Spring", "Light Summer"] },
  { id: "sh-pop-white", name: "Poplin shirt",    garment: "Shirts",      retailer: "Charles Tyrwhitt", price: "$89", hex: "#F4F4F0", url: "#", seasons: ["Bright Winter", "True Winter"] },

  // ---- Tees ----
  { id: "te-hw-rust",   name: "Heavyweight tee", garment: "Tees",        retailer: "Buck Mason",  price: "$45",  hex: "#A03C10", url: "#", seasons: ["True Autumn", "Dark Autumn"] },
  { id: "te-slub-clay", name: "Slub tee",        garment: "Tees",        retailer: "Buck Mason",  price: "$45",  hex: "#BC7858", url: "#", seasons: ["Soft Autumn", "True Autumn"] },
  { id: "te-pima-rose", name: "Pima tee",        garment: "Tees",        retailer: "Sunspel",     price: "$70",  hex: "#EFC0C0", url: "#", seasons: ["Light Summer", "Light Spring"] },
  { id: "te-pima-navy", name: "Pima tee",        garment: "Tees",        retailer: "Sunspel",     price: "$70",  hex: "#5C7C9C", url: "#", seasons: ["True Summer", "Soft Summer"] },
  { id: "te-ring-red",  name: "Ringspun tee",    garment: "Tees",        retailer: "Colorful Standard", price: "$35", hex: "#D81F2C", url: "#", seasons: ["Bright Winter", "Bright Spring"] },

  // ---- Knitwear ----
  { id: "kn-lamb-gold", name: "Lambswool crew",  garment: "Knitwear",    retailer: "Drake's",     price: "$245", hex: "#C49414", url: "#", seasons: ["True Autumn", "Soft Autumn"] },
  { id: "kn-mer-teal",  name: "Merino crew",     garment: "Knitwear",    retailer: "John Smedley", price: "$210", hex: "#54B8B0", url: "#", seasons: ["True Spring", "Bright Spring"] },
  { id: "kn-mer-mauve", name: "Merino crew",     garment: "Knitwear",    retailer: "John Smedley", price: "$210", hex: "#9078A0", url: "#", seasons: ["Soft Summer", "True Summer"] },
  { id: "kn-shet-moss", name: "Shetland crew",   garment: "Knitwear",    retailer: "Jamieson's",  price: "$135", hex: "#5C6C2C", url: "#", seasons: ["True Autumn", "Dark Autumn"] },
  { id: "kn-cash-plum", name: "Cashmere crew",   garment: "Knitwear",    retailer: "Begg & Co",   price: "$395", hex: "#4C1424", url: "#", seasons: ["Dark Winter", "True Winter"] },
  { id: "kn-cot-sky",   name: "Cotton crew",     garment: "Knitwear",    retailer: "Uniqlo",      price: "$50",  hex: "#A4C0DC", url: "#", seasons: ["Light Summer", "Light Spring"] },

  // ---- Trousers ----
  { id: "tr-pleat-olive", name: "Pleated trouser", garment: "Trousers",  retailer: "Berg & Berg", price: "$295", hex: "#5C6C2C", url: "#", seasons: ["True Autumn", "Soft Autumn"] },
  { id: "tr-5pkt-brown",  name: "Five-pocket",     garment: "Trousers",  retailer: "AS Colour",   price: "$78",  hex: "#5C2410", url: "#", seasons: ["Dark Autumn", "True Autumn"] },
  { id: "tr-chino-stone", name: "Cotton chino",    garment: "Trousers",  retailer: "Todd Snyder", price: "$148", hex: "#E8D8B0", url: "#", seasons: ["Light Spring", "Soft Autumn"] },
  { id: "tr-wool-navy",   name: "Wool trouser",    garment: "Trousers",  retailer: "Spier & Mackay", price: "$169", hex: "#14223C", url: "#", seasons: ["Dark Winter", "True Winter"] },
  { id: "tr-flan-grey",   name: "Flannel trouser", garment: "Trousers",  retailer: "Berg & Berg", price: "$275", hex: "#C8CDD0", url: "#", seasons: ["True Summer", "Soft Summer", "Light Summer"] },

  // ---- Outerwear ----
  { id: "ou-field-moss",  name: "Field jacket",    garment: "Outerwear", retailer: "Kestin",      price: "$385", hex: "#3E5A35", url: "#", seasons: ["True Autumn", "Dark Autumn"] },
  { id: "ou-chore-rust",  name: "Chore coat",      garment: "Outerwear", retailer: "Vetra",       price: "$165", hex: "#B45A14", url: "#", seasons: ["True Autumn", "True Spring"] },
  { id: "ou-harr-navy",   name: "Harrington",      garment: "Outerwear", retailer: "Baracuta",    price: "$425", hex: "#1845B4", url: "#", seasons: ["Bright Winter", "Bright Spring"] },
  { id: "ou-mac-stone",   name: "Mackintosh",      garment: "Outerwear", retailer: "Mackintosh",  price: "$695", hex: "#E8DCC4", url: "#", seasons: ["Light Summer", "Soft Summer"] },

  // ---- Accessories ----
  { id: "ac-cap-brick",   name: "Watch cap",       garment: "Accessories", retailer: "SNS Herning", price: "$95", hex: "#7C2C14", url: "#", seasons: ["Dark Autumn", "True Autumn"] },
  { id: "ac-scarf-teal",  name: "Lambswool scarf", garment: "Accessories", retailer: "Begg & Co",  price: "$155", hex: "#5C8884", url: "#", seasons: ["Soft Summer", "Soft Autumn"] },
  { id: "ac-sock-mustard",name: "Ribbed socks",    garment: "Accessories", retailer: "Anonymous Ism", price: "$22", hex: "#F0B428", url: "#", seasons: ["True Spring", "Bright Spring"] },
  { id: "ac-tie-burg",    name: "Wool tie",        garment: "Accessories", retailer: "Drake's",    price: "$135", hex: "#9C1418", url: "#", seasons: ["True Winter", "Dark Winter"] }
];
