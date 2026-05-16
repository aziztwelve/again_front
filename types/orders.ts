import type {Product} from "~/types/catalog";

export interface Order {
    id: number,
    order_number: number,
    status: string,
    total_amount: string,
    notes?: string,
    created_at: string,
    items: Product[]
}