// Типы, используемые для оформления заказа и публичного просмотра.
// Старый интерфейс `Order` (из ~/types/orders.ts) используется в личном кабинете
// для списка `/api/orders/user` и здесь не трогаем — это плоский Eloquent-объект.

export interface PublicOrderItem {
    id: number;
    name: string;
    sku: string | null;
    quantity: number;
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

export interface PublicOrder {
    view_token: string;
    order_number: string;
    created_at: string;
    status: PublicOrderStatusInfo;
    payment_status: PublicOrderStatusInfo;
    payment_method: string | null;
    total_amount: number;
    discount_amount: number;
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
     * Email опционален. Используется только для гостевого заказа —
     * для авторизованного клиента бэк подтянет email из его профиля.
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
