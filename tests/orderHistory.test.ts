import { describe, expect, it } from 'vitest';
import { mergeHistoryItem, type HistoryCartItem } from '../utils/orderHistory';
import type { Product } from '../types/catalog';
import type { OrderHistoryItem } from '../types/orders';

const product = {
  id: 1, name: 'Box', is_active: true, price: 200, stock_quantity: 10,
  colors: [{ id: 5, name: 'Black', code: '#000' }], has_variants: true,
  available_variants: [
    { id: 11, color_id: 5, size: 'M', quantity: 5, price: 250, is_active: true },
    { id: 12, color_id: 5, size: 'L', quantity: 5, price: 300, is_active: true },
  ],
} as Product;
const item = { product_id: 1, product_variant_id: 11, color_id: 5, name: 'Box', quantity: 2 } as OrderHistoryItem;

describe('Repeat order cart merge', () => {
  it('keeps another size and refreshes only the matching line with current prices', () => {
    const original = [
      { id: 1, product_variant_id: 11, color_id: 5, quantity: 1, price: 100, item_key: 'm', promo_code_applied: true },
      { id: 1, product_variant_id: 12, color_id: 5, quantity: 2, price: 300, item_key: 'l' },
    ] as unknown as HistoryCartItem[];
    const next = mergeHistoryItem(original, product, item, 'new');
    expect(next).toHaveLength(2);
    expect(next[0]).toMatchObject({ item_key: 'm', quantity: 3, price: 250, selected_variant: { id: 11, price: 250 } });
    expect(next[0]).not.toHaveProperty('promo_code_applied');
    expect(next[1]).toBe(original[1]);
    expect(original[0].quantity).toBe(1);
  });

  it('counts the existing cart toward stock without changing it on failure', () => {
    const cart = [{ id: 1, product_variant_id: 11, color_id: 5, quantity: 4 }] as HistoryCartItem[];
    expect(() => mergeHistoryItem(cart, product, item, 'new')).toThrow('Недостаточно товара');
    expect(cart[0].quantity).toBe(4);
  });

  it('rejects removed or inactive variants instead of substituting another size', () => {
    expect(() => mergeHistoryItem([], product, { ...item, product_variant_id: 99 }, 'new')).toThrow('больше недоступен');
    const inactive = { ...product, available_variants: [{ ...product.available_variants[0], is_active: false }] };
    expect(() => mergeHistoryItem([], inactive, item, 'new')).toThrow('больше недоступен');
  });

  it('preserves quantities of a different product and adds a simple product separately', () => {
    const cart = [{ id: 2, product_variant_id: null, color_id: null, quantity: 1, item_key: 'other' }] as HistoryCartItem[];
    const next = mergeHistoryItem(cart, { ...product, has_variants: false }, { ...item, product_variant_id: null, color_id: null }, 'new');
    expect(next[0]).toBe(cart[0]);
    expect(next[1]).toMatchObject({ id: 1, quantity: 2, price: 200, selected_variant: null });
  });
});
