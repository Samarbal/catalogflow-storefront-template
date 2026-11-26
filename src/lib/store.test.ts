import assert from "node:assert/strict";
import test from "node:test";
import type { StoreConfig } from "../config/store.ts";
import type { Product } from "../data/products.ts";
import { cartTotals, changeQuantity, normalizeCart } from "./cart.ts";
import { buildInquiryMessage, whatsappInquiryUrl } from "./checkout.ts";

const products = [
  { id: "rose", name: { en: "Rose", ar: "ورد" }, price: 100, size: "50 ml" },
  { id: "oud", name: { en: "Oud", ar: "عود" }, price: 250, size: "75 ml" },
] as Product[];

const store = {
  isDemo: false,
  currency: "AED",
  locale: { en: "en-AE", ar: "ar-AE" },
  whatsapp: {
    enabled: true,
    number: "970597054114",
    demoPrefix: { en: "Demo Order - CatalogFlow", ar: "طلب تجريبي - CatalogFlow Demo" },
    greeting: { en: "Hello, inquiry:", ar: "مرحباً، استفسار:" },
    subtotalLabel: { en: "Estimated subtotal", ar: "المجموع التقديري" },
    closing: { en: "Please confirm.", ar: "يرجى التأكيد." },
    demoClosing: { en: "Not a real purchase.", ar: "ليست عملية شراء حقيقية." },
  },
  delivery: { message: { en: "Delivery: Free", ar: "التوصيل: مجاني" } },
} as StoreConfig;

test("normalizes unknown cart data and limits quantities", () => {
  assert.deepEqual(normalizeCart(null, products), {});
  assert.deepEqual(normalizeCart(["rose"], products), {});
  assert.deepEqual(normalizeCart({ rose: 2, oud: 1000, stale: 3, bad: -2 }, products), {
    rose: 2,
    oud: 99,
  });
  assert.deepEqual(normalizeCart({ rose: "2", oud: 1.5 }, products), {});
});

test("updates known products and computes totals", () => {
  const cart = changeQuantity({ rose: 2 }, "oud", 1, products);
  assert.deepEqual(cartTotals(cart, products), { count: 3, subtotal: 450 });
  assert.deepEqual(changeQuantity(cart, "rose", -2, products), { oud: 1 });
  assert.deepEqual(changeQuantity(cart, "missing", 1, products), cart);
  assert.equal(changeQuantity({ rose: 99 }, "rose", 1, products).rose, 99);
});

test("builds localized inquiry with exact line totals and encoded URL", () => {
  const cart = { rose: 2, oud: 1 };
  const english = buildInquiryMessage(cart, products, "en", store);
  const arabic = buildInquiryMessage(cart, products, "ar", store);
  assert.ok(english.startsWith("Hello, inquiry:\n\n"));
  assert.ok(arabic.startsWith("مرحباً، استفسار:\n\n"));
  assert.match(english, /Rose \(50 ml\) × 2/);
  assert.match(english, /Oud \(75 ml\) × 1/);
  assert.match(english, /AED/);
  assert.match(english, /450/);
  assert.match(english, /Delivery: Free/);
  assert.match(english, /Please confirm/);
  assert.match(arabic, /ورد/);
  assert.match(arabic, /عود/);
  assert.equal(decodeURIComponent(whatsappInquiryUrl(english, store)!.split("?text=")[1]), english);
  assert.equal(buildInquiryMessage({}, products, "en", store), "");
});

test("demo mode opens only a draft to the configured number", () => {
  const demo = { ...store, isDemo: true };
  const message = buildInquiryMessage({ rose: 2 }, products, "en", demo);
  const arabicMessage = buildInquiryMessage({ rose: 2 }, products, "ar", demo);
  assert.ok(message.startsWith("Demo Order - CatalogFlow\n\n"));
  assert.ok(arabicMessage.startsWith("طلب تجريبي - CatalogFlow Demo\n\n"));
  assert.match(message, /Rose \(50 ml\) × 2/);
  assert.match(message, /AED/);
  assert.match(message, /200/);
  assert.match(arabicMessage, /ورد/);
  assert.match(arabicMessage, /المجموع التقديري/);
  assert.match(arabicMessage, /د\.إ|AED/);
  assert.match(message, /Not a real purchase/);
  assert.doesNotMatch(message, /Delivery: Free/);
  assert.equal(
    whatsappInquiryUrl(message, demo),
    `https://wa.me/970597054114?text=${encodeURIComponent(message)}`,
  );
});

test("disabled checkout, invalid number formats, and empty messages have no destination", () => {
  assert.equal(
    whatsappInquiryUrl("hello", { ...store, whatsapp: { ...store.whatsapp, enabled: false } }),
    null,
  );
  assert.equal(
    whatsappInquiryUrl("hello", { ...store, whatsapp: { ...store.whatsapp, number: "not-set" } }),
    null,
  );
  assert.equal(
    whatsappInquiryUrl("hello", {
      ...store,
      whatsapp: { ...store.whatsapp, number: "+970597054114" },
    }),
    null,
  );
  assert.equal(
    whatsappInquiryUrl("hello", {
      ...store,
      whatsapp: { ...store.whatsapp, number: "970 597 054114" },
    }),
    null,
  );
  assert.equal(whatsappInquiryUrl("", store), null);
});
