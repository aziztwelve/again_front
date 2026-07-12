import type { MaybeRefOrGetter } from 'vue';
import type { ProductReviewsResponse, Review } from '~/types/review';

export interface ProductReviewsError {
    status: number | null;
    retryable: boolean;
    kind: 'network' | 'http' | 'contract';
}

const PER_PAGE = 8;

const normalizeError = (error: any, contract = false): ProductReviewsError => {
    const rawStatus = error?.statusCode ?? error?.status ?? error?.response?.status ?? null;
    const numericStatus = Number(rawStatus);
    const status = Number.isFinite(numericStatus) && numericStatus > 0 ? numericStatus : null;
    return {
        status,
        retryable: !contract && (status === null || status === 408 || status === 429 || status >= 500),
        kind: contract ? 'contract' : (status === null ? 'network' : 'http'),
    };
};

const isValidResponse = (response: any, requestedPage: number): response is ProductReviewsResponse => {
    const meta = response?.meta;
    return response?.success === true
        && Array.isArray(response.data)
        && meta?.current_page === requestedPage
        && meta?.per_page === PER_PAGE
        && Number.isInteger(meta.total) && meta.total >= 0
        && Number.isInteger(meta.last_page) && meta.last_page >= 1
        && response.data.length <= PER_PAGE
        && meta.has_more === (meta.current_page < meta.last_page)
        && response.data.every((review: any) => Number.isInteger(review?.id) && review.id > 0);
};

export const useProductReviews = async (productId: MaybeRefOrGetter<number>) => {
    const apiClient = useApiClient();
    const items = ref<Review[]>([]);
    const currentPage = ref(0);
    const total = ref<number | null>(null);
    const sessionTotal = ref<number | null>(null);
    const lastPage = ref(1);
    const isInitialLoading = ref(true);
    const isLoadingMore = ref(false);
    const initialError = ref<ProductReviewsError | null>(null);
    const loadMoreError = ref<ProductReviewsError | null>(null);
    const isOutOfSync = ref(false);
    const addedCount = ref(0);
    let generation = 0;
    let controller: AbortController | null = null;

    const hasReviews = computed(() => items.value.length > 0);
    const hasInitialResult = computed(() => total.value !== null && initialError.value === null);
    const hasMore = computed(() => hasInitialResult.value
        && !isOutOfSync.value
        && (loadMoreError.value === null || loadMoreError.value.retryable)
        && currentPage.value < lastPage.value);

    const requestPage = async (page: number, signal?: AbortSignal) => apiClient<ProductReviewsResponse>(
        `/public/catalog/products/${toValue(productId)}/reviews`,
        { query: { page, per_page: PER_PAGE }, signal },
    );

    const applyInitial = (response: ProductReviewsResponse) => {
        if (!isValidResponse(response, 1)) throw new Error('Invalid product reviews response');
        items.value = response.data;
        currentPage.value = 1;
        total.value = response.meta.total;
        sessionTotal.value = response.meta.total;
        lastPage.value = response.meta.last_page;
    };

    const { data: ssrData, error: ssrError } = await useAsyncData(
        `product-reviews-${toValue(productId)}`,
        () => requestPage(1),
    );

    try {
        if (ssrError.value) throw ssrError.value;
        if (!ssrData.value) throw new Error('Invalid product reviews response');
        applyInitial(ssrData.value);
    } catch (error) {
        initialError.value = normalizeError(error, !ssrError.value);
    } finally {
        isInitialLoading.value = false;
    }

    const refresh = async () => {
        generation += 1;
        const requestGeneration = generation;
        controller?.abort();
        controller = new AbortController();
        items.value = [];
        currentPage.value = 0;
        total.value = null;
        sessionTotal.value = null;
        lastPage.value = 1;
        initialError.value = null;
        loadMoreError.value = null;
        isOutOfSync.value = false;
        isLoadingMore.value = false;
        isInitialLoading.value = true;

        try {
            const response = await requestPage(1, controller.signal);
            if (requestGeneration !== generation) return;
            applyInitial(response);
        } catch (error: any) {
            if (requestGeneration !== generation || error?.name === 'AbortError') return;
            initialError.value = normalizeError(error, error?.message === 'Invalid product reviews response');
        } finally {
            if (requestGeneration === generation) isInitialLoading.value = false;
        }
    };

    const loadMore = async () => {
        if (isLoadingMore.value || !hasMore.value) return;
        const requestedPage = currentPage.value + 1;
        const requestGeneration = generation;
        isLoadingMore.value = true;
        loadMoreError.value = null;

        try {
            const response = await requestPage(requestedPage);
            if (requestGeneration !== generation) return;
            if (!isValidResponse(response, requestedPage)) {
                loadMoreError.value = normalizeError(null, true);
                return;
            }
            if (response.meta.total !== sessionTotal.value) {
                isOutOfSync.value = true;
                return;
            }

            const knownIds = new Set(items.value.map(({ id }) => id));
            const unique = response.data.filter(({ id }) => !knownIds.has(id));
            if ((response.data.length === 0 || unique.length === 0) && response.meta.has_more) {
                isOutOfSync.value = true;
                return;
            }

            items.value.push(...unique);
            addedCount.value = unique.length;
            currentPage.value = response.meta.current_page;
            total.value = response.meta.total;
            lastPage.value = response.meta.last_page;
            if (!response.meta.has_more && items.value.length !== total.value) isOutOfSync.value = true;
        } catch (error) {
            if (requestGeneration === generation) loadMoreError.value = normalizeError(error);
        } finally {
            if (requestGeneration === generation) isLoadingMore.value = false;
        }
    };

    watch(() => toValue(productId), (next, previous) => {
        if (next !== previous) void refresh();
    });

    onScopeDispose(() => controller?.abort());

    return {
        items, currentPage, perPage: PER_PAGE, total, sessionTotal, lastPage,
        isInitialLoading, isLoadingMore, initialError, loadMoreError, isOutOfSync,
        hasReviews, hasInitialResult, hasMore, shownCount: computed(() => items.value.length),
        addedCount, loadMore, refresh,
    };
};
