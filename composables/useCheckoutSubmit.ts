import type { Country } from '~/types/countries';
import type { CheckoutForm, CheckoutPayload, CheckoutResult } from '~/types/order';

/**
 * Композабл с логикой submit'а чекаута: клиентская валидация формы,
 * сборка payload'а и POST на `/api/public/orders` (единый endpoint и для
 * гостя, и для авторизованного клиента — см. docs/tasks/guest-checkout.md).
 *
 * Страница `pages/checkout/index.vue` отвечает только за вёрстку и связку
 * v-model'ов; сюда же вынесены сообщения об ошибках и нормализация ответа
 * от бэка.
 */
export interface CheckoutSubmitDeps {
    form: CheckoutForm;
    /** Получает текущую страну из CheckoutRecipient для проверки длины номера. */
    getSelectedCountry: () => Country | null;
    /** Сетает ошибку телефона в CheckoutRecipient. */
    setPhoneError: (msg: string) => void;
    /** DOM-узел блока «Получатель» — чтобы доскроллить к ошибке телефона. */
    getRecipientEl: () => HTMLElement | null;
    /** Валидация модалки данных подарочной карты (если в корзине есть сертификат). */
    validateGiftCardData: () => boolean;
    /** DOM-узел блока «Подарочная карта» — для прокрутки. */
    getGiftCardDataEl: () => HTMLElement | null;
}

export function useCheckoutSubmit(deps: CheckoutSubmitDeps) {
    // cartStore.setEmptyCart() уже сбрасывает promotion и giftCard stores —
    // здесь импортируем только то, что нужно для сборки payload'а.
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const giftCardPurchaseStore = useGiftCardPurchaseStore();
    const promotionStore = usePromotionStore();

    // Локальный shape для авторизованного клиента — в `stores/auth.js` сам ref
    // объявлен без явного типа, и тут нам важны только два поля.
    type AuthUser = {
        email?: string | null;
        profile?: { phone?: string | null } | null;
    };
    const authUser = () => authStore.user as AuthUser | null | undefined;

    const isLoading = ref(false);
    const submitError = ref('');

    const scrollTo = async (selector: string) => {
        await nextTick();
        document
            .querySelector(selector)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const showError = async (msg: string) => {
        submitError.value = msg;
        await scrollTo('.checkout__submit-error');
    };

    // Склеивает список отсутствующих полей в человеко-читаемую фразу:
    //   ['адрес доставки']                    → 'Заполните адрес доставки'
    //   ['страну', 'адрес доставки']          → 'Заполните страну и адрес доставки'
    //   ['страну', 'город', 'адрес доставки'] → 'Заполните страну, город и адрес доставки'
    const joinMissing = (parts: string[]): string => {
        if (parts.length <= 1) return `Заполните ${parts[0] ?? ''}`.trim();
        const head = parts.slice(0, -1).join(', ');
        const tail = parts[parts.length - 1];
        return `Заполните ${head} и ${tail}`;
    };

    const validatePhone = (): boolean => {
        const country = deps.getSelectedCountry();
        const { form } = deps;

        if (!country || !form.user.phone) return true;

        const { validatePhoneLength } = usePhoneMask();
        const ok = validatePhoneLength(
            form.user.phone,
            country.phone_code,
            country.phone_length,
        );
        if (!ok) {
            deps.setPhoneError(`Номер должен содержать ${country.phone_length} цифр`);
            deps.getRecipientEl()?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }
        deps.setPhoneError('');
        return true;
    };

    const validateRequired = async (): Promise<boolean> => {
        const { form } = deps;
        const missing: string[] = [];
        if (!form.country_name) missing.push('страну');
        if (!form.city_name) missing.push('город');
        if (!form.delivery_address) missing.push('адрес доставки');
        if (!form.user.first_name) missing.push('имя');
        if (!form.user.last_name) missing.push('фамилию');
        if (!form.user.phone) missing.push('телефон');
        if (missing.length) {
            await showError(joinMissing(missing));
            return false;
        }
        return true;
    };

    /** Собирает delivery_address без пустых значений. */
    const buildDeliveryAddress = (): Record<string, unknown> => {
        const { form } = deps;
        const addr: Record<string, unknown> = {
            country: form.country_name,
            city: form.city_name,
            address: form.delivery_address,
        };
        if (form.region) addr.region = form.region;
        if (form.postal_code) addr.postal_code = form.postal_code;
        if (form.entrance) addr.entrance = form.entrance;
        if (form.floor) addr.floor = form.floor;
        if (form.intercom) addr.intercom = form.intercom;
        if (form.delivery_date) addr.delivery_date = form.delivery_date;
        if (form.buyer_comment) addr.buyer_comment = form.buyer_comment;
        return addr;
    };

    /** Финальный payload для POST /public/orders. */
    const buildPayload = (): CheckoutPayload => {
        const { form } = deps;
        const payload: CheckoutPayload = {
            promo_code: form.promo_code || undefined,
            gift_card_code: form.gift_card_code || undefined,
            items: cartStore.getCartForCheckout(),
            // Контактные данные «заказчика» и «получателя» сейчас совпадают —
            // оставляем оба ключа, чтобы бэк собрал и order.email, и
            // order_addresses.recipient_* за один проход.
            user: { ...form.user },
            recipient: { ...form.user },
            delivery_address: buildDeliveryAddress(),
        };

        if (form.payment_method) {
            payload.payment_method = form.payment_method;
        }
        if (form.delivery_method_name) {
            payload.delivery_method = { name: form.delivery_method_name };
        }

        // Сертификат — собираем данные для отправки получателю.
        // Для гостя fallback'ом используем email/телефон из самой формы:
        // у неавторизованного покупателя нет authStore.user.
        if (cartStore.hasGiftCertificateInCart) {
            const u = authUser();
            payload.gift_card_data = giftCardPurchaseStore.getDataForAPI(
                u?.email || form.user.email,
                u?.profile?.phone || form.user.phone,
            );
        }

        // Акция (если активна). Поведение должно соответствовать тому,
        // что было в pages/checkout/index.vue до рефактора.
        if (promotionStore.hasPromotion) {
            const promotionData = promotionStore.getDataForOrder();
            Object.assign(payload, promotionData);

            if (!promotionStore.useDiscountInstead) {
                delete payload.promo_code;
            }
        }

        return payload;
    };

    /** Парсит ответ бэка в человеко-читаемое сообщение. */
    const extractErrorMessage = (errPayload: any, fallback: string): string => {
        if (errPayload?.errors && typeof errPayload.errors === 'object') {
            const messages = Object.values(errPayload.errors).flat() as string[];
            if (messages.length && messages[0]) return messages[0];
        }
        if (errPayload?.message) return errPayload.message;
        return fallback;
    };

    /**
     * Главная функция. Возвращает результат, чтобы вызывающая сторона решила,
     * куда вести юзера (как правило — это `/orders/{view_token}`).
     */
    const submit = async (): Promise<CheckoutResult> => {
        submitError.value = '';

        // 1. Данные сертификата (если он в корзине)
        if (cartStore.hasGiftCertificateInCart) {
            if (!deps.validateGiftCardData()) {
                deps.getGiftCardDataEl()?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
                return { success: false };
            }
        }

        // 2. Телефон
        if (!validatePhone()) return { success: false };

        // 3. Обязательные поля
        if (!await validateRequired()) return { success: false };

        // 4. Акция: если есть подарки с вариантами — должны быть выбраны
        if (promotionStore.hasPromotion && !promotionStore.isGiftSelectionComplete) {
            await showError('Пожалуйста, выберите вариант для подарка по акции');
            await scrollTo('.cart__promotion');
            return { success: false };
        }

        // 5. Освежим цены в корзине перед оформлением — на случай если юзер
        // долго сидел на /checkout и за это время на бэке поменялась скидка.
        // Если цена реально изменилась, показываем ошибку и просим клиента
        // пересмотреть итог. Сервер также толерантен к «лишней» цене,
        // но мы хотим, чтобы юзер увидел реальную сумму ДО клика.
        await cartStore.refreshPrices();

        // 6. POST на единый публичный endpoint /public/orders.
        isLoading.value = true;
        const body = buildPayload();
        const { data, error } = await useApi<{ success: boolean; order: { id: number; view_token: string } }>(
            '/public/orders',
            { body },
            '',
            'POST',
        );
        isLoading.value = false;

        if (data.value?.success === true) {
            // setEmptyCart внутри уже чистит promotion + giftCardPayment + giftCardPurchase.
            cartStore.setEmptyCart();
            return {
                success: true,
                viewToken: data.value.order?.view_token ?? null,
                orderId: data.value.order?.id ?? null,
            };
        }

        const payload: any = (error.value as any)?.data ?? data.value;
        const message = extractErrorMessage(payload, 'Не удалось оформить заказ');
        await showError(message);
        if (process.dev) console.error('Order error:', error.value ?? data.value);
        return { success: false, error: message };
    };

    return {
        isLoading,
        submitError,
        showError,
        submit,
    };
}
