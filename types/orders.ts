import type {Product} from "~/types/catalog";

export interface Order {
    id: number,
    order_number: number,
    status: string,
    total_amount: string,
    notes?: string,
    created_at: string,
    items: Product[],
    /**
     * 32-символьный публичный токен заказа. Возвращается Eloquent-моделью
     * напрямую (см. `Order::$fillable`). На стороне фронта используется,
     * чтобы вести из истории на единую публичную страницу заказа.
     */
    view_token?: string | null,
}

// Формат от `App\Helpers\PaginationHelper::format()` — `{ page, total, per_page }`.
export interface OrdersPagination {
    page: number,
    total: number,
    per_page: number,
}

export interface UserOrdersResponse {
    orders: Order[],
    pagination?: OrdersPagination,
}