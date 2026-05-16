export const useReviewLikes = () => {
    const authStore = useAuthStore();

    /**
     * Поставить лайк отзыву
     */
    const likeReview = async (reviewId: number) => {
        if (!authStore.isAuthenticated) {
            return {
                success: false,
                message: 'Необходима авторизация'
            };
        }

        const { data, error } = await useApi(`/reviews/${reviewId}/like`, {}, '', 'POST');

        if (error.value) {
            return {
                success: false,
                message: 'Ошибка при добавлении лайка'
            };
        }

        return data.value;
    };

    /**
     * Убрать лайк с отзыва
     */
    const unlikeReview = async (reviewId: number) => {
        if (!authStore.isAuthenticated) {
            return {
                success: false,
                message: 'Необходима авторизация'
            };
        }

        const { data, error } = await useApi(`/reviews/${reviewId}/unlike`, {}, '', 'DELETE');

        if (error.value) {
            return {
                success: false,
                message: 'Ошибка при удалении лайка'
            };
        }

        return data.value;
    };

    /**
     * Переключить лайк (лайкнуть или убрать лайк)
     */
    const toggleLike = async (review: any) => {
        if (review.is_liked) {
            return await unlikeReview(review.id);
        } else {
            return await likeReview(review.id);
        }
    };

    return {
        likeReview,
        unlikeReview,
        toggleLike
    };
};