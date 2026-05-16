export interface Category {
    id: number;
    name: string;
    slug?: string;
    description?: string;
    depth?: number;
    parent_id?: number;
    show_in_catalog_menu?: boolean;
    show_as_home_banner?: boolean;
    banner_image?: string;
    banner_url?: string;
}