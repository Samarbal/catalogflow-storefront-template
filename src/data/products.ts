import type { Localized } from "../config/store";

export interface Product {
  id: string;
  name: Localized;
  subtitle: Localized;
  description: Localized;
  category: string;
  price: number;
  size: string;
  image: string;
  notes: Localized<string[]>;
  featured?: boolean;
  availability: "available" | "low";
}

export const products: Product[] = [
  {
    id: "nocturne-01",
    name: { en: "Nocturne 01", ar: "نوكتورن 01" },
    subtitle: { en: "Rose · Saffron · Oud", ar: "ورد · زعفران · عود" },
    description: {
      en: "A magnetic rose at midnight, warmed by saffron and grounded in rare oud.",
      ar: "وردة آسرة في منتصف الليل، يدفئها الزعفران ويعمّقها العود النادر.",
    },
    category: "amber",
    price: 685,
    size: "75 ml",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=88",
    notes: { en: ["Saffron", "Damask rose", "Oud"], ar: ["زعفران", "ورد دمشقي", "عود"] },
    featured: true,
    availability: "available",
  },
  {
    id: "velvet-iris",
    name: { en: "Velvet Iris", ar: "فيلفت آيرس" },
    subtitle: { en: "Iris · Suede · Musk", ar: "سوسن · شمواه · مسك" },
    description: {
      en: "Powdered iris and pale suede settle into a quiet veil of skin musk.",
      ar: "سوسن ناعم وشمواه فاتح يستقران في هالة هادئة من مسك البشرة.",
    },
    category: "floral",
    price: 590,
    size: "75 ml",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=88",
    notes: { en: ["Iris", "Suede", "White musk"], ar: ["سوسن", "شمواه", "مسك أبيض"] },
    featured: true,
    availability: "low",
  },
  {
    id: "santal-dusk",
    name: { en: "Santal Dusk", ar: "سانتال دَسك" },
    subtitle: { en: "Fig · Sandalwood · Tonka", ar: "تين · صندل · تونكا" },
    description: {
      en: "Creamy sandalwood cut with green fig and the soft warmth of tonka bean.",
      ar: "خشب صندل كريمي يتناغم مع التين الأخضر ودفء حبوب التونكا.",
    },
    category: "woody",
    price: 625,
    size: "75 ml",
    image:
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1200&q=88",
    notes: { en: ["Green fig", "Sandalwood", "Tonka"], ar: ["تين أخضر", "صندل", "تونكا"] },
    featured: true,
    availability: "available",
  },
  {
    id: "luna-blanc",
    name: { en: "Luna Blanc", ar: "لونا بلانك" },
    subtitle: { en: "Neroli · Linen · Cedar", ar: "نيرولي · كتان · أرز" },
    description: {
      en: "Sunlit neroli, crisp linen and cedarwood—an ode to effortless clarity.",
      ar: "نيرولي مشرق وكتان نقي وخشب الأرز؛ قصيدة للصفاء المتكلف.",
    },
    category: "floral",
    price: 540,
    size: "75 ml",
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1200&q=88",
    notes: { en: ["Neroli", "Linen accord", "Cedar"], ar: ["نيرولي", "نفحات الكتان", "أرز"] },
    availability: "available",
  },
  {
    id: "bois-minuit",
    name: { en: "Bois Minuit", ar: "بوا مينوي" },
    subtitle: { en: "Cardamom · Vetiver · Smoke", ar: "هيل · نجيل الهند · دخان" },
    description: {
      en: "Cool cardamom rises over vetiver and a lingering trace of sacred smoke.",
      ar: "هيل بارد يعلو فوق نجيل الهند وأثر باقٍ من الدخان المقدس.",
    },
    category: "woody",
    price: 650,
    size: "75 ml",
    image:
      "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1200&q=88",
    notes: { en: ["Cardamom", "Vetiver", "Incense"], ar: ["هيل", "نجيل الهند", "بخور"] },
    availability: "available",
  },
  {
    id: "amber-moon",
    name: { en: "Amber Moon", ar: "آمبر مون" },
    subtitle: { en: "Labdanum · Vanilla · Benzoin", ar: "لادن · فانيلا · جاوي" },
    description: {
      en: "A golden composition of resin, dark vanilla and glowing benzoin.",
      ar: "توليفة ذهبية من الراتنج والفانيلا الداكنة والجاوي المتوهج.",
    },
    category: "amber",
    price: 710,
    size: "75 ml",
    image:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=1200&q=88",
    notes: { en: ["Labdanum", "Vanilla", "Benzoin"], ar: ["لادن", "فانيلا", "جاوي"] },
    availability: "low",
  },
];
