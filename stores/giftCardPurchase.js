import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { GIFT_CERTIFICATE } from "~/constants/index.js";

export const useGiftCardPurchaseStore = defineStore('giftCardPurchase', () => {
    // ========================================
    // STATE
    // ========================================
    const purchaseData = ref({
        type: 'electronic',
        recipient_type: 'self',
        sender_name: '',
        sender_email: '',
        sender_phone: '',
        recipient_name: '',
        recipient_email: '',
        recipient_phone: '',
        message: '',
        delivery_channel: 'email',
        delivery_type: 'immediate',
        scheduled_date: '',
        scheduled_time: '',
        timezone: 'Europe/Moscow'
    });

    // ========================================
    // ACTIONS
    // ========================================

    /**
     * Обновить поле
     */
    const updateField = (field, value) => {
        purchaseData.value[field] = value;
        localStorage.setItem('giftCardPurchaseData', JSON.stringify(purchaseData.value));
    };

    /**
     * Сброс
     */
    const reset = () => {
        purchaseData.value = {
            type: 'electronic',
            recipient_type: 'self',
            sender_name: '',
            sender_email: '',
            sender_phone: '',
            recipient_name: '',
            recipient_email: '',
            recipient_phone: '',
            message: '',
            delivery_channel: 'email',
            delivery_type: 'immediate',
            scheduled_date: '',
            scheduled_time: '',
            timezone: 'Europe/Moscow'
        };
        localStorage.removeItem('giftCardPurchaseData');
    };

    /**
     * Валидация
     */
    const validate = () => {
        const errors = [];
        const data = purchaseData.value;

        if (!data.sender_name || data.sender_name.trim().length < 2) {
            errors.push('Укажите ваше имя (от кого)');
        }

        if (data.recipient_type === 'someone') {
            if (!data.recipient_name || data.recipient_name.trim().length < 2) {
                errors.push('Укажите имя получателя');
            }

            if (data.delivery_channel === 'email') {
                if (!data.recipient_email || !isValidEmail(data.recipient_email)) {
                    errors.push('Укажите корректный email получателя');
                }
            }

            if (data.delivery_channel === 'telegram') {
                if (!data.recipient_phone || data.recipient_phone.trim().length < 10) {
                    errors.push('Укажите телефон получателя');
                }
            }
        }

        if (data.delivery_type === 'scheduled') {
            if (!data.scheduled_date) errors.push('Укажите дату отправки');
            if (!data.scheduled_time) errors.push('Укажите время отправки');
        }

        if (data.message && data.message.length > 500) {
            errors.push('Сообщение не должно превышать 500 символов');
        }

        return { valid: errors.length === 0, errors };
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    /**
     * Получить данные для API
     */
    const getDataForAPI = (userEmail, userPhone) => {
        const data = purchaseData.value;

        return {
            type: data.type,
            recipient_type: data.recipient_type,
            sender_name: data.sender_name,
            sender_email: data.sender_email || userEmail || '',
            sender_phone: data.sender_phone || userPhone || '',
            recipient_name: data.recipient_type === 'self' ? data.sender_name : data.recipient_name,
            recipient_email: data.recipient_type === 'self' ? userEmail : data.recipient_email,
            recipient_phone: data.recipient_type === 'self' ? userPhone : data.recipient_phone,
            message: data.message,
            delivery_channel: data.delivery_channel,
            delivery_type: data.delivery_type,
            scheduled_date: data.scheduled_date,
            scheduled_time: data.scheduled_time,
            timezone: data.timezone
        };
    };

    /**
     * Загрузить из localStorage
     */
    const loadFromStorage = () => {
        const saved = localStorage.getItem('giftCardPurchaseData');
        if (saved) {
            try {
                purchaseData.value = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load:', e);
            }
        }
    };

    return {
        purchaseData,
        updateField,
        reset,
        validate,
        getDataForAPI,
        loadFromStorage
    };
});