export interface Sale {
    id: number,
    title?: string,
    description: string,
    image: string,
    discount_amount: string,
    discount_type: string,
    code: string,
    image_url?: string,
    expires_at: string
    birthday_discount: boolean,
    notified_at: string
}

export const discountType = {
    percentage: 'Процентная',
    fixed: 'Фиксированная',
}

export const discountCurrency = {
    percentage: '%',
    fixed: '₽',
}