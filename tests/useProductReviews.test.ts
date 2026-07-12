import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    computed, effectScope, nextTick, ref, toValue, watch,
} from 'vue';
import type { ProductReviewsResponse, Review } from '../types/review';
import { useProductReviews } from '../composables/useProductReviews';

type ApiClient = (path: string, options: any) => Promise<ProductReviewsResponse>;

const review = (id: number): Review => ({
    id,
    content: `Review ${id}`,
    rating: 5,
    published_at: '2026-07-12T00:00:00Z',
    created_at: '2026-07-12T00:00:00Z',
    client: { name: `Client ${id}` },
    likes_count: 0,
    is_liked: false,
});

const page = (
    currentPage: number,
    ids: number[],
    total: number,
    lastPage = Math.max(1, Math.ceil(total / 8)),
): ProductReviewsResponse => ({
    success: true,
    data: ids.map(review),
    meta: {
        current_page: currentPage,
        per_page: 8,
        total,
        last_page: lastPage,
        has_more: currentPage < lastPage,
    },
});

const deferred = <T>() => {
    let resolve!: (value: T) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((yes, no) => {
        resolve = yes;
        reject = no;
    });
    return { promise, resolve, reject };
};

const mountComposable = async (apiClient: ApiClient, productId = ref(252)) => {
    vi.stubGlobal('ref', ref);
    vi.stubGlobal('computed', computed);
    vi.stubGlobal('watch', watch);
    vi.stubGlobal('toValue', toValue);
    vi.stubGlobal('onScopeDispose', vi.fn());
    vi.stubGlobal('useApiClient', () => apiClient);
    vi.stubGlobal('useAsyncData', async (_key: string, handler: () => Promise<ProductReviewsResponse>) => {
        try {
            return { data: ref(await handler()), error: ref(null) };
        } catch (error) {
            return { data: ref(null), error: ref(error) };
        }
    });

    const scope = effectScope();
    const state = await scope.run(() => useProductReviews(productId));
    if (!state) throw new Error('Composable scope did not return state');
    return { state, productId, stop: () => scope.stop() };
};

describe('useProductReviews', () => {
    beforeEach(() => vi.unstubAllGlobals());

    it('loads one page at a time and deduplicates appended reviews', async () => {
        const second = deferred<ProductReviewsResponse>();
        const api = vi.fn<ApiClient>()
            .mockResolvedValueOnce(page(1, [1, 2, 3, 4, 5, 6, 7, 8], 15, 2))
            .mockImplementationOnce(() => second.promise);
        const { state, stop } = await mountComposable(api);

        const firstClick = state.loadMore();
        const secondClick = state.loadMore();
        expect(api).toHaveBeenCalledTimes(2);
        expect(state.isLoadingMore.value).toBe(true);

        second.resolve(page(2, [8, 9, 10, 11, 12, 13, 14, 15], 15, 2));
        await Promise.all([firstClick, secondClick]);

        expect(state.items.value.map(({ id }) => id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        expect(state.currentPage.value).toBe(2);
        expect(state.isLoadingMore.value).toBe(false);
        expect(state.hasMore.value).toBe(false);
        stop();
    });

    it('keeps the requested page on retry after a retryable error', async () => {
        const api = vi.fn<ApiClient>()
            .mockResolvedValueOnce(page(1, [1, 2, 3, 4, 5, 6, 7, 8], 9, 2))
            .mockRejectedValueOnce({ status: 503 })
            .mockResolvedValueOnce(page(2, [9], 9, 2));
        const { state, stop } = await mountComposable(api);

        await state.loadMore();
        expect(state.currentPage.value).toBe(1);
        expect(state.loadMoreError.value).toMatchObject({ status: 503, retryable: true });
        expect(state.items.value).toHaveLength(8);

        await state.loadMore();
        expect(api.mock.calls.slice(1).map(([, options]) => options.query.page)).toEqual([2, 2]);
        expect(state.items.value).toHaveLength(9);
        expect(state.loadMoreError.value).toBeNull();
        stop();
    });

    it.each([
        ['changed total', page(2, [9], 10, 2)],
        ['empty intermediate page', page(2, [], 17, 3)],
        ['duplicate-only page', page(2, [8], 17, 3)],
    ])('marks the snapshot out of sync for a %s', async (_label, response) => {
        const api = vi.fn<ApiClient>()
            .mockResolvedValueOnce(page(1, [1, 2, 3, 4, 5, 6, 7, 8], response.meta.total === 10 ? 9 : 17, response.meta.last_page))
            .mockResolvedValueOnce(response);
        const { state, stop } = await mountComposable(api);

        await state.loadMore();
        expect(state.isOutOfSync.value).toBe(true);
        expect(state.currentPage.value).toBe(1);
        expect(state.items.value).toHaveLength(8);
        expect(state.isLoadingMore.value).toBe(false);
        stop();
    });

    it('treats an invalid response as terminal without appending data', async () => {
        const invalid = page(2, [9], 9, 2);
        invalid.meta.per_page = 20;
        const api = vi.fn<ApiClient>()
            .mockResolvedValueOnce(page(1, [1, 2, 3, 4, 5, 6, 7, 8], 9, 2))
            .mockResolvedValueOnce(invalid);
        const { state, stop } = await mountComposable(api);

        await state.loadMore();
        expect(state.loadMoreError.value).toMatchObject({ kind: 'contract', retryable: false });
        expect(state.items.value).toHaveLength(8);
        expect(state.hasMore.value).toBe(false);
        stop();
    });

    it('ignores stale success and finally after switching products', async () => {
        const stalePage = deferred<ProductReviewsResponse>();
        const refreshPage = deferred<ProductReviewsResponse>();
        const api = vi.fn<ApiClient>()
            .mockResolvedValueOnce(page(1, [1, 2, 3, 4, 5, 6, 7, 8], 9, 2))
            .mockImplementationOnce(() => stalePage.promise)
            .mockImplementationOnce(() => refreshPage.promise);
        const { state, productId, stop } = await mountComposable(api, ref(252));

        const staleRequest = state.loadMore();
        productId.value = 241;
        await nextTick();
        expect(state.isInitialLoading.value).toBe(true);

        stalePage.resolve(page(2, [9], 9, 2));
        await staleRequest;
        expect(state.items.value).toEqual([]);
        expect(state.isInitialLoading.value).toBe(true);

        refreshPage.resolve(page(1, [101], 1));
        await vi.waitFor(() => expect(state.isInitialLoading.value).toBe(false));
        expect(state.items.value.map(({ id }) => id)).toEqual([101]);
        expect(api.mock.calls[2][0]).toContain('/241/reviews');
        stop();
    });
});
