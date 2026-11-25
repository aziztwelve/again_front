/**
 * Способы доставки, которые показывает чекаут, с учётом выбранной страны.
 *
 * Яндекс.Доставка возит только по России: для других стран она отвечает отказом
 * (`no_delivery_options`), а заказ с ней сохранялся бы без тарифа и с доставкой 0 ₽
 * (заказ 41484, Эстония). СДЭК ездит и в Беларусь, Казахстан, Киргизию, поэтому его способы
 * остаются для любой страны.
 *
 * Почта России: «в отделение» и «Курьер» работают по России, «международная в пвз» и
 * «международная курьер» — только для доставки не в Россию (у Почты это разные тарифы).
 */

/** Способы Почты России: два по России и два международных. */
export const POCHTA_DELIVERY_CODES = ['russian_post_office', 'russian_post_courier', 'international_pickup', 'international_courier'];

export const CHECKOUT_DELIVERY_CODES = [
    'cdek_pickup', 'cdek_courier', 'cdek_postamat', 'yandex_pickup', 'yandex_courier',
    ...POCHTA_DELIVERY_CODES,
];

/** Способы, которые доступны только для доставки по России. */
export const RUSSIA_ONLY_DELIVERY_CODES = ['yandex_pickup', 'yandex_courier', 'russian_post_office', 'russian_post_courier'];

/** Способы, которые доступны только для доставки за границу. */
export const ABROAD_ONLY_DELIVERY_CODES = ['international_pickup', 'international_courier'];

interface CheckoutDeliveryMethodLike {
    code?: string;
    delivery_type_code?: string;
}

const codeOf = (method: CheckoutDeliveryMethodLike): string => method.delivery_type_code ?? method.code ?? '';

/** Страна ещё не выбрана — по умолчанию в чекауте стоит Россия. */
export const isRussia = (countryCode?: string | null): boolean => !countryCode || countryCode === 'RU';

export function availableCheckoutDeliveryMethods<T extends CheckoutDeliveryMethodLike>(
    methods: T[] | null | undefined,
    countryCode?: string | null,
): T[] {
    const russia = isRussia(countryCode);

    return (methods ?? [])
        .filter((method) => CHECKOUT_DELIVERY_CODES.includes(codeOf(method)))
        .filter((method) => russia || !RUSSIA_ONLY_DELIVERY_CODES.includes(codeOf(method)))
        .filter((method) => !russia || !ABROAD_ONLY_DELIVERY_CODES.includes(codeOf(method)))
        .sort((left, right) => CHECKOUT_DELIVERY_CODES.indexOf(codeOf(left)) - CHECKOUT_DELIVERY_CODES.indexOf(codeOf(right)));
}
