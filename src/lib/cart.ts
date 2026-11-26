import type { Product } from "../data/products";

export type Cart = Record<string, number>;
export const MAX_QUANTITY = 99;

export function normalizeCart(value: unknown, products: readonly Product[]): Cart {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const known = new Set(products.map((product) => product.id));
  const cart: Cart = {};
  for (const [id, quantity] of Object.entries(value)) {
    if (known.has(id) && Number.isSafeInteger(quantity) && (quantity as number) > 0) {
      cart[id] = Math.min(quantity as number, MAX_QUANTITY);
    }
  }
  return cart;
}

export function changeQuantity(
  cart: Cart,
  id: string,
  delta: number,
  products: readonly Product[],
): Cart {
  if (!products.some((product) => product.id === id) || !Number.isSafeInteger(delta)) return cart;
  const next = Math.max(0, Math.min(MAX_QUANTITY, (cart[id] || 0) + delta));
  if (!next) {
    const { [id]: removed, ...rest } = cart;
    void removed;
    return rest;
  }
  return { ...cart, [id]: next };
}

export function cartTotals(cart: Cart, products: readonly Product[]) {
  return products.reduce(
    (totals, product) => {
      const quantity = cart[product.id] || 0;
      return {
        count: totals.count + quantity,
        subtotal: totals.subtotal + quantity * product.price,
      };
    },
    { count: 0, subtotal: 0 },
  );
}
