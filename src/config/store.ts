import heroImage from "../assets/luna-hero.png";

export type Language = "en" | "ar";
export type Localized<T = string> = Record<Language, T>;

export interface StoreConfig {
  brand: string;
  wordmark: { primary: string; secondary: string };
  isDemo: boolean;
  currency: string;
  locale: Localized;
  whatsapp: {
    enabled: boolean;
    number: string;
    demoPrefix: Localized;
    greeting: Localized;
    subtotalLabel: Localized;
    closing: Localized;
    demoClosing: Localized;
  };
  email: string;
  phone: string;
  location: Localized;
  social: { instagram: string; tiktok: string };
  colors: {
    ivory: string;
    paper: string;
    burgundy: string;
    charcoal: string;
    gold: string;
    line: string;
  };
  hero: {
    image: string;
    imageAlt: Localized;
    eyebrow: Localized;
    title: Localized;
    body: Localized;
  };
  story: {
    image: string;
    eyebrow: Localized;
    title: Localized;
    body: Localized;
    stat: { value: string; description: Localized };
  };
  catalog: { eyebrow: Localized; title: Localized; body: Localized };
  featured: { eyebrow: Localized; title: Localized; body: Localized };
  footer: { line: Localized; copyrightYear: number; credit: string };
  delivery: { announcement: Localized; label: Localized; message: Localized };
  categories: { id: string; label: Localized }[];
}

// Client-facing content lives here. See CLIENT_SETUP.md before turning off demo mode.
export const storeConfig: StoreConfig = {
  brand: "LUNA",
  wordmark: { primary: "LUNA", secondary: "PARFUMS" },
  isDemo: true,
  currency: "AED",
  locale: { en: "en-AE", ar: "ar-AE" },
  whatsapp: {
    enabled: true,
    number: "970597054114",
    demoPrefix: { en: "Demo Order - CatalogFlow", ar: "طلب تجريبي - CatalogFlow Demo" },
    greeting: {
      en: "This is a demonstration inquiry about these sample products:",
      ar: "هذا استفسار تجريبي عن المنتجات التالية:",
    },
    subtotalLabel: { en: "Estimated subtotal", ar: "المجموع التقديري" },
    closing: {
      en: "Please confirm availability and the final order total.",
      ar: "يرجى تأكيد التوفر والمبلغ النهائي للطلب.",
    },
    demoClosing: {
      en: "This is a fictional demonstration, not a real purchase. Please do not fulfill this inquiry.",
      ar: "هذا عرض تجريبي خيالي، وليس عملية شراء حقيقية. يرجى عدم تنفيذ هذا الاستفسار.",
    },
  },
  email: "concierge@luna-parfums.com",
  phone: "+971 50 123 4567",
  location: { en: "Dubai, United Arab Emirates", ar: "دبي، الإمارات العربية المتحدة" },
  social: { instagram: "https://instagram.com", tiktok: "https://tiktok.com" },
  colors: {
    ivory: "#f5f0e8",
    paper: "#faf8f4",
    burgundy: "#581d2b",
    charcoal: "#252220",
    gold: "#ae8952",
    line: "#d8d0c5",
  },
  hero: {
    image: heroImage,
    imageAlt: { en: "LUNA perfume in warm evening light", ar: "عطر لونا في ضوء المساء الدافئ" },
    eyebrow: { en: "The debut collection", ar: "المجموعة الأولى" },
    title: { en: "Scent after dark.", ar: "عطر ما بعد الغروب." },
    body: {
      en: "Perfumes with presence. Composed from precious materials and made to linger.",
      ar: "عطور ذات حضور. صيغت من أثمن المكونات لتترك أثراً لا يُنسى.",
    },
  },
  story: {
    image:
      "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1200&q=88",
    eyebrow: { en: "The house of LUNA", ar: "دار لونا" },
    title: {
      en: "A study in memory, material and moonlight.",
      ar: "دراسة في الذاكرة والمادة وضوء القمر.",
    },
    body: {
      en: "LUNA creates modern fragrances with a timeless point of view. Each extrait is composed in small batches, balancing the finest natural essences with contemporary accords.",
      ar: "تصنع لونا عطوراً عصرية برؤية خالدة. يُصاغ كل عطر على دفعات صغيرة بموازنة أجود الخلاصات الطبيعية مع النفحات المعاصرة.",
    },
    stat: {
      value: "18%",
      description: {
        en: "Parfum concentration for an enduring trail.",
        ar: "تركيز عطري يمنحك أثراً يدوم طويلاً.",
      },
    },
  },
  catalog: {
    eyebrow: { en: "LUNA", ar: "لونا" },
    title: { en: "The collection", ar: "المجموعة" },
    body: {
      en: "Find your signature among our singular compositions.",
      ar: "اعثر على عطرك المميز بين تركيباتنا الاستثنائية.",
    },
  },
  featured: {
    eyebrow: { en: "The signature edit", ar: "اختياراتنا المميزة" },
    title: { en: "Scents with a point of view.", ar: "عطور برؤية متفردة." },
    body: {
      en: "Distinct expressions, each composed to unfold slowly on skin.",
      ar: "تعبيرات متفردة، صيغ كل منها ليتكشف ببطء على البشرة.",
    },
  },
  footer: {
    line: { en: "Fine fragrance, composed in Dubai.", ar: "عطور فاخرة صيغت في دبي." },
    copyrightYear: 2025,
    credit: "CatalogFlow",
  },
  delivery: {
    announcement: {
      en: "Complimentary UAE delivery on all orders",
      ar: "توصيل مجاني داخل الإمارات على جميع الطلبات",
    },
    label: { en: "Complimentary", ar: "مجاني" },
    message: { en: "Delivery: Complimentary within the UAE", ar: "التوصيل: مجاني داخل الإمارات" },
  },
  categories: [
    { id: "floral", label: { en: "Floral", ar: "زهري" } },
    { id: "woody", label: { en: "Woody", ar: "خشبي" } },
    { id: "amber", label: { en: "Amber", ar: "عنبري" } },
  ],
};
