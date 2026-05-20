// Единый источник правды по способам оплаты — используется
// и в чекауте (FormRadio со списком), и в просмотре заказа (рендер лейбла
// по коду из БД).
//
// Если бэк когда-нибудь начнёт отдавать справочник /api/payment-methods —
// переключимся на динамическую загрузку. Пока же бэк хранит свободную строку
// в `orders.payment_method`, поэтому здесь же поддерживаем легаси-коды.

export interface PaymentOption {
    code: string;
    title: string;
    text?: string;
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
    { code: 'card_ru', title: 'Оплата картой РФ' },
    { code: 'sberpay', title: 'SberPay, рассрочка, иностранная карта' },
    { code: 'yandex_pay_split', title: 'Яндекс Пэй и Сплит' },
    { code: 'cash_on_delivery', title: 'Наличными или картой при получении' },
    { code: 'pickup_payment', title: 'Оплата в точке самовывоза' },
    { code: 'podeli', title: 'Подели' },
    { code: 'robokassa_mokka', title: 'Robokassa X Мокка' },
    { code: 'robokassa_yandex_split', title: 'Robokassa X Яндекс Сплит' },
];

/**
 * Мапа «код → человекочитаемое название» для вывода на странице заказа.
 * Помимо актуальных кодов учитываем устаревшие, которые могут остаться
 * у старых заказов в БД.
 */
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
    ...Object.fromEntries(PAYMENT_OPTIONS.map((o) => [o.code, o.title])),
    // Легаси-коды (заказы до унификации):
    card: 'Оплата картой РФ',
    yookassa: 'Оплата картой РФ',
    online: 'Оплата картой РФ',
    yandex_pay: 'Яндекс Пэй и Сплит',
    split: 'Яндекс Пэй и Сплит',
    cash: 'Наличными или картой при получении',
    cod: 'Наличными или картой при получении',
    sbp: 'SberPay, рассрочка, иностранная карта',
    bank_transfer: 'Оплата картой РФ',
};

export const getPaymentMethodLabel = (code: string | null | undefined): string => {
    if (!code) return '';
    return PAYMENT_METHOD_LABELS[code] || code;
};
