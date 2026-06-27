import type {Category} from "~/types/category";

export interface Product {
    id: number,
    absorbency_level: number,
    name: string,
    marketplace_links: object,
    code: string,
    description?: string,
    slug: string,
    type: string,
    default_unit_id?: number,
    is_active: boolean,
    has_variants:  boolean,
    avg_rating?: string
    price?: number,
    old_price?: number,
    is_new: boolean,
    discount_price?: string,
    discount_percentage?: string,
    total_discount?: string,
    sku?: string,
    barcode?: string,
    weight?: string,
    length?: string,
    width?: string,
    height?: string,
    colors?: Color[],
    variants?: Variation[],
    available_variants: AvailableVariation[],
    default_unit?: string,
    images?: Image[],
    main_image?: Image,
    quantity?: number,
    item_key?: string,
    selected_variant?: Product,
    selected_color?: object,
    stock_quantity: number,
    in_stock?: boolean,
    cta?: 'add_to_cart' | 'notify_restock'
}

export interface Color {
    id: number,
    name: string,
    code: string
}

export interface AvailableVariation {
    id: number,
    color_id: number,
    size: string,
    quantity: number,
    price: number
}

export interface Variation {
    product_variant_id: number,
    size: string
}

export interface Image {
    id: number,
    path: string
}

export interface Catalog {
    data: Product[],
    meta: {
        last_page: number,
        category?: Category,
    }
}