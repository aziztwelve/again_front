/** Receipt snapshots returned by GET /orders/user. Prices are line totals. */
export interface OrderHistoryItem {
    id: number;
    product_id: number | null;
    product_variant_id: number | null;
    color_id: number | null;
    name: string;
    product_slug: string | null;
    variant_name: string | null;
    color_name: string | null;
    quantity: number;
    total: number;
    original_total: number;
    discount_total: number;
    is_gift: boolean;
    image_path: string | null;
}

export interface Order {
    id: number;
    order_number: string | number;
    status: string;
    status_label: string | null;
    created_at: string;
    view_token: string | null;
    items: OrderHistoryItem[];
    quantity: number;
    subtotal: number;
    discount_amount: number;
    delivery_cost: number | null;
    total_amount: number;
    gift_card_amount: number;
    delivery_address: string | null;
    delivery_method: string | null;
    delivery_target: string | null;
    tracking_number: string | null;
    tracking_url: string | null;
}

export interface OrdersPagination {
    page: number;
    total: number;
    per_page: number;
}

export interface UserOrdersResponse {
    orders: Order[];
    pagination?: OrdersPagination;
}
