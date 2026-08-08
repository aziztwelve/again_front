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
    { code: 'card_ru', title: 'Банковская карта' },
    { code: 'cloudpayments_tpay', title: 'T-Pay' },
    { code: 'cloudpayments_sbp', title: 'СБП' },
    { code: 'cloudpayments_sberpay', title: 'SberPay' },
    { code: 'cloudpayments_mirpay', title: 'Mir Pay' },
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
