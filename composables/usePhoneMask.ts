// composables/usePhoneMask.ts

import type { Country } from '~/types/countries';

/**
 * Композабл для работы с масками телефонных номеров
 */
export const usePhoneMask = () => {
    /**
     * Генерирует маску для v-mask на основе данных страны
     * @param phoneCode - код страны (+7, +1, +374 и т.д.)
     * @param phoneLength - количество цифр номера
     * @returns строка маски для v-mask
     */
    const generateMask = (phoneCode: string, phoneLength: number): string => {
        // Создаем маску из # символов
        const digitMask = '#'.repeat(phoneLength);

        // Форматируем маску в зависимости от длины
        let formattedMask = '';

        switch (phoneLength) {
            case 10:
                // Формат: +7 (###) ###-##-##
                formattedMask = `${phoneCode} (${digitMask.slice(0, 3)}) ${digitMask.slice(3, 6)}-${digitMask.slice(6, 8)}-${digitMask.slice(8, 10)}`;
                break;
            case 9:
                // Формат: +375 (##) ###-##-##
                formattedMask = `${phoneCode} (${digitMask.slice(0, 2)}) ${digitMask.slice(2, 5)}-${digitMask.slice(5, 7)}-${digitMask.slice(7, 9)}`;
                break;
            case 11:
                // Формат: +55 (##) ####-####
                formattedMask = `${phoneCode} (${digitMask.slice(0, 2)}) ${digitMask.slice(2, 6)}-${digitMask.slice(6, 10)}`;
                break;
            case 8:
                // Формат: +374 ## ###-###
                formattedMask = `${phoneCode} ${digitMask.slice(0, 2)} ${digitMask.slice(2, 5)}-${digitMask.slice(5, 8)}`;
                break;
            case 7:
                // Формат: +423 ### ####
                formattedMask = `${phoneCode} ${digitMask.slice(0, 3)} ${digitMask.slice(3, 7)}`;
                break;
            default:
                // Универсальный формат для остальных
                formattedMask = `${phoneCode} ${digitMask}`;
        }

        return formattedMask;
    };

    /**
     * Валидация длины номера телефона
     * @param phone - номер телефона
     * @param phoneCode - код страны (+7, +1 и т.д.)
     * @param expectedLength - ожидаемая длина БЕЗ кода страны
     * @returns true если длина корректна
     */
    const validatePhoneLength = (phone: string, phoneCode: string, expectedLength: number): boolean => {
        // Удаляем код страны и все нечисловые символы
        const phoneWithoutCode = phone.replace(phoneCode, '').trim();
        const digitsOnly = phoneWithoutCode.replace(/\D/g, '');
        // Если цифр ровно столько сколько нужно — ок
        if (digitsOnly.length === expectedLength) return true;
        // Допускаем также полный номер с кодом страны (например 11 цифр для +7)
        const allDigits = phone.replace(/\D/g, '');
        const codeDigits = phoneCode.replace(/\D/g, '');
        if (allDigits.length === expectedLength + codeDigits.length) return true;
        return false;
    };

    /**
     * Очистка номера телефона от маски (оставляем только цифры и +)
     * @param phone - номер с маской
     * @returns чистый номер
     */
    const cleanPhone = (phone: string): string => {
        return phone.replace(/[^\d+]/g, '');
    };

    return {
        generateMask,
        validatePhoneLength,
        cleanPhone
    };
};