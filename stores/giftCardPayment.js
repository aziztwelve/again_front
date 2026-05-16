import { defineStore } from 'pinia';
import { ref } from 'vue';
import { GIFT_CERTIFICATE } from "~/constants/index.js";

export const useGiftCardPaymentStore = defineStore('giftCardPayment', () => {
    // ========================================
    // STATE
    // ========================================
    const giftCardCode = ref('');
    const giftCardData = ref(null);
    const giftCardBalance = ref(0);
    const giftCardAmount = ref(0);
    const giftCardMessage = ref('');
    const giftCardClass = ref('');

    // ========================================
    // ACTIONS
    // ========================================

    /**
     * Валидация подарочной карты
     */
    const validateGiftCard = async (code, cartItems, cartTotal) => {
        if (!code || code.length !== 12) {
            giftCardMessage.value = 'Код должен состоять из 12 символов';
            giftCardClass.value = 'error';
            return false;
        }

        // Проверяем, есть ли в корзине подарочный сертификат
        const hasGiftCertificate = cartItems.some(item => item.name === GIFT_CERTIFICATE);

        if (hasGiftCertificate) {
            giftCardMessage.value = 'Подарочные сертификаты нельзя оплачивать другими картами. Пожалуйста, используйте банковскую карту или СБП.';
            giftCardClass.value = 'error';
            return false;
        }

        try {
            const { data, error } = await useApi('/public/gift-cards/validate', {
                method: 'POST',
                body: { code: code.trim() }
            });

            if (error.value) {
                giftCardMessage.value = error.value.data?.message || 'Карта не найдена';
                giftCardClass.value = 'error';
                return false;
            }

            if (data.value && data.value.success) {
                giftCardCode.value = code.trim();
                giftCardData.value = data.value.data;
                giftCardBalance.value = parseFloat(data.value.data.balance);

                // Рассчитываем сколько спишется
                calculateGiftCardAmount(cartTotal);

                giftCardMessage.value = `Доступно: ${giftCardBalance.value} ₽`;
                giftCardClass.value = 'success';

                localStorage.setItem('giftCardCode', giftCardCode.value);

                return true;
            }
        } catch (err) {
            console.error('Gift card validation error:', err);
            giftCardMessage.value = 'Ошибка при проверке карты';
            giftCardClass.value = 'error';
            return false;
        }
    };

    /**
     * Рассчитать сколько спишется с карты
     */
    const calculateGiftCardAmount = (orderTotal) => {
        if (giftCardBalance.value >= orderTotal) {
            giftCardAmount.value = orderTotal;
        } else {
            giftCardAmount.value = giftCardBalance.value;
        }
    };

    /**
     * Удалить подарочную карту
     */
    const removeGiftCard = () => {
        giftCardCode.value = '';
        giftCardData.value = null;
        giftCardBalance.value = 0;
        giftCardAmount.value = 0;
        giftCardMessage.value = '';
        giftCardClass.value = '';

        localStorage.removeItem('giftCardCode');
    };

    /**
     * Получить итог к оплате с учётом карты
     */
    const getFinalTotal = (cartTotal) => {
        return Math.max(0, cartTotal - giftCardAmount.value);
    };

    /**
     * Очистка
     */
    const reset = () => {
        removeGiftCard();
    };

    return {
        // State
        giftCardCode,
        giftCardData,
        giftCardBalance,
        giftCardAmount,
        giftCardMessage,
        giftCardClass,

        // Actions
        validateGiftCard,
        calculateGiftCardAmount,
        removeGiftCard,
        getFinalTotal,
        reset
    };
});