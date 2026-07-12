export interface ReviewClient {
    name: string;
}

export interface Review {
    id: number;
    content: string;
    rating: number;
    published_at: string | null;
    created_at: string | null;
    client: ReviewClient | null;
    likes_count: number;
    is_liked: boolean;
}

export interface ProductReviewsResponse {
    success: true;
    data: Review[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        has_more: boolean;
    };
}
