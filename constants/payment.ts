// Единый источник правды по способам оплаты — используется
// и в чекауте (FormRadio со списком), и в просмотре заказа (рендер лейбла
// по коду из БД).
//
// В чекауте две опции: «Оплата картами РФ, TPay, СБП» (card_ru — виджет
// CloudPayments с картами/T-Pay/СБП) и «Яндекс Пэй и Сплит» (yandex_pay —
// форма Яндекс Пэй: оплата картами Visa/Mastercard/МИР и Сплит).
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
    { code: 'card_ru', title: 'Оплата картами РФ, TPay, СБП' },
    { code: 'yandex_pay', title: 'Яндекс Пэй и Сплит', text: 'Оплата частями, картами Visa, Mastercard, МИР' },
];

/**
 * Мапа «код → человекочитаемое название» для вывода на странице заказа.
 * Помимо актуальных кодов учитываем устаревшие, которые могут остаться
 * у старых заказов в БД.
 */
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
    ...Object.fromEntries(PAYMENT_OPTIONS.map((o) => [o.code, o.title])),
    // Коды отдельных методов CloudPayments (заказы до объединения опций
    // чекаута в «Оплата картами РФ, TPay, СБП»):
    cloudpayments_tpay: 'T-Pay',
    cloudpayments_sbp: 'СБП',
    cloudpayments_sberpay: 'SberPay',
    cloudpayments_mirpay: 'Mir Pay',
    // Легаси-коды (заказы до унификации):
    card: 'Оплата картой РФ',
    yookassa: 'Оплата картой РФ',
    online: 'Оплата картой РФ',
    yandex_pay_split: 'Яндекс Сплит',
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
