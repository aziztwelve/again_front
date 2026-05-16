import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePromotionStore = defineStore('promotionStore', () => {
    // ========================================
    // STATE
    // ========================================

    // Текущая применимая акция (самая приоритетная)
    const activePromotion = ref(null);

    // Все применимые акции
    const applicablePromotions = ref([]);

    // Выбранный подарок (product из gift_products)
    const selectedGift = ref(null);

    // Выбранный variant подарка (если у подарка есть размер/цвет и т.п.)
    // Хранится в формате { giftId: variantId } — чтобы переключение между подарками
    // не сбрасывало ранее сделанный выбор размера для другого подарка.
    const selectedGiftVariantByGiftId = ref({});

    // Выбор пользователя: 'gift' или 'discount'
    const userChoice = ref('gift');

    // Флаг загрузки
    const isLoading = ref(false);

    // Сообщение для пользователя
    const message = ref('');
    const messageClass = ref('');

    // Счётчик запросов для защиты от race condition:
    // несколько checkApplicable() могут лететь параллельно (например, из app.vue::cartInit
    // и из watch на странице). Применяем результат только самого последнего запроса,
    // чтобы устаревший ответ не затирал актуальный стейт (и не сбрасывал выбранный подарок).
    let requestId = 0;

    // ========================================
    // COMPUTED
    // ========================================

    // Есть ли активная акция
    const hasPromotion = computed(() => !!activePromotion.value);

    // Разрешены ли промокоды с этой акцией
    const allowPromoCodes = computed(() => {
        if (!activePromotion.value) return true;
        return !!activePromotion.value.allow_promo_codes;
    });

    // Список подарков из акции
    const giftProducts = computed(() => {
        if (!activePromotion.value) return [];
        return activePromotion.value.gift_products || [];
    });

    // Пользователь выбрал скидку/промокод вместо подарка
    const useDiscountInstead = computed(() => {
        return userChoice.value === 'discount';
    });

    // Текущий выбранный variant для активного подарка (объект варианта или null)
    const selectedGiftVariant = computed(() => {
        if (!selectedGift.value) return null;
        const variantId = selectedGiftVariantByGiftId.value[selectedGift.value.id];
        if (!variantId) return null;
        const variants = selectedGift.value.variants || [];
        return variants.find((v) => v.id === variantId) || null;
    });

    // Нужно ли клиенту выбирать размер у текущего подарка
    const needsVariantSelection = computed(() => {
        if (!selectedGift.value) return false;
        if (!selectedGift.value.has_variants) return false;
        const variants = selectedGift.value.variants || [];
        return variants.length > 0;
    });

    // Полностью ли заполнен выбор подарка (готов к отправке)
    const isGiftSelectionComplete = computed(() => {
        if (!activePromotion.value) return true;
        if (useDiscountInstead.value) return true;
        if (!selectedGift.value) return false;
        if (!needsVariantSelection.value) return true;
        return !!selectedGiftVariant.value;
    });

    // ========================================
    // ACTIONS
    // ========================================

    /**
     * Проверить применимые акции для текущей корзины
     */
    const checkApplicable = async (cartItems, cartTotal) => {
        if (!cartItems || cartItems.length === 0) {
            // Сбрасываем все «в полёте» запросы, чтобы их ответы не применились.
            requestId += 1;
            reset();
            return;
        }

        const myRequestId = ++requestId;
        isLoading.value = true;

        try {
            const items = cartItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity ?? 1,
                price: item.selected_variant?.price ?? item.price,
            }));

            console.log('[Promotion] checkApplicable items:', JSON.stringify(items), 'total:', cartTotal);

            const { data, error } = await useApi('/public/promotions/check-applicable', {
                body: { items, total: cartTotal },
            }, '', 'POST');

            console.log('[Promotion] response data:', JSON.stringify(data.value), 'error:', error.value);

            // Если в это время был запущен более свежий запрос — игнорируем этот ответ,
            // иначе устаревший ответ может затереть актуальный стейт (бывший баг с пропадающим подарком).
            if (myRequestId !== requestId) {
                return;
            }

            if (error.value) {
                console.error('Promotion check error:', error.value);
                reset();
                return;
            }

            if (data.value?.success && data.value.data?.length > 0) {
                applicablePromotions.value = data.value.data;
                // Берём самую приоритетную (первую, т.к. бек сортирует по priority desc)
                activePromotion.value = data.value.data[0];

                // Автоматически выбираем первый подарок, только если ещё ничего не выбрано
                // или ранее выбранного подарка больше нет в новом списке.
                const giftProductsList = activePromotion.value.gift_products || [];
                const stillAvailable = selectedGift.value
                    ? giftProductsList.find((g) => g.id === selectedGift.value.id)
                    : null;
                if (stillAvailable) {
                    selectedGift.value = stillAvailable;
                } else if (giftProductsList.length > 0) {
                    selectedGift.value = giftProductsList[0];
                }

                // Подчищаем устаревшие выборы variant'ов для подарков, которых уже нет в акции,
                // и переоцениваем выбор размера для текущего подарка (если variant больше не доступен).
                const validGiftIds = new Set(giftProductsList.map((g) => g.id));
                const cleanedVariantMap = {};
                for (const [giftId, variantId] of Object.entries(selectedGiftVariantByGiftId.value)) {
                    const numericGiftId = Number(giftId);
                    if (!validGiftIds.has(numericGiftId)) continue;
                    const giftDef = giftProductsList.find((g) => g.id === numericGiftId);
                    const variants = giftDef?.variants || [];
                    if (variants.find((v) => v.id === variantId)) {
                        cleanedVariantMap[giftId] = variantId;
                    }
                }
                selectedGiftVariantByGiftId.value = cleanedVariantMap;

                // Автовыбор первого доступного variant'а для активного подарка, если выбора ещё нет
                if (selectedGift.value
                    && selectedGift.value.has_variants
                    && Array.isArray(selectedGift.value.variants)
                    && selectedGift.value.variants.length > 0
                    && !selectedGiftVariantByGiftId.value[selectedGift.value.id]) {
                    selectedGiftVariantByGiftId.value = {
                        ...selectedGiftVariantByGiftId.value,
                        [selectedGift.value.id]: selectedGift.value.variants[0].id,
                    };
                }

                // Если промокоды не разрешены — принудительно выбираем подарок
                if (!activePromotion.value.allow_promo_codes) {
                    userChoice.value = 'gift';
                }

                message.value = '';
                messageClass.value = '';
            } else {
                reset();
            }
        } catch (err) {
            console.error('Promotion check failed:', err);
            if (myRequestId === requestId) {
                reset();
            }
        } finally {
            if (myRequestId === requestId) {
                isLoading.value = false;
            }
        }
    };

    /**
     * Выбрать подарок.
     * Если у подарка есть варианты (размер/цвет) и ещё ничего не выбрано
     * для этого подарка — авто-выбираем первый доступный variant, чтобы UI
     * сразу был в валидном состоянии.
     */
    const selectGift = (gift) => {
        selectedGift.value = gift;
        userChoice.value = 'gift';

        if (!gift) return;

        if (gift.has_variants && Array.isArray(gift.variants) && gift.variants.length > 0) {
            const alreadyChosen = selectedGiftVariantByGiftId.value[gift.id];
            const stillAvailable = alreadyChosen
                ? gift.variants.find((v) => v.id === alreadyChosen)
                : null;

            if (!stillAvailable) {
                // Авто-выбор первого доступного variant'а
                selectedGiftVariantByGiftId.value = {
                    ...selectedGiftVariantByGiftId.value,
                    [gift.id]: gift.variants[0].id,
                };
            }
        }
    };

    /**
     * Выбрать конкретный вариант (размер/цвет) для текущего подарка
     */
    const selectGiftVariant = (variant) => {
        if (!selectedGift.value || !variant) return;
        selectedGiftVariantByGiftId.value = {
            ...selectedGiftVariantByGiftId.value,
            [selectedGift.value.id]: variant.id,
        };
    };

    /**
     * Выбрать скидку/промокод вместо подарка
     */
    const selectDiscount = () => {
        if (!allowPromoCodes.value) {
            message.value = 'Промокоды и скидки недоступны с этой акцией';
            messageClass.value = 'warning';
            return;
        }
        userChoice.value = 'discount';
        selectedGift.value = null;
    };

    /**
     * Получить данные для отправки в заказ
     */
    const getDataForOrder = () => {
        if (!activePromotion.value) return {};

        const data = {
            promotion_id: activePromotion.value.id,
            use_discount_instead: useDiscountInstead.value,
        };

        if (!useDiscountInstead.value && selectedGift.value) {
            data.gift_product_id = selectedGift.value.id;

            // Если у подарка есть варианты — отправляем выбранный variant
            if (selectedGift.value.has_variants && selectedGiftVariant.value) {
                data.gift_product_variant_id = selectedGiftVariant.value.id;
            }
        }

        return data;
    };

    /**
     * Сброс состояния
     */
    const reset = () => {
        activePromotion.value = null;
        applicablePromotions.value = [];
        selectedGift.value = null;
        selectedGiftVariantByGiftId.value = {};
        userChoice.value = 'gift';
        message.value = '';
        messageClass.value = '';
    };

    return {
        // State
        activePromotion,
        applicablePromotions,
        selectedGift,
        selectedGiftVariantByGiftId,
        userChoice,
        isLoading,
        message,
        messageClass,

        // Computed
        hasPromotion,
        allowPromoCodes,
        giftProducts,
        useDiscountInstead,
        selectedGiftVariant,
        needsVariantSelection,
        isGiftSelectionComplete,

        // Actions
        checkApplicable,
        selectGift,
        selectGiftVariant,
        selectDiscount,
        getDataForOrder,
        reset,
    };
});
