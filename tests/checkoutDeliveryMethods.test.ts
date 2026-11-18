import { describe, expect, it } from 'vitest';
import { availableCheckoutDeliveryMethods, isRussia } from '../utils/checkoutDeliveryMethods';

const methods = [
    { id: 15, name: 'Курьером Яндекс.Доставки', delivery_type_code: 'yandex_courier' },
    { id: 3, name: 'СДЭК: Курьерская доставка', delivery_type_code: 'cdek_courier' },
    { id: 14, name: 'Пункт самовывоза Яндекс.Доставки', delivery_type_code: 'yandex_pickup' },
    { id: 1, name: 'Пункт выдачи СДЭК', delivery_type_code: 'cdek_pickup' },
    { id: 19, name: 'Постамат СДЭК', delivery_type_code: 'cdek_postamat' },
    { id: 7, name: 'Почта России', delivery_type_code: 'russian_post' },
];

const codes = (list: Array<{ delivery_type_code?: string }>) => list.map((m) => m.delivery_type_code);

describe('availableCheckoutDeliveryMethods', () => {
    it('offers Yandex and CDEK in checkout order for Russia', () => {
        expect(codes(availableCheckoutDeliveryMethods(methods, 'RU'))).toEqual([
            'cdek_pickup', 'cdek_courier', 'cdek_postamat', 'yandex_pickup', 'yandex_courier',
        ]);
    });

    it('treats an empty country as Russia (the default in checkout)', () => {
        expect(codes(availableCheckoutDeliveryMethods(methods, ''))).toContain('yandex_courier');
        expect(codes(availableCheckoutDeliveryMethods(methods, null))).toContain('yandex_pickup');
        expect(codes(availableCheckoutDeliveryMethods(methods, undefined))).toContain('yandex_pickup');
    });

    it.each(['EE', 'BY', 'KZ', 'KG'])('hides Yandex but keeps CDEK for %s', (country) => {
        expect(codes(availableCheckoutDeliveryMethods(methods, country))).toEqual([
            'cdek_pickup', 'cdek_courier', 'cdek_postamat',
        ]);
    });

    it('drops methods that are not offered in checkout at all', () => {
        expect(codes(availableCheckoutDeliveryMethods(methods, 'RU'))).not.toContain('russian_post');
    });

    it('reads the plain code when delivery_type_code is missing', () => {
        const list = availableCheckoutDeliveryMethods([{ code: 'yandex_courier' }, { code: 'cdek_pickup' }], 'EE');
        expect(list).toEqual([{ code: 'cdek_pickup' }]);
    });

    it('does not fail on a missing list', () => {
        expect(availableCheckoutDeliveryMethods(undefined, 'EE')).toEqual([]);
        expect(availableCheckoutDeliveryMethods(null, 'RU')).toEqual([]);
    });
});

describe('isRussia', () => {
    it('is true only for RU or an empty country', () => {
        expect(isRussia('RU')).toBe(true);
        expect(isRussia('')).toBe(true);
        expect(isRussia(undefined)).toBe(true);
        expect(isRussia('EE')).toBe(false);
    });
});
