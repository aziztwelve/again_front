export interface Review {
    id: number;
    content: string;
    rating: number;
    published_at: string;
    created_at: string;
    client: {
        id: number;
        name: string;
    },


    likes_count: number;
    is_liked: boolean;

}