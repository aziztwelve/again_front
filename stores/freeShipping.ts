import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

/**
 * Бесплатная доставка на витрине.
 * Бэкенд: POST /api/public/delivery/free-shipping/evaluate
 * Спека: lara_admin/docs/tasks/free-shipping.md
 *
 * Ответ бэка — источник правды для показа «Бесплатно». Итоговая стоимость
 * доставки в заказе всё равно считается на сервере при создании заказа.
 */

export interface FreeShippingRuleInfo {
    id: number;
    name: string;
    min_order_amount: number;
    qualifying_amount: number;
}

export interface FreeShippingCandidateInput {
    key: string;
    service: 'cdek' | 'yandex';
    delivery_type: 'pickup' | 'courier';
    price: number;
}

export interface FreeShippingCandidateResult {
    key: string | null;
    service: string | null;
    delivery_type: string | null;
    is_free: boolean;
    price: number;
    original_price: number;
    rule: FreeShippingRuleInfo | null;
}

export interface FreeShippingProgress {
    rule_id: number;
    rule_name: string;
    min_order_amount: number;
    qualifying_amount: number;
    remaining: number;
}

interface EvaluateParams {
    items: Array<{ product_id: number; product_variant_id?: number | null; quantity: number }>;
    candidates?: FreeShippingCandidateInput[];
    paymentMethod?: string | null;
    promoCode?: string | null;
    countryId?: number | null;
    cityId?: number | null;
    country?: string | null;
    region?: string | null;
    city?: string | null;
}

export const useFreeShippingStore = defineStore('freeShipping', () => {
    const results = ref<Record<string, FreeShippingCandidateResult>>({});
    const progress = ref<FreeShippingProgress | null>(null);
    const qualifyingAmount = ref(0);
    const loading = ref(false);

    /** Выбранный покупателем вариант доставки — для строки «Доставка» в итогах. */
    const selectedKey = ref<string | null>(null);
    const selectedPrice = ref<number | null>(null);

    const isFree = (key: string): boolean => results.value[key]?.is_free === true;

    const ruleFor = (key: string): FreeShippingRuleInfo | null => results.value[key]?.rule ?? null;

    const selectedIsFree = computed(() =>
        selectedKey.value !== null && isFree(selectedKey.value),
    );

    /** NULL — доставка ещё не выбрана (строку в итогах не показываем). */
    const deliveryCost = computed<number | null>(() => {
        if (selectedKey.value === null) return null;
        if (selectedIsFree.value) return 0;
        return selectedPrice.value ?? null;
    });

    const setSelected = (key: string | null, price: number | null = null) => {
        selectedKey.value = key;
        selectedPrice.value = price;
    };

    const reset = () => {
        results.value = {};
        progress.value = null;
        qualifyingAmount.value = 0;
        setSelected(null, null);
    };

    const evaluate = async (params: EvaluateParams): Promise<void> => {
        const items = (params.items ?? []).filter((item) => item?.product_id && item.quantity);

        if (!items.length) {
            reset();
            return;
        }

        loading.value = true;

        try {
            const apiFetch = useApiClient();
            const response = await apiFetch<{
                success: boolean;
                qualifying_amount: number;
                candidates: FreeShippingCandidateResult[];
                progress: FreeShippingProgress | null;
            }>('/public/delivery/free-shipping/evaluate', {
                method: 'POST',
                body: {
                    items: items.map((item) => ({
                        product_id: item.product_id,
                        product_variant_id: item.product_variant_id ?? null,
                        quantity: item.quantity,
                    })),
                    candidates: params.candidates ?? [],
                    payment_method: params.paymentMethod || null,
                    promo_code: params.promoCode || null,
                    country_id: params.countryId ?? null,
                    city_id: params.cityId ?? null,
                    country: params.country || null,
                    region: params.region || null,
                    city: params.city || null,
                },
            });

            const next: Record<string, FreeShippingCandidateResult> = {};
            (response.candidates ?? []).forEach((candidate) => {
                if (candidate.key) next[candidate.key] = candidate;
            });

            results.value = next;
            progress.value = response.progress ?? null;
            qualifyingAmount.value = response.qualifying_amount ?? 0;
        } catch (e) {
            // Оценка — не критичный запрос: при ошибке просто не показываем
            // «Бесплатно» и подсказку, чекаут продолжает работать.
            results.value = {};
            progress.value = null;
        } finally {
            loading.value = false;
        }
    };

    return {
        results,
        progress,
        qualifyingAmount,
        loading,
        selectedKey,
        selectedPrice,
        selectedIsFree,
        deliveryCost,
        isFree,
        ruleFor,
        setSelected,
        evaluate,
        reset,
    };
});
