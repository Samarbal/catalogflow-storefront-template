import type { StoreConfig, Language } from "../config/store";
import type { Product } from "../data/products";
import { cartTotals, type Cart } from "./cart.ts";

export function money(value: number, lang: Language, store: StoreConfig) {
  return new Intl.NumberFormat(store.locale[lang], {
    style: "currency",
    currency: store.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildInquiryMessage(
  cart: Cart,
  products: readonly Product[],
  lang: Language,
  store: StoreConfig,
) {
  const lines = products
    .filter((product) => cart[product.id] > 0)
    .map(
      (product) =>
        `• ${product.name[lang]} (${product.size}) × ${cart[product.id]} — ${money(product.price * cart[product.id], lang, store)}`,
    );
  if (!lines.length) return "";
  const prefix = store.isDemo ? `${store.whatsapp.demoPrefix[lang]}\n\n` : "";
  const delivery = store.isDemo ? "" : `\n${store.delivery.message[lang]}`;
  const closing = store.isDemo ? store.whatsapp.demoClosing[lang] : store.whatsapp.closing[lang];
  return `${prefix}${store.whatsapp.greeting[lang]}\n\n${lines.join("\n")}\n\n${store.whatsapp.subtotalLabel[lang]}: ${money(cartTotals(cart, products).subtotal, lang, store)}${delivery}\n\n${closing}`;
}

export function whatsappInquiryUrl(message: string, store: StoreConfig) {
  const number = store.whatsapp.number;
  if (!store.whatsapp.enabled || !/^[1-9]\d{7,14}$/.test(number) || !message) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
