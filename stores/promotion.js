import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * Стор акций на чекауте — мультиакционная (стекируемая) модель.
 *
 * Бэк (POST /public/promotions/check-applicable) возвращает уже ИТОГОВЫЙ набор
 * применённых акций (с учётом is_stackable + priority), поэтому фронт просто
 * рисует все акции из ответа, по одному блоку на акцию. У каждой акции клиент
 * выбирает ОДИН подарок из её gift_products (это альтернативы внутри акции) и
 * при необходимости цвет→размер; либо берёт «скидку вместо подарка», если акция
 * это разрешает.
 *
 * Состояние выбора хранится ПО КАЖДОЙ акции. Важно (дубли подарков разрешены):
 * один и тот же товар-подарок может прийти от двух разных акций, поэтому ключи
 * выбора варианта/цвета включают promotionId, а не только giftId — иначе выбор
 * для одной акции затёр бы выбор другой.
 */
export const usePromotionStore = defineStore('promotionStore', () => {
    // ========================================
    // STATE
    // ========================================

    // Итоговый набор применённых акций (как пришёл с бэка, отсортирован по priority desc)
    const appliedPromotions = ref([]);

    // Выбранный подарок по каждой акции: { [promotionId]: giftId }
    const selectedGiftByPromotionId = ref({});

    // Выбранный variant (размер) по ключу `${promotionId}:${giftId}`: { [key]: variantId }
    const selectedGiftVariantByKey = ref({});

    // Выбранный цвет по ключу `${promotionId}:${giftId}`: { [key]: colorId }
    const selectedGiftColorByKey = ref({});

    // Выбор пользователя по каждой акции: { [promotionId]: 'gift' | 'discount' }
    const userChoiceByPromotionId = ref({});

    // Флаг загрузки
    const isLoading = ref(false);

    // Сообщение для пользователя
    const message = ref('');
    const messageClass = ref('');

    // Счётчик запросов для защиты от race condition:
    // несколько checkApplicable() могут лететь параллельно (например, из cartInit
    // и из watch на странице). Применяем результат только самого последнего запроса,
    // чтобы устаревший ответ не затирал актуальный стейт (и не сбрасывал выбор подарка).
    let requestId = 0;

    // Ключ выбора варианта/цвета, привязанный к акции (дубли подарков — Q3).
    const keyOf = (promotionId, giftId) => `${promotionId}:${giftId}`;

    // ========================================
    // HELPERS (выбор по конкретной акции)
    // ========================================

    const giftProductsFor = (promotion) => promotion?.gift_products || [];

    const userChoiceFor = (promotionId) => userChoiceByPromotionId.value[promotionId] || 'gift';

    const useDiscountInsteadFor = (promotionId) => userChoiceFor(promotionId) === 'discount';

    const selectedGiftIdFor = (promotionId) => selectedGiftByPromotionId.value[promotionId] ?? null;

    const selectedGiftFor = (promotion) => {
        if (!promotion) return null;
        const giftId = selectedGiftByPromotionId.value[promotion.id];
        if (!giftId) return null;
        return giftProductsFor(promotion).find((g) => g.id === giftId) || null;
    };

    const selectedColorIdFor = (promotionId, giftId) =>
        selectedGiftColorByKey.value[keyOf(promotionId, giftId)] ?? null;

    const selectedVariantIdFor = (promotionId, giftId) =>
        selectedGiftVariantByKey.value[keyOf(promotionId, giftId)] ?? null;

    // Текущий выбранный объект варианта для подарка акции (или null)
    const selectedVariantFor = (promotion) => {
        const gift = selectedGiftFor(promotion);
        if (!gift) return null;
        const variantId = selectedVariantIdFor(promotion.id, gift.id);
        if (!variantId) return null;
        return (gift.variants || []).find((v) => v.id === variantId) || null;
    };

    // Нужно ли клиенту выбирать размер у выбранного подарка этой акции
    const needsVariantSelectionFor = (promotion) => {
        const gift = selectedGiftFor(promotion);
        if (!gift) return false;
        if (!gift.has_variants) return false;
        return (gift.variants || []).length > 0;
    };

    /**
     * Уникальные цвета для конкретного подарка (по самому подарку, без привязки к акции —
     * набор цветов у товара один и тот же). Возвращает массив { id, name, code } без дублей.
     */
    const uniqueColorsForGift = (gift) => {
        if (!gift?.variants) return [];
        const seen = new Set();
        const result = [];
        for (const v of gift.variants) {
            const color = v.color;
            if (!color) continue;
            if (!seen.has(color.id)) {
                seen.add(color.id);
                result.push({ id: color.id, name: color.name, code: color.code });
            }
        }
        return result;
    };

    const SIZE_ORDER = ['XXS', 'XS', 'S', 'S/M', 'M', 'M/L', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'XXXXXL'];

    const sortBySize = (variants) => {
        return [...variants].sort((a, b) => {
            const ai = SIZE_ORDER.indexOf((a.name || '').toUpperCase());
            const bi = SIZE_ORDER.indexOf((b.name || '').toUpperCase());
            // Известные размеры — по порядку, неизвестные — в конец по алфавиту
            if (ai === -1 && bi === -1) return (a.name || '').localeCompare(b.name || '');
            if (ai === -1) return 1;
            if (bi === -1) return -1;
            return ai - bi;
        });
    };

    /**
     * Варианты подарка для конкретной акции, отфильтрованные по выбранному цвету
     * и отсортированные по размеру. Если цвет не выбран — все варианты.
     */
    const variantsForGiftByColor = (promotionId, gift) => {
        if (!gift?.variants) return [];
        const colorId = selectedGiftColorByKey.value[keyOf(promotionId, gift.id)];
        const filtered = colorId
            ? gift.variants.filter((v) => v.color?.id === colorId)
            : gift.variants;
        return sortBySize(filtered);
    };

    // ========================================
    // COMPUTED
    // ========================================

    // Есть ли применённые акции
    const hasPromotion = computed(() => appliedPromotions.value.length > 0);

    // Разрешены ли промокоды — только если ВСЕ применённые акции их разрешают
    // (агрегированный вердикт, зеркалит серверную валидацию).
    const allowPromoCodes = computed(() => {
        if (appliedPromotions.value.length === 0) return true;
        return appliedPromotions.value.every((p) => !!p.allow_promo_codes);
    });

    // Акции, которые запрещают промокоды (для пояснения в UI промокода)
    const promoBlockingPromotions = computed(() =>
        appliedPromotions.value.filter((p) => !p.allow_promo_codes)
    );

    // Полностью ли заполнен выбор по ВСЕМ применённым акциям (готово к отправке)
    const isGiftSelectionComplete = computed(() => {
        if (appliedPromotions.value.length === 0) return true;
        return appliedPromotions.value.every((p) => {
            if (useDiscountInsteadFor(p.id)) return true;
            const gift = selectedGiftFor(p);
            if (!gift) return false;
            if (!gift.has_variants) return true;
            const variants = gift.variants || [];
            // Подарок с вариантами, но ни одного доступного — выбор невозможен,
            // блок просит выбрать другой подарок (см. UI).
            if (variants.length === 0) return false;
            return !!selectedVariantIdFor(p.id, gift.id);
        });
    });

    // ========================================
    // ACTIONS
    // ========================================

    /**
     * Пересобрать карты выбора под актуальный набор акций.
     * Сохраняет ранее сделанный валидный выбор (подарок/цвет/размер/режим),
     * сбрасывает устаревшее, автоселектит первый подарок/цвет/вариант там, где
     * выбора ещё нет. Акции, выпавшие из набора (упала сумма ниже порога),
     * просто не попадают в новые карты — их выбор очищается, остальные остаются.
     */
    const rebuildSelections = (promotions) => {
        const nextGift = {};
        const nextColor = {};
        const nextVariant = {};
        const nextChoice = {};

        for (const p of promotions) {
            const gifts = giftProductsFor(p);

            // Режим: сохраняем прошлый выбор; если акция запрещает промокоды —
            // принудительно «подарок» (скидку вместо подарка взять нельзя).
            let choice = userChoiceByPromotionId.value[p.id] || 'gift';
            if (!p.allow_promo_codes) choice = 'gift';
            nextChoice[p.id] = choice;

            if (choice === 'discount') {
                continue; // при скидке подарок не выбирается
            }

            // Подарок: сохраняем прошлый, если он всё ещё в наборе, иначе первый.
            const prevGiftId = selectedGiftByPromotionId.value[p.id];
            let gift = prevGiftId ? gifts.find((g) => g.id === prevGiftId) : null;
            if (!gift && gifts.length > 0) gift = gifts[0];
            if (!gift) continue;
            nextGift[p.id] = gift.id;

            if (gift.has_variants && Array.isArray(gift.variants) && gift.variants.length > 0) {
                const key = keyOf(p.id, gift.id);

                // Цвет: сохраняем валидный, иначе цвет первого варианта.
                let colorId = selectedGiftColorByKey.value[key];
                const colorValid = colorId && gift.variants.some((v) => v.color?.id === colorId);
                if (!colorValid) {
                    colorId = gift.variants[0]?.color?.id ?? null;
                }
                if (colorId) nextColor[key] = colorId;

                // Вариант: сохраняем валидный (и совпадающий с цветом), иначе первый по цвету.
                let variantId = selectedGiftVariantByKey.value[key];
                const variantValid = variantId
                    && gift.variants.some((v) => v.id === variantId && (!colorId || v.color?.id === colorId));
                if (!variantValid) {
                    const firstForColor = colorId
                        ? gift.variants.find((v) => v.color?.id === colorId)
                        : gift.variants[0];
                    variantId = firstForColor?.id ?? null;
                }
                if (variantId) nextVariant[key] = variantId;
            }
        }

        selectedGiftByPromotionId.value = nextGift;
        selectedGiftColorByKey.value = nextColor;
        selectedGiftVariantByKey.value = nextVariant;
        userChoiceByPromotionId.value = nextChoice;
    };

    /**
     * Проверить применимые акции для текущей корзины.
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
            const items = cartItems.map((item) => ({
                product_id: item.id,
                quantity: item.quantity ?? 1,
                price: item.selected_variant?.price ?? item.price,
            }));

            const { data, error } = await useApi('/public/promotions/check-applicable', {
                body: { items, total: cartTotal },
            }, '', 'POST');

            // Если в это время был запущен более свежий запрос — игнорируем этот ответ.
            if (myRequestId !== requestId) {
                return;
            }

            if (error.value) {
                console.error('Promotion check error:', error.value);
                reset();
                return;
            }

            if (data.value?.success && data.value.data?.length > 0) {
                appliedPromotions.value = data.value.data;
                rebuildSelections(data.value.data);
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
     * Выбрать подарок для конкретной акции.
     * Если у подарка есть варианты и для этой пары акция/подарок ещё ничего не
     * выбрано — авто-выбираем первый цвет и первый подходящий variant.
     */
    const selectGift = (promotionId, gift) => {
        userChoiceByPromotionId.value = {
            ...userChoiceByPromotionId.value,
            [promotionId]: 'gift',
        };

        if (!gift) return;

        selectedGiftByPromotionId.value = {
            ...selectedGiftByPromotionId.value,
            [promotionId]: gift.id,
        };

        if (gift.has_variants && Array.isArray(gift.variants) && gift.variants.length > 0) {
            const key = keyOf(promotionId, gift.id);

            // Авто-выбор цвета, если ещё не выбран
            if (!selectedGiftColorByKey.value[key]) {
                const firstColor = gift.variants[0]?.color;
                if (firstColor) {
                    selectedGiftColorByKey.value = {
                        ...selectedGiftColorByKey.value,
                        [key]: firstColor.id,
                    };
                }
            }

            // Авто-выбор варианта, если ещё не выбран или не подходит к цвету
            const colorId = selectedGiftColorByKey.value[key];
            const alreadyChosen = selectedGiftVariantByKey.value[key];
            const stillAvailable = alreadyChosen
                ? gift.variants.find((v) => v.id === alreadyChosen && (!colorId || v.color?.id === colorId))
                : null;

            if (!stillAvailable) {
                const firstForColor = colorId
                    ? gift.variants.find((v) => v.color?.id === colorId)
                    : gift.variants[0];
                if (firstForColor) {
                    selectedGiftVariantByKey.value = {
                        ...selectedGiftVariantByKey.value,
                        [key]: firstForColor.id,
                    };
                }
            }
        }
    };

    /**
     * Выбрать цвет подарка в рамках акции. Сбрасывает выбранный вариант,
     * если он не совпадает с новым цветом.
     */
    const selectGiftColor = (promotionId, gift, colorId) => {
        if (!gift) return;
        const key = keyOf(promotionId, gift.id);
        selectedGiftColorByKey.value = {
            ...selectedGiftColorByKey.value,
            [key]: colorId,
        };

        const currentVariantId = selectedGiftVariantByKey.value[key];
        if (currentVariantId) {
            const currentVariant = (gift.variants || []).find((v) => v.id === currentVariantId);
            if (!currentVariant || currentVariant.color?.id !== colorId) {
                const newMap = { ...selectedGiftVariantByKey.value };
                delete newMap[key];
                selectedGiftVariantByKey.value = newMap;
            }
        }
    };

    /**
     * Выбрать конкретный вариант (размер) подарка в рамках акции.
     */
    const selectGiftVariant = (promotionId, gift, variant) => {
        if (!gift || !variant) return;
        selectedGiftVariantByKey.value = {
            ...selectedGiftVariantByKey.value,
            [keyOf(promotionId, gift.id)]: variant.id,
        };
    };

    /**
     * Выбрать «скидку/промокод вместо подарка» для конкретной акции.
     * Недоступно, если акция запрещает промокоды.
     */
    const selectDiscount = (promotionId) => {
        const promotion = appliedPromotions.value.find((p) => p.id === promotionId);
        if (promotion && !promotion.allow_promo_codes) {
            message.value = 'Промокоды и скидки недоступны с этой акцией';
            messageClass.value = 'warning';
            return;
        }
        userChoiceByPromotionId.value = {
            ...userChoiceByPromotionId.value,
            [promotionId]: 'discount',
        };
        // Снимаем выбор подарка для этой акции
        const newGiftMap = { ...selectedGiftByPromotionId.value };
        delete newGiftMap[promotionId];
        selectedGiftByPromotionId.value = newGiftMap;
    };

    /**
     * Данные для отправки в заказ — массив акций promotions[].
     * По каждой применённой акции: либо «скидка вместо подарка», либо выбранный
     * подарок (+ вариант, если у подарка есть размеры).
     */
    const getDataForOrder = () => {
        const promotions = appliedPromotions.value.map((p) => {
            const useDiscount = useDiscountInsteadFor(p.id);
            const entry = {
                promotion_id: p.id,
                use_discount_instead: useDiscount,
            };

            if (!useDiscount) {
                const gift = selectedGiftFor(p);
                if (gift) {
                    entry.gift_product_id = gift.id;
                    if (gift.has_variants) {
                        const variant = selectedVariantFor(p);
                        if (variant) {
                            entry.gift_product_variant_id = variant.id;
                        }
                    }
                }
            }

            return entry;
        });

        return { promotions };
    };

    /**
     * Сброс состояния
     */
    const reset = () => {
        appliedPromotions.value = [];
        selectedGiftByPromotionId.value = {};
        selectedGiftVariantByKey.value = {};
        selectedGiftColorByKey.value = {};
        userChoiceByPromotionId.value = {};
        message.value = '';
        messageClass.value = '';
    };

    return {
        // State
        appliedPromotions,
        selectedGiftByPromotionId,
        selectedGiftVariantByKey,
        selectedGiftColorByKey,
        userChoiceByPromotionId,
        isLoading,
        message,
        messageClass,

        // Computed
        hasPromotion,
        allowPromoCodes,
        promoBlockingPromotions,
        isGiftSelectionComplete,

        // Helpers (per-promotion)
        giftProductsFor,
        userChoiceFor,
        useDiscountInsteadFor,
        selectedGiftIdFor,
        selectedGiftFor,
        selectedColorIdFor,
        selectedVariantIdFor,
        selectedVariantFor,
        needsVariantSelectionFor,
        uniqueColorsForGift,
        variantsForGiftByColor,

        // Actions
        checkApplicable,
        selectGift,
        selectGiftColor,
        selectGiftVariant,
        selectDiscount,
        getDataForOrder,
        reset,
    };
});
