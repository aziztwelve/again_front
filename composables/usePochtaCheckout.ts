/**
 * Почта России в чекауте: отделения, тарифы и данные доставки для заказа.
 *
 * Способы (коды delivery_methods): russian_post_office (в отделение), russian_post_courier (курьер),
 * international_pickup и international_courier (за границу). Бэкенд: /public/delivery/pochta/*.
 * Цена и срок приходят от бэкенда; при создании заказа он ещё раз пересчитывает тариф сам.
 */
import type { Ref } from 'vue';
import { POCHTA_DELIVERY_CODES } from '~/utils/checkoutDeliveryMethods';

export interface PochtaOffice {
    code: string;
    type: string;
    address: string;
    latitude: number;
    longitude: number;
    distance_km: number | null;
    hours: string;
}

export interface PochtaTariff {
    tariff_code: string;
    tariff_name: string;
    display_name?: string;
    mail_type: string;
    mail_category?: string;
    delivery_mode?: string;
    price: number;
    currency: string;
    period: { min: number; max: number };
}

const DELIVERY_TYPE: Record<string, string> = {
    russian_post_office: 'office',
    russian_post_courier: 'courier',
    international_pickup: 'international_pickup',
    international_courier: 'international_courier',
};

export const isPochtaCode = (code?: string | null): boolean => !!code && POCHTA_DELIVERY_CODES.includes(code);

/** Срок для покупателя: «7 дн.» или «11–12 дн.». */
export const pochtaPeriod = (period?: { min: number; max: number } | null): string => {
    if (!period?.max) return '';
    return period.min && period.min !== period.max ? `${period.min}–${period.max} дн.` : `${period.max} дн.`;
};

interface Options {
    code: Ref<string>;
    cityName: Ref<string>;
    countryCode: Ref<string>;
    address: Ref<string>;
    /** Отделение выбрано: родитель подставляет адрес пункта в форму. */
    onOfficeChosen: (office: PochtaOffice | null) => void;
    /** Тариф выбран (или сброшен): родитель кладёт данные в форму заказа. */
    onDeliveryData: (data: Record<string, unknown> | null) => void;
}

const firstPositive = (...values: any[]) => values.find((value) => Number(value) > 0) ?? null;

export function usePochtaCheckout(options: Options) {
    const { code, cityName, countryCode, address } = options;
    const apiFetch = useApiClient();
    const freeShipping = useFreeShippingStore();
    const cartStore = useCartStore();

    const isOffice = computed(() => code.value === 'russian_post_office');
    const isCourier = computed(() => code.value === 'russian_post_courier');
    const isInternational = computed(() => code.value === 'international_pickup' || code.value === 'international_courier');
    const isPochta = computed(() => isPochtaCode(code.value));
    const country = computed(() => (countryCode.value || 'RU').toUpperCase());

    const offices = ref<PochtaOffice[]>([]);
    const officesLoading = ref(false);
    const officesError = ref('');
    const selectedOffice = ref<PochtaOffice | null>(null);
    const modalOpen = ref(false);

    const tariffs = ref<PochtaTariff[]>([]);
    const selectedTariff = ref<PochtaTariff | null>(null);
    const loading = ref(false);
    const error = ref('');

    // Ответ запроса, отправленного до смены условий, игнорируем.
    let officesRun = 0;
    let tariffsRun = 0;

    const items = () => cartStore.cart.map((item: any) => ({
        name: item.name ?? 'Товар',
        weight: firstPositive(item.selected_variant?.weight, item.weight),
        length: firstPositive(item.selected_variant?.length, item.length),
        width: firstPositive(item.selected_variant?.width, item.width),
        height: firstPositive(item.selected_variant?.height, item.height),
        price: item.price ?? 0,
        quantity: item.quantity ?? 1,
    }));

    const messageOf = (e: any, fallback: string): string => e?.data?.message ?? e?.response?._data?.message ?? fallback;

    const resetTariffs = () => {
        tariffsRun++;
        tariffs.value = [];
        selectedTariff.value = null;
        loading.value = false;
        error.value = '';
        options.onDeliveryData(null);
        freeShipping.setSelected(null, null);
    };

    const reset = () => {
        officesRun++;
        offices.value = [];
        officesLoading.value = false;
        officesError.value = '';
        if (selectedOffice.value) options.onOfficeChosen(null);
        selectedOffice.value = null;
        modalOpen.value = false;
        resetTariffs();
    };

    const destination = () => ({
        index: selectedOffice.value?.code ?? null,
        city: cityName.value || null,
        address: address.value || null,
        country_code: country.value,
    });

    const selectTariff = (tariff: PochtaTariff) => {
        selectedTariff.value = tariff;
        const office = selectedOffice.value;
        options.onDeliveryData({
            provider: 'pochta',
            delivery_type: DELIVERY_TYPE[code.value],
            ...tariff,
            destination: destination(),
            pvz: office ? { code: office.code, type: office.type, address: office.address, coordinates: [office.longitude, office.latitude] } : null,
        });
        // «Итого» берёт цену доставки из этого хранилища; правил бесплатной доставки для Почты пока нет.
        freeShipping.setSelected(`pochta:${code.value}:${tariff.tariff_code}`, tariff.price);
    };

    const fetchTariffs = async () => {
        if (!isPochta.value) return;
        const canCalculate = isOffice.value
            ? !!selectedOffice.value
            : isCourier.value
                ? !!(cityName.value && address.value)
                : country.value !== 'RU';
        if (!canCalculate) return;

        const run = ++tariffsRun;
        loading.value = true;
        error.value = '';
        tariffs.value = [];
        selectedTariff.value = null;
        options.onDeliveryData(null);
        freeShipping.setSelected(null, null);

        try {
            const response = await apiFetch<{ success: boolean; tariffs: PochtaTariff[]; message?: string }>('/public/delivery/pochta/calculate', {
                method: 'POST',
                body: { delivery_method_code: code.value, destination: destination(), items: items() },
            });
            if (run !== tariffsRun) return;
            tariffs.value = response.tariffs ?? [];
            // Дешёвый вариант отмечаем сразу: без выбранного тарифа заказ не оформить, а цена нужна в «Итого».
            if (tariffs.value.length) selectTariff([...tariffs.value].sort((left, right) => left.price - right.price)[0]);
            else error.value = 'Для указанного адреса нет доступных тарифов Почты России.';
        } catch (e: any) {
            if (run !== tariffsRun) return;
            error.value = messageOf(e, 'Не удалось рассчитать доставку Почтой России.');
        } finally {
            if (run === tariffsRun) loading.value = false;
        }
    };

    const loadOffices = async () => {
        if (!isOffice.value || !cityName.value) return;
        const run = ++officesRun;
        officesLoading.value = true;
        officesError.value = '';
        try {
            const response = await apiFetch<{ success: boolean; offices: PochtaOffice[] }>('/public/delivery/pochta/offices', {
                query: { city: cityName.value },
            });
            if (run !== officesRun) return;
            offices.value = response.offices ?? [];
        } catch (e: any) {
            if (run !== officesRun) return;
            offices.value = [];
            officesError.value = messageOf(e, 'Не удалось загрузить отделения Почты России.');
        } finally {
            if (run === officesRun) officesLoading.value = false;
        }
    };

    const chooseOffice = (office: PochtaOffice) => {
        selectedOffice.value = office;
        options.onOfficeChosen(office);
        fetchTariffs();
    };

    // Смена способа: чистим только если затронута Почта (другие службы управляют своим состоянием сами).
    watch(code, (next, previous) => {
        if (!isPochtaCode(next) && !isPochtaCode(previous)) return;
        reset();
        if (isPochtaCode(next)) {
            if (isOffice.value) loadOffices();
            else if (isInternational.value) fetchTariffs();
        }
    });

    let officesTimer: ReturnType<typeof setTimeout> | null = null;
    watch(cityName, () => {
        if (!isOffice.value) return;
        reset();
        if (officesTimer) clearTimeout(officesTimer);
        officesTimer = setTimeout(loadOffices, 350);
    });

    let tariffsTimer: ReturnType<typeof setTimeout> | null = null;
    watch([address, cityName], () => {
        if (!isCourier.value) return;
        if (tariffsTimer) clearTimeout(tariffsTimer);
        tariffsTimer = setTimeout(fetchTariffs, 700);
    });

    watch(country, () => {
        if (!isPochta.value) return;
        if (isInternational.value) fetchTariffs();
        else resetTariffs();
    });

    // Другой состав корзины — другой вес и стоимость, пересчитываем.
    watch(() => cartStore.cart.map((item: any) => `${item.id}:${item.quantity}`).join('|'), () => {
        if (isPochta.value) fetchTariffs();
    });

    onMounted(() => {
        if (isOffice.value) loadOffices();
        else if (isInternational.value) fetchTariffs();
    });

    return {
        isPochta, isOffice, isCourier, isInternational,
        offices, officesLoading, officesError, selectedOffice, modalOpen,
        tariffs, selectedTariff, loading, error,
        chooseOffice, selectTariff, fetchTariffs,
    };
}
