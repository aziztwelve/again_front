interface ReviewLikeResponse {
    success: boolean;
    likes_count: number;
    message?: string;
}

export const useReviewLikes = () => {
    const apiClient = useApiClient();
    const authStore = useAuthStore();

    const toggleLike = async (reviewId: number, isLiked: boolean): Promise<ReviewLikeResponse> => {
        if (!authStore.isAuthenticated) {
            return { success: false, likes_count: 0, message: 'Необходима авторизация' };
        }

        try {
            return await apiClient<ReviewLikeResponse>(
                `/reviews/${reviewId}/${isLiked ? 'unlike' : 'like'}`,
                { method: isLiked ? 'DELETE' : 'POST' },
            );
        } catch {
            return { success: false, likes_count: 0, message: 'Не удалось обновить отметку' };
        }
    };

    return { toggleLike };
};
