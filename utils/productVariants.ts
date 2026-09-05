import type {AvailableVariation, Color} from '~/types/catalog';

// Порядок размеров, как в списке размеров карточки (Variations.vue).
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const sizeRank = (size: string): number => {
    const index = SIZE_ORDER.indexOf(size);
    return index === -1 ? Number.POSITIVE_INFINITY : index;
};

export const variantInStock = (variant: AvailableVariation): boolean =>
    variant.in_stock !== false && Number(variant.quantity ?? 0) > 0;

export const variantPriced = (variant: AvailableVariation): boolean =>
    Number(variant.price ?? 0) > 0;

// Сортировка вариантов по умолчанию: цвета в порядке карточки, размеры XS→XXXL.
export const sortVariantsDefault = (
    variants: AvailableVariation[],
    colors: Color[] = [],
): AvailableVariation[] => {
    const colorRank = new Map(colors.map((color, index) => [Number(color.id), index]));

    return [...variants].sort((a, b) => {
        const colorA = colorRank.get(Number(a.color_id)) ?? Number.POSITIVE_INFINITY;
        const colorB = colorRank.get(Number(b.color_id)) ?? Number.POSITIVE_INFINITY;
        if (colorA !== colorB) return colorA - colorB;
        return sizeRank(a.size) - sizeRank(b.size);
    });
};

// Вариант по умолчанию: первый в наличии и с ценой по сортировке по
// умолчанию (если покупаемы все — это просто первый по сортировке); если
// цен нет ни у кого — первый в наличии.
export const pickDefaultVariant = (
    variants: AvailableVariation[],
    colors: Color[] = [],
): AvailableVariation | null => {
    const sorted = sortVariantsDefault(variants, colors);
    if (!sorted.length) return null;

    return sorted.find(variant => variantInStock(variant) && variantPriced(variant))
        ?? sorted.find(variantInStock)
        ?? sorted[0];
};
