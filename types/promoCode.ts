// types/promoCode.ts

export type DiscountBehavior = 'replace' | 'stack' | 'skip'

export interface PromoCode {
    id: number
    code: string
    type: 'all' | 'specific' | string
    discount_type: 'fixed' | 'percentage' | string
    discount_amount: number
    discount_behavior?: DiscountBehavior
    max_uses?: number
    total_uses?: number
    expires_at?: string | null
    is_active: boolean
    description?: string
    created_at?: string
    updated_at?: string
}

export interface ProductDiscount {
    has_discount: boolean
    discount_id: number | null
    discount_percentage: number | null
    total_discount: number | null
}

export interface PromoCodeInfo {
    promo_code_id: number
    promo_discount: number
    price_with_promo: number
    behavior: DiscountBehavior
    original_discount_replaced: boolean
    price_before_promo: number | null
}

export interface ProductSavings {
    total_savings: number
    discount_savings: number
    promo_savings: number
    savings_percentage: number
}

export interface ProductWithPromo {
    product_id: number
    variant_id: number | null
    name: string
    is_variant: boolean

    // Цены
    original_price: number
    old_price: number | null
    price_after_discount: number
    final_price: number

    // Информация о скидке товара
    discount: ProductDiscount

    // Информация о промокоде
    promo_code_applied: boolean
    promo_code_info: PromoCodeInfo | null

    // Расчет экономии
    savings: ProductSavings
}

export interface PromoValidateSuccess {
    success: true
    message: string
    promo_code: PromoCode
    applicable_products: ProductWithPromo[]
    not_applicable_products?: ProductWithPromo[]
}

export interface PromoValidateError {
    success: false
    message: string
    promo_code?: PromoCode
    not_applicable_products?: any[]
}

// Хелперы для работы с промокодами
export const getDiscountBehaviorLabel = (behavior: DiscountBehavior): string => {
    const labels = {
        'replace': 'Заменяет скидку товара',
        'stack': 'Применяется поверх скидки',
        'skip': 'Не применяется к товарам со скидкой'
    }
    return labels[behavior] || 'Неизвестно'
}

export const getDiscountBehaviorDescription = (behavior: DiscountBehavior): string => {
    const descriptions = {
        'replace': 'Промокод отменяет текущую скидку и применяется к оригинальной цене',
        'stack': 'Промокод применяется к уже сниженной цене, скидки суммируются',
        'skip': 'Промокод не применяется к товарам с активными скидками'
    }
    return descriptions[behavior] || ''
}

export const formatPromoDiscount = (promoCode: PromoCode): string => {
    if (promoCode.discount_type === 'percentage') {
        return `-${promoCode.discount_amount}%`
    }
    return `-${promoCode.discount_amount}₽`
}