<template>
  <div class="checkout__block">
    <div class="checkout__block-title fz-h2">Доставка</div>

    <div class="checkout__delivery-self" v-if="userStore.isAuthenticated && hasProfileAddress">
      <FormCheckbox
          name="delivery_self"
          label="Доставка по моему адресу"
          v-model="useMyAddress"
      />
    </div>

    <div class="checkout__delivery">
      <FormSelect
          v-if="countries"
          :key="`country-${useMyAddress}`"
          name="country"
          :list="countries.countries"
          placeholder="Страна"
          :selected-id="useMyAddress ? userStore.user?.profile?.delivery_country_id : defaultCountryId"
          @get-selected-value="setCountry"
      />
      <FormSelect
          v-if="cities"
          :key="`city-${useMyAddress}-${countryId}`"
          name="city"
          :list="cities.cities"
          placeholder="Город"
          :selected-id="useMyAddress ? userStore.user?.profile?.delivery_city_id : undefined"
          @get-selected-value="setCity"
      />
      <FormInput
          name="region"
          placeholder="Регион / область"
          v-model="region"
      />
      <FormInput
          name="postal_code"
          placeholder="Почтовый индекс"
          v-model="postalCode"
      />

      <!-- Адрес: для ПВЗ подставляется автоматически, для курьера — обязателен -->
      <FormInput
          name="address"
          :placeholder="isYandexPickup ? 'Адрес (заполняется при выборе ПВЗ)' : 'Адрес*'"
          :readonly="isYandexPickup"
          v-model="address"
      />

      <div v-if="!isYandexPickup" class="checkout__delivery-extras">
        <FormInput
            name="entrance"
            placeholder="Подъезд"
            v-model="entrance"
        />
        <FormInput
            name="floor"
            placeholder="Этаж"
            v-model="floor"
        />
        <FormInput
            name="intercom"
            placeholder="Домофон"
            v-model="intercom"
        />
      </div>

      <FormDatepicker
          v-if="!isYandexDelivery"
          name="delivery_date"
          placeholder="Желаемая дата доставки"
          v-model="deliveryDate"
      />

      <!-- Выбор способа доставки -->
      <div v-if="deliveryMethodsList.length" class="checkout__delivery-methods">
        <div class="checkout__delivery-methods-title">Способ доставки*</div>
        <div class="checkout__delivery-methods-row">
          <div class="checkout__delivery-methods-select">
            <FormSelect
                :key="`delivery-method-${deliveryMethodsList.length}`"
                name="delivery_method"
                :list="deliveryMethodsList"
                placeholder="Выберите способ доставки"
                :selected-id="deliveryMethodId ?? undefined"
                @get-selected-value="onDeliveryMethodSelected"
            />
          </div>
          <!-- Кнопка «Выбрать ПВЗ» — для СДЭК/ПочтаРФ и Яндекс.ПВЗ -->
          <button
              v-if="canPickOnMap"
              type="button"
              class="checkout__delivery-map-btn btn _border _thin"
              :disabled="isYandexPickup && (!cityName || pvzGeoIdLoading)"
              :title="isYandexPickup && !cityName ? 'Укажите город для выбора ПВЗ' : undefined"
              @click="onPickOnMap"
          >
            <span v-if="isYandexPickup && pvzGeoIdLoading" class="checkout__pvz-btn-spinner"></span>
            {{ isYandexPickup ? 'Выбрать ПВЗ' : 'Выбрать на карте' }}
          </button>
        </div>
      </div>

      <!-- ======= ЯНДЕКС.ДОСТАВКА ======= -->

      <!-- Подсказка для ПВЗ: нужно выбрать пункт -->
      <div v-if="isYandexPickup && !selectedPvz" class="checkout__yandex-hint">
        <span class="checkout__yandex-hint-icon">📍</span>
        Нажмите «Выбрать ПВЗ» чтобы найти ближайший пункт выдачи.
      </div>

      <!-- Выбранный ПВЗ -->
      <div v-if="isYandexPickup && selectedPvz" class="checkout__selected-pvz">
        <div class="checkout__selected-pvz-header">
          <span class="checkout__selected-pvz-icon">✓</span>
          <span class="checkout__selected-pvz-title">Пункт выдачи</span>
          <button type="button" class="checkout__selected-pvz-change" @click="onPickOnMap">
            Изменить
          </button>
        </div>
        <div class="checkout__selected-pvz-name">{{ selectedPvz.name }}</div>
        <div class="checkout__selected-pvz-address">{{ selectedPvz.address }}</div>
      </div>

      <!-- Подсказка для курьера: нужен адрес -->
      <div v-if="isYandexCourier && !canCalculateYandex" class="checkout__yandex-hint">
        <span class="checkout__yandex-hint-icon">🚚</span>
        Заполните город и адрес доставки, чтобы рассчитать стоимость.
      </div>

      <!-- Загрузка тарифов -->
      <div v-if="isYandexDelivery && yandexOffersLoading" class="checkout__yandex-loading">
        <span class="checkout__yandex-loading-spinner"></span>
        Рассчитываем тарифы...
      </div>

      <!-- Ошибка расчёта -->
      <div v-if="isYandexDelivery && !yandexOffersLoading && yandexError" class="checkout__yandex-error">
        {{ yandexError }}
      </div>

      <!-- Список тарифов -->
      <div v-if="isYandexDelivery && yandexOffers.length > 0" class="checkout__yandex-offers">
        <div class="checkout__yandex-offers-title">Выберите тариф доставки</div>
        <div class="checkout__yandex-offers-list">
          <div
              v-for="offer in yandexOffers"
              :key="offer.offer_id"
              class="checkout__yandex-offer"
              :class="{ '_selected': selectedYandexOffer?.offer_id === offer.offer_id }"
              @click="selectYandexOffer(offer)"
          >
            <div class="checkout__yandex-offer-check">
              <span v-if="selectedYandexOffer?.offer_id === offer.offer_id">✓</span>
            </div>
            <div class="checkout__yandex-offer-info">
              <div class="checkout__yandex-offer-name">{{ offer.tariff_name ?? 'Доставка' }}</div>
              <div v-if="offer.delivery_date" class="checkout__yandex-offer-date">
                {{ formatDeliveryDate(offer.delivery_date) }}
                <span v-if="offer.delivery_interval">
                  {{ offer.delivery_interval.from }}–{{ offer.delivery_interval.to }}
                </span>
              </div>
            </div>
            <div class="checkout__yandex-offer-price">{{ formatPrice(offer.price) }} ₽</div>
          </div>
        </div>
      </div>
    </div>

    <div class="checkout__delivery-comment">
      <FormTextarea
          name="buyer_comment"
          placeholder="Комментарий к заказу"
          v-model="buyerComment"
      />
    </div>

    <!-- Модалка выбора ПВЗ Яндекс.Доставки -->
    <CheckoutYandexPvzModal
        :is-open="showPvzModal"
        :geo-id="yandexGeoId ?? undefined"
        :city-name="String(cityName ?? '')"
        @close="showPvzModal = false"
        @select="onPvzSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { until } from '@vueuse/core';
import type { Cities, Countries } from '~/types/countries';

interface DeliveryMethod {
  id: number;
  name: string;
  code?: string;
  delivery_type_code?: string;
  description?: string;
  is_active?: boolean;
}

interface YandexOffer {
  offer_id: string;
  tariff_name?: string;
  price: number;
  delivery_date?: string;
  delivery_interval?: { from: string; to: string };
}

interface PvzPoint {
  id: string;
  name: string;
  address: { full_address?: string } | string;
  position?: { latitude: number; longitude: number };
  operator_id?: string;
  operator_station_id?: string;
}

// ─── v-model связки с родителем ───────────────────────────────────────────────
const userStore = useAuthStore();
const countryId = ref(0);

const countryCode       = defineModel<string>('countryCode', { default: '' });
const countryName       = defineModel<string>('countryName', { default: '' });
const cityName          = defineModel<string>('cityName', { default: '' });
const address           = defineModel<string>('address', { default: '' });
const region            = defineModel<string>('region', { default: '' });
const postalCode        = defineModel<string>('postalCode', { default: '' });
const entrance          = defineModel<string>('entrance', { default: '' });
const floor             = defineModel<string>('floor', { default: '' });
const intercom          = defineModel<string>('intercom', { default: '' });
const deliveryDate      = defineModel<string | number>('deliveryDate', { default: '' });
const buyerComment      = defineModel<string>('buyerComment', { default: '' });
const deliveryMethodId  = defineModel<number | null>('deliveryMethodId', { default: null });
const deliveryMethodName = defineModel<string>('deliveryMethodName', { default: '' });
const deliveryMethodCode = defineModel<string>('deliveryMethodCode', { default: '' });

const yandexOffer = defineModel<{
  offer_id: string;
  tariff_name?: string;
  price: number;
  delivery_date?: string;
} | null>('yandexOffer', { default: null });

const pvzCode    = defineModel<string | null>('pvzCode',    { default: null });
const pvzAddress = defineModel<string | null>('pvzAddress', { default: null });

// ─── Адрес из профиля ─────────────────────────────────────────────────────────
const useMyAddress = ref(false);
const hasProfileAddress = computed(() => {
  const p = userStore.user?.profile;
  return !!(p?.delivery_country_id || p?.delivery_city_id || p?.delivery_address);
});

watch(useMyAddress, (checked) => {
  const p = userStore.user?.profile;
  if (checked && p) {
    address.value   = p.delivery_address    || '';
    postalCode.value = p.delivery_postal_code || '';
    if (p.delivery_country_id) countryId.value = p.delivery_country_id;
  } else {
    address.value    = '';
    postalCode.value = '';
    region.value     = '';
    countryCode.value = '';
    countryName.value = '';
    cityName.value   = '';
    countryId.value  = 0;
  }
});

// ─── Страна / город ───────────────────────────────────────────────────────────
const setCountry = (object: any) => {
  countryCode.value = object.code;
  countryName.value = object.title ?? object.name ?? object.code;
  countryId.value   = object.id;
};

const setCity = (object: any) => {
  cityName.value = object.title ?? object.name;
};

const { data: countries } = await useCountries();
const defaultCountryId = computed(() =>
  countries.value?.countries?.find((c: any) => c.code === 'RU')?.id ?? undefined
);
const { data: cities }    = await useApi<Cities>('/countries/cities', {
  query: { country_id: countryId },
  watch: [countryId],
});

// ─── Методы доставки ──────────────────────────────────────────────────────────
const { data: deliveryMethods } = await useApi<{
  data: DeliveryMethod[];
  meta: { total_methods: number };
}>('/public/delivery/methods', { query: { active: 1 } });

const deliveryMethodsList = computed<DeliveryMethod[]>(
    () => deliveryMethods.value?.data ?? [],
);

const selectedDeliveryMethod = computed<DeliveryMethod | null>(
    () => deliveryMethodsList.value.find(m => m.id === deliveryMethodId.value) ?? null,
);

const currentCode = computed(() =>
    selectedDeliveryMethod.value?.delivery_type_code
    ?? selectedDeliveryMethod.value?.code
    ?? '',
);

const selectDeliveryMethod = (method: DeliveryMethod) => {
  deliveryMethodId.value   = method.id;
  deliveryMethodName.value = method.name;
  deliveryMethodCode.value = method.delivery_type_code ?? method.code ?? '';
};

const onDeliveryMethodSelected = (object: { id: number; title?: string; code?: string }) => {
  const method = deliveryMethodsList.value.find(m => m.id === object.id);
  if (method) selectDeliveryMethod(method);
};

// Авто-выбор первого метода
watch(deliveryMethodsList, (list) => {
  if (list.length && !deliveryMethodId.value) selectDeliveryMethod(list[0]);
}, { immediate: true });

// ─── Яндекс.Доставка: флаги ────────────────────────────────────────────────
const isYandexPickup  = computed(() => currentCode.value === 'yandex_pickup');
const isYandexCourier = computed(() => currentCode.value === 'yandex_courier');
const isYandexDelivery = computed(() => isYandexPickup.value || isYandexCourier.value);

// Для курьера нужен город + адрес
const canCalculateYandex = computed(() =>
    !!(cityName.value && address.value),
);

// Кнопка «Выбрать на карте / ПВЗ»
const MAP_PICK_DELIVERY_CODES = ['cdek_pickup', 'russian_post_office', 'russian_post_on_demand'];
const canPickOnMap = computed(() =>
    MAP_PICK_DELIVERY_CODES.includes(currentCode.value) || isYandexPickup.value,
);

// ─── geo_id для фильтрации ПВЗ ────────────────────────────────────────────────
const yandexGeoId       = ref<number | null>(null);
const pvzGeoIdLoading   = ref(false);

watch([isYandexDelivery, cityName], async ([isYandex, city]) => {
  if (!isYandex || !city) { yandexGeoId.value = null; return; }
  pvzGeoIdLoading.value = true;
  const { detectLocation } = useYandexDelivery();
  const loc = await detectLocation(String(city));
  yandexGeoId.value = loc?.geo_id ?? loc?.variants?.[0]?.geo_id ?? null;
  pvzGeoIdLoading.value = false;
}, { immediate: false });

// ─── Тарифы ────────────────────────────────────────────────────────────────────
const yandexOffers      = ref<YandexOffer[]>([]);
const yandexOffersLoading = ref(false);
const yandexError       = ref('');
const selectedYandexOffer = ref<YandexOffer | null>(null);

// Сброс при смене метода
watch(selectedDeliveryMethod, () => {
  yandexOffer.value       = null;
  selectedYandexOffer.value = null;
  yandexOffers.value      = [];
  yandexError.value       = '';
  if (!isYandexPickup.value) {
    selectedPvz.value = null;
    pvzCode.value     = null;
    pvzAddress.value  = null;
  }
});

/** Запрашивает тарифы у бэка. */
const fetchYandexOffers = async (params: {
  deliveryType: 'pickup' | 'courier';
  pvzId?: string;
  pvzCoords?: [number, number];
  destination?: { address: string; coordinates: [number, number] };
}) => {
  yandexOffersLoading.value = true;
  yandexError.value         = '';
  yandexOffers.value        = [];

  try {
    const cartStore = useCartStore();
    const items = cartStore.cart.map((item: any) => ({
      name:     item.name    ?? 'Товар',
      article:  item.sku     ?? String(item.id),
      weight:   item.weight  ?? 500,
      size: {
        length: item.length ?? 20,
        width:  item.width  ?? 15,
        height: item.height ?? 10,
      },
      quantity: item.quantity ?? 1,
      price:    item.price    ?? 100,
    }));

    const body: Record<string, unknown> = {
      delivery_type: params.deliveryType,
      items,
    };
    if (params.pvzId)        body.pvz_id      = params.pvzId;
    if (params.pvzCoords)    body.pvz_coords  = params.pvzCoords;
    if (params.destination)  body.destination = params.destination;

    const { data, error } = await useApi<{ success: boolean; offers: YandexOffer[] }>(
        '/public/delivery/yandex/calculate',
        { method: 'POST', body },
    );

    if (!error.value && data.value?.success) {
      yandexOffers.value = data.value.offers ?? [];
      if (!yandexOffers.value.length) {
        yandexError.value = 'Для указанного адреса нет доступных тарифов.';
      }
    } else {
      yandexError.value = 'Не удалось рассчитать стоимость доставки.';
    }
  } catch (e) {
    console.error('Yandex calculate error:', e);
    yandexError.value = 'Ошибка при расчёте доставки.';
  } finally {
    yandexOffersLoading.value = false;
  }
};

// Расчёт для КУРЬЕРА — автоматически при вводе адреса
let courierCalcTimer: ReturnType<typeof setTimeout> | null = null;

watch([isYandexCourier, address, cityName], ([courier, addr, city]) => {
  if (!courier) return;
  if (!addr || !city) {
    yandexOffers.value      = [];
    selectedYandexOffer.value = null;
    yandexOffer.value       = null;
    return;
  }

  if (courierCalcTimer) clearTimeout(courierCalcTimer);
  courierCalcTimer = setTimeout(async () => {
    const { geocode } = useYandexDelivery();
    const fullAddr    = `${city}, ${addr}`;
    const coords      = await geocode(fullAddr);

    if (!coords) {
      yandexError.value = 'Не удалось определить координаты адреса. Проверьте адрес.';
      return;
    }

    await fetchYandexOffers({
      deliveryType: 'courier',
      destination:  { address: fullAddr, coordinates: coords },
    });
  }, 700);
});

const selectYandexOffer = (offer: YandexOffer) => {
  selectedYandexOffer.value = offer;
  yandexOffer.value = {
    offer_id:      offer.offer_id,
    tariff_name:   offer.tariff_name,
    price:         offer.price,
    delivery_date: offer.delivery_date,
  };
};

// ─── ПВЗ модалка ──────────────────────────────────────────────────────────────
const showPvzModal = ref(false);
const selectedPvz  = ref<{ id: string; name: string; address: string; pvzApiId?: string } | null>(null);

const onPickOnMap = async () => {
  if (isYandexPickup.value && pvzGeoIdLoading.value) {
    // Ждём завершения определения geo_id
    await until(pvzGeoIdLoading).toBe(false);
  }
  showPvzModal.value = true;
};

const formatPvzAddress = (point: PvzPoint): string => {
  if (typeof point.address === 'string') return point.address;
  return point.address?.full_address ?? '';
};

const onPvzSelect = async (point: PvzPoint) => {
  const addr = formatPvzAddress(point);

  // Формируем id для Platform API:
  // operator_id:operator_station_id — подтверждённый формат
  const pvzApiId = (point.operator_id && point.operator_station_id)
      ? `${point.operator_id}:${point.operator_station_id}`
      : point.id;

  selectedPvz.value  = { id: point.id, name: point.name, address: addr, pvzApiId };
  address.value      = addr;
  pvzCode.value      = pvzApiId;
  pvzAddress.value   = addr;

  // Сбрасываем прошлый тариф и считаем новые
  selectedYandexOffer.value = null;
  yandexOffer.value         = null;

  // Координаты ПВЗ из ответа Platform API
  const coords: [number, number] | undefined = (point.position)
      ? [point.position.longitude, point.position.latitude]
      : undefined;

  await fetchYandexOffers({
    deliveryType: 'pickup',
    pvzId:        pvzApiId,
    pvzCoords:    coords,
  });
};

// Sync pvzCode при изменении selectedPvz
watch(selectedPvz, (point) => {
  if (!point) {
    pvzCode.value    = null;
    pvzAddress.value = null;
  }
});

// ─── Утилиты форматирования ───────────────────────────────────────────────────
const formatDeliveryDate = (date: string): string => {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU').format(Math.round(price));
};
</script>

<style scoped lang="scss">
.checkout__delivery-self {
  margin-bottom: 1.5rem;
}

.checkout__delivery-extras {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
  }
}

.checkout__delivery-methods {
  margin-top: 2rem;
}

.checkout__delivery-methods-title {
  font-size: var(--fz-regular);
  font-weight: 600;
  margin-bottom: 1.2rem;
}

.checkout__delivery-methods-row {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: $mobile) {
    flex-direction: column;
    align-items: stretch;
  }
}

.checkout__delivery-methods-select {
  flex: 0 1 36rem;
  min-width: 0;
  max-width: 100%;
}

.checkout__delivery-map-btn {
  flex: 0 0 auto;
  white-space: nowrap;
  width: auto;
  margin: 0;
  padding: 0 2rem;
  min-height: 5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: $mobile) {
    width: 100%;
  }
}

.checkout__pvz-btn-spinner {
  width: 1.4rem;
  height: 1.4rem;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

.checkout__delivery-comment {
  margin-top: 3.3rem;
}

// ─── Яндекс: подсказки ───────────────────────────────────────────────────────

.checkout__yandex-hint {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1.5rem;
  padding: 1.2rem 1.5rem;
  background: #f5f8ff;
  border: 1px solid #d5e3ff;
  border-radius: 0.8rem;
  font-size: var(--fz-small);
  color: #555;
}

.checkout__yandex-hint-icon {
  font-size: 1.6rem;
  flex-shrink: 0;
}

.checkout__yandex-error {
  margin-top: 1.5rem;
  padding: 1.2rem 1.5rem;
  background: #fff5f5;
  border: 1px solid #ffd5d5;
  border-radius: 0.8rem;
  font-size: var(--fz-small);
  color: #c0392b;
}

// ─── Яндекс: выбранный ПВЗ ───────────────────────────────────────────────────

.checkout__selected-pvz {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f0f7f0;
  border: 1px solid #b8ddb8;
  border-radius: 0.8rem;
}

.checkout__selected-pvz-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}

.checkout__selected-pvz-icon {
  color: #27ae60;
  font-weight: 700;
}

.checkout__selected-pvz-title {
  font-weight: 600;
  font-size: var(--fz-small);
  color: #27ae60;
  flex: 1;
}

.checkout__selected-pvz-change {
  background: none;
  border: none;
  color: var(--color-primary, #000);
  font-size: var(--fz-small);
  cursor: pointer;
  text-decoration: underline;
  padding: 0;

  &:hover {
    text-decoration: none;
  }
}

.checkout__selected-pvz-name {
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.checkout__selected-pvz-address {
  font-size: var(--fz-small);
  color: #555;
}

// ─── Яндекс: загрузка ────────────────────────────────────────────────────────

.checkout__yandex-loading {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  color: var(--color-gray, #888);
  font-size: var(--fz-small);
}

.checkout__yandex-loading-spinner {
  width: 1.8rem;
  height: 1.8rem;
  border: 2px solid #e0e0e0;
  border-top-color: var(--color-primary, #000);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// ─── Яндекс: тарифы ───────────────────────────────────────────────────────────

.checkout__yandex-offers {
  margin-top: 2rem;
}

.checkout__yandex-offers-title {
  font-size: var(--fz-regular);
  font-weight: 600;
  margin-bottom: 1.2rem;
}

.checkout__yandex-offers-list {
  display: grid;
  gap: 0.8rem;
}

.checkout__yandex-offer {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.4rem 1.5rem;
  border: 1.5px solid #e0e0e0;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: var(--color-primary, #000);
  }

  &._selected {
    border-color: var(--color-primary, #000);
    background: #f9f9f9;
  }
}

.checkout__yandex-offer-check {
  width: 2rem;
  height: 2rem;
  border: 1.5px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-primary, #000);
  flex-shrink: 0;
  transition: border-color 0.15s;

  ._selected & {
    border-color: var(--color-primary, #000);
    background: var(--color-primary, #000);
    color: #fff;
  }
}

.checkout__yandex-offer-info {
  flex: 1;
  min-width: 0;
}

.checkout__yandex-offer-name {
  font-weight: 600;
  font-size: var(--fz-regular);
}

.checkout__yandex-offer-date {
  font-size: var(--fz-small);
  color: var(--color-gray, #888);
  margin-top: 0.2rem;
}

.checkout__yandex-offer-price {
  font-size: 1.8rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
