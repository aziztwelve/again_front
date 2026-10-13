import type { Product } from '~/types/catalog';
import type { OrderHistoryItem } from '~/types/orders';

export interface HistoryCartItem extends Product {
    product_variant_id: number | null;
    color_id: number | null;
    selected_color?: { id: number };
    item_key: string;
    quantity: number;
}

/** Merge by product/variant/color, preserving other cart lines and their quantities. */
export function mergeHistoryItem(cart: HistoryCartItem[], product: Product, item: OrderHistoryItem, key: string) {
    const variant = item.product_variant_id
        ? product.available_variants?.find(v => v.id === item.product_variant_id
            && (item.color_id == null || (v.color_id ?? null) === item.color_id))
        : null;
    const colorId = item.color_id ?? variant?.color_id ?? null;
    if (variant?.is_active === false || (colorId && !product.colors?.some(color => color.id === colorId))) {
        throw new Error(`Вариант товара «${item.name}» больше недоступен.`);
    }
    if ((item.product_variant_id && !variant) || (!item.product_variant_id && product.has_variants)) {
        throw new Error(`Вариант товара «${item.name}» больше недоступен.`);
    }
    const existing = cart.find(line => line.id === product.id
        && (line.product_variant_id ?? null) === item.product_variant_id
        && (line.color_id ?? line.selected_color?.id ?? null) === colorId);
    const quantity = (existing?.quantity ?? 0) + item.quantity;
    const stock = Number(variant ? variant.quantity : product.stock_quantity);
    if (!Number.isFinite(stock) || quantity > stock || item.quantity < 1) {
        throw new Error(`Недостаточно товара «${item.name}» в наличии. Откройте каталог и выберите доступное количество.`);
    }
    const price = Number(variant ? variant.price : product.price);
    if (!Number.isFinite(price) || price < 0) throw new Error(`Не удалось уточнить цену товара «${item.name}».`);
    const color = product.colors?.find(c => c.id === colorId) ?? null;
    const next = {
        ...product,
        price,
        product_variant_id: item.product_variant_id,
        color_id: colorId,
        selected_variant: variant ? { ...variant, name: variant.size, price, old_price: variant.old_price ?? price } : null,
        selected_color: color,
        quantity,
        item_key: existing?.item_key ?? key,
    } as unknown as HistoryCartItem;
    return existing ? cart.map(line => line === existing ? next : line) : [...cart, next];
}
