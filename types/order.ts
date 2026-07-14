// Типы, используемые для оформления заказа и публичного просмотра.
// Старый интерфейс `Order` (из ~/types/orders.ts) используется в личном кабинете
// для списка `/api/orders/user` и здесь не трогаем — это плоский Eloquent-объект.

export interface PublicOrderItem {
    id: number;
    product_id: number | null;
    product_variant_id: number | null;
    color_id: number | null;
    product_name: string | null;
    variant_name: string | null;
    color_name: string | null;
    name: string;
    sku: string | null;
    quantity: number;
    price: number;
    discount: number;
    unit_price: number;
    total: number;
    image: string | null;
}

export interface PublicOrderStatusInfo {
    value: string;
    label: string | null;
}

export interface PublicOrderRecipient {
    name: string | null;
    phone: string | null;
    email: string | null;
}

export interface PublicOrderPromoCode {
    code: string;
}

export interface PublicOrder {
    view_token: string;
    order_number: string;
    created_at: string;
    status: PublicOrderStatusInfo;
    payment_status: PublicOrderStatusInfo;
    payment_method: string | null;
    total_amount: number;
    /** items_discount + promo_discount (на бэке = order.discount_amount). */
    discount_amount: number;
    /** Скидка на товары (auto + ручные) без промокода. */
    items_discount: number;
    /** Сумма скидки от промокода (если был привязан). */
    promo_discount: number;
    /** Применённый промокод (если был). */
    promo_code: PublicOrderPromoCode | null;
    delivery_cost: number;
    delivery_method: string | null;
    delivery_target: string | null;
    delivery_address: string | null;
    recipient: PublicOrderRecipient;
    items: PublicOrderItem[];
    tracking_number: string | null;
}

export interface PublicOrderResponse {
    success: boolean;
    order: PublicOrder;
}

// Тело формы checkout (то, что хранится в reactive state на странице).
export interface CheckoutFormUser {
    first_name: string;
    last_name: string;
    phone: string;
    /**
     * Email. Обязателен для гостевого заказа (на него уходит чек и ссылка
     * на заказ) — валидируется в useCheckoutSubmit.validateEmail. Для
     * авторизованного клиента поле скрыто и бэк подтянет email из профиля.
     */
    email: string;
}

export interface CheckoutForm {
    promo_code: string;
    gift_card_data: string;
    gift_card_code: string;
    user: CheckoutFormUser;
    country_code: string;
    country_name: string;
    city_name: string;
    delivery_address: string;
    region: string;
    postal_code: string;
    entrance: string;
    floor: string;
    intercom: string;
    delivery_date: string | number;
    buyer_comment: string;
    delivery_method_id: number | null;
    delivery_method_name: string;
    delivery_method_code: string;
    payment_method: string;
    yandex_offer?: {
        offer_id: string;
        tariff_name?: string;
        price: number;
        delivery_date?: string;
    } | null;
    /** ID выбранного пункта выдачи Яндекс.Доставки (только для yandex_pickup). */
    pvz_code?: string | null;
    /** Адрес выбранного ПВЗ. */
    pvz_address?: string | null;
}

// Тело POST /public/orders.
export interface CheckoutPayload {
    promo_code?: string;
    gift_card_code?: string;
    gift_card_data?: unknown;
    items: Array<{
        product_id: number;
        product_variant_id: number | null;
        color_id: number | null;
        quantity: number;
        price: number;
    }>;
    user: CheckoutFormUser;
    recipient: CheckoutFormUser;
    delivery_address: Record<string, unknown>;
    delivery_method?: { name: string };
    payment_method?: string;
    /**
     * Применённые акции (мультиакционная/стекируемая модель). По одному элементу
     * на каждую применённую акцию: выбранный подарок (+ вариант, если есть размеры)
     * или «скидка вместо подарка».
     */
    promotions?: Array<{
        promotion_id: number;
        use_discount_instead: boolean;
        gift_product_id?: number;
        gift_product_variant_id?: number;
    }>;
    [key: string]: unknown;
}

// Унифицированный результат submit'а. Витрина по нему решает, куда вести юзера.
export interface CheckoutResult {
    success: boolean;
    /** view_token заказа — если есть, ведём на /orders/{token}. */
    viewToken?: string | null;
    /** Числовой id (старый success-fallback). */
    orderId?: number | null;
    /** Человеко-читаемое сообщение об ошибке. */
    error?: string;
}
