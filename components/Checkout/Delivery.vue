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
          :placeholder="isPickupDelivery ? 'Адрес (заполняется при выборе ПВЗ)' : 'Адрес*'"
          :readonly="isPickupDelivery"
          v-model="address"
      />

      <div v-if="!isPickupDelivery" class="checkout__delivery-extras">
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
          class="checkout__delivery-date"
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
          <!-- Кнопка выбора ПВЗ Яндекс.Доставки -->
          <button
              v-if="canPickOnMap"
              type="button"
              class="checkout__delivery-map-btn btn _border _thin"
              :disabled="(isYandexPickup && (!cityName || pvzGeoIdLoading)) || (isCdekPickup && (!cityName || cdekCityLoading || cdekPvzLoading))"
              :title="!cityName ? 'Укажите город для выбора ПВЗ' : undefined"
              @click="onPickOnMap"
          >
            <span v-if="(isYandexPickup && pvzGeoIdLoading) || (isCdekPickup && (cdekCityLoading || cdekPvzLoading))" class="checkout__pvz-btn-spinner"></span>
            {{ isCdekPickup && (cdekCityLoading || cdekPvzLoading) ? 'Загружаем ПВЗ...' : 'Выбрать ПВЗ' }}
          </button>
        </div>
      </div>

      <!-- ======= ЯНДЕКС.ДОСТАВКА ======= -->

      <!-- ======= СДЭК ======= -->
      <div v-if="isCdekDelivery" class="checkout__cdek">
        <!-- Подсказка для курьера СДЭК: нужен город и адрес -->
        <div v-if="isCdekCourier && !canCalculateCdek" class="checkout__yandex-hint">
          <span class="checkout__yandex-hint-icon">🚚</span>
          Заполните город и адрес доставки, чтобы рассчитать стоимость.
        </div>
        <div v-if="cdekCityLoading" class="checkout__yandex-loading">
          <span class="checkout__yandex-loading-spinner"></span>
          Ищем город в СДЭК...
        </div>
        <div v-else-if="cityName && !cdekCityCode" class="checkout__yandex-hint">
          Не удалось сопоставить город с СДЭК. Уточните название города.
        </div>
        <div v-if="isCdekPickup && selectedCdekPvzCode" class="checkout__selected-pvz">
          <div class="checkout__selected-pvz-header"><span class="checkout__selected-pvz-icon">✓</span><span class="checkout__selected-pvz-title">Пункт выдачи СДЭК</span><button type="button" class="checkout__selected-pvz-change" @click="showCdekPvzModal = true">Изменить</button></div>
          <div class="checkout__selected-pvz-address">{{ pvzAddress }}</div>
        </div>
        <div v-if="cdekLoading" class="checkout__yandex-loading">
          <span class="checkout__yandex-loading-spinner"></span>
          Рассчитываем тарифы СДЭК...
        </div>
        <div v-if="cdekError" class="checkout__yandex-error">{{ cdekError }}</div>
        <div v-if="cdekTariffs.length" class="checkout__yandex-offers">
          <div class="checkout__yandex-offers-title">Выберите тариф СДЭК</div>
          <div class="checkout__yandex-offers-list">
            <div v-for="tariff in cdekTariffs" :key="tariff.tariff_code" class="checkout__yandex-offer" :class="{ '_selected': selectedCdekTariff?.tariff_code === tariff.tariff_code }" @click="selectCdekTariff(tariff)">
              <div class="checkout__yandex-offer-check"><span v-if="selectedCdekTariff?.tariff_code === tariff.tariff_code">✓</span></div>
              <div class="checkout__yandex-offer-info">
                <div class="checkout__yandex-offer-name">{{ cdekTariffTitle(tariff) }}</div>
                <div v-if="cdekTariffDescription(tariff)" class="checkout__cdek-tariff-original">
                  {{ cdekTariffDescription(tariff) }}
                </div>
                <div class="checkout__yandex-offer-date">{{ tariff.period.min }}-{{ tariff.period.max }} дн.</div>
              </div>
              <div class="checkout__yandex-offer-price">
                <template v-if="freeShipping.isFree(cdekCandidateKey(tariff))">
                  <span class="checkout__offer-price-old">{{ formatPrice(tariff.price) }} ₽</span>
                  <span class="checkout__offer-price-free">Бесплатно</span>
                </template>
                <template v-else>{{ formatPrice(tariff.price) }} ₽</template>
              </div>
            </div>
          </div>
          <div v-if="freeShippingHint" class="checkout__free-shipping-hint">{{ freeShippingHint }}</div>
        </div>
      </div>

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
                  {{ formatDeliveryInterval(offer.delivery_interval) }}
                </span>
              </div>
            </div>
            <div class="checkout__yandex-offer-price">
              <template v-if="freeShipping.isFree(yandexCandidateKey(offer))">
                <span class="checkout__offer-price-old">{{ formatPrice(offer.price) }} ₽</span>
                <span class="checkout__offer-price-free">Бесплатно</span>
              </template>
              <template v-else>{{ formatPrice(offer.price) }} ₽</template>
            </div>
          </div>
        </div>
        <div v-if="freeShippingHint" class="checkout__free-shipping-hint">{{ freeShippingHint }}</div>
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
    <CheckoutCdekPvzModal :is-open="showCdekPvzModal" :points="cdekPvzPoints" :point-type="currentCode === 'cdek_postamat' ? 'POSTAMAT' : 'PVZ'" :selected-code="selectedCdekPvzCode" @close="showCdekPvzModal = false" @select="selectedCdekPvzCode = $event.code" />
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

interface CdekCity { code: number; full_name: string; country_code?: string }
interface CdekPvz { code: string; name?: string; type?: string; location?: { address?: string; address_full?: string; longitude?: number; latitude?: number } }
interface CdekTariff { tariff_code: number; tariff_name: string; display_name?: string; display_description?: string; show_tariff_label?: boolean; delivery_mode: number; price: number; currency: string; period: { min: number; max: number } }

const cdekTariffTitles: Array<[RegExp, string]> = [
  [/^Супер-экспресс до 10(?:\.00)?\b/i, 'Доставка до 10:00'],
  [/^Супер-экспресс до 12(?:\.00)?\b/i, 'Доставка до 12:00'],
  [/^Супер-экспресс до 14(?:\.00)?\b/i, 'Доставка до 14:00'],
  [/^Супер-экспресс до 16(?:\.00)?\b/i, 'Доставка до 16:00'],
  [/^Супер-экспресс до 18(?:\.00)?\b/i, 'Доставка до 18:00'],
  [/^Экономичная посылка\b/i, 'Экономичная доставка в ПВЗ'],
  [/^Экономичный экспресс\b/i, 'Экономичная экспресс-доставка'],
  [/^Магистральный экспресс\b/i, 'Быстрая доставка в ПВЗ'],
  [/^Экспресс тяжеловесы\b/i, 'Экспресс-доставка крупного заказа'],
  [/^Сборный груз\b/i, 'Доставка крупногабаритного заказа'],
  [/^Посылка\b/i, 'Стандартная доставка в ПВЗ'],
  [/^Экспресс\b/i, 'Экспресс-доставка в ПВЗ'],
]

const cdekTariffTitle = (tariff: CdekTariff): string =>
  tariff.display_name || (cdekTariffTitles.find(([pattern]) => pattern.test(tariff.tariff_name))?.[1] ?? tariff.tariff_name)
const cdekTariffDescription = (tariff: CdekTariff): string | null => {
  const description = tariff.display_description || null
  return description && description !== cdekTariffTitle(tariff) ? `${tariff.show_tariff_label === false ? '' : 'Тариф «'}${description}${tariff.show_tariff_label === false ? '' : '»'}` : null
}

const props = defineProps<{
  recipient?: { first_name?: string; last_name?: string; phone?: string; email?: string };
  /**
   * Выбранный способ оплаты — часть условий правил бесплатной доставки
   * (см. lara_admin/docs/tasks/free-shipping.md).
   */
  paymentMethod?: string;
  /** Введённый промокод: влияет на сумму выкупа. */
  promoCode?: string;
}>();

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
const yandexDeliveryData = defineModel<Record<string, unknown> | null>('yandexDeliveryData', { default: null });
const cdekDeliveryData = defineModel<Record<string, unknown> | null>('cdekDeliveryData', { default: null });

const pvzCode    = defineModel<string | null>('pvzCode',    { default: null });
const pvzAddress = defineModel<string | null>('pvzAddress', { default: null });

// Идентификаторы справочников гео из селектов «Страна»/«Город».
// Уходят в заказ (delivery_address.country_id / city_id) и в оценку правил
// бесплатной доставки — по названиям матчинг менее надёжный.
const geoCountryId = defineModel<number | null>('geoCountryId', { default: null });
const geoCityId    = defineModel<number | null>('geoCityId',    { default: null });

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
  geoCountryId.value = typeof object.id === 'number' ? object.id : null;
  // Город относится к другой стране — сбрасываем его id.
  geoCityId.value = null;
};

const setCity = (object: any) => {
  cityName.value = object.title ?? object.name;
  geoCityId.value = typeof object.id === 'number' ? object.id : null;
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

const CHECKOUT_DELIVERY_CODES = ['yandex_courier', 'yandex_pickup', 'cdek_courier', 'cdek_pickup', 'cdek_postamat'];
const deliveryMethodsList = computed<DeliveryMethod[]>(() =>
    (deliveryMethods.value?.data ?? []).filter((method) =>
      CHECKOUT_DELIVERY_CODES.includes(method.delivery_type_code ?? method.code ?? ''),
    ),
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
const isCdekPickup = computed(() => ['cdek_pickup', 'cdek_postamat'].includes(currentCode.value));
const isCdekCourier = computed(() => currentCode.value === 'cdek_courier');
const isCdekDelivery = computed(() => isCdekPickup.value || isCdekCourier.value);
const isPickupDelivery = computed(() => isYandexPickup.value || isCdekPickup.value);

// Для курьера нужен город + адрес
const canCalculateYandex = computed(() =>
    !!(cityName.value && address.value),
);
const canCalculateCdek = computed(() =>
    !!(cityName.value && address.value),
);

// Кнопка «Выбрать на карте / ПВЗ»
const canPickOnMap = computed(() => isYandexPickup.value || isCdekPickup.value);

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
const courierDestination = ref<{ address: string; coordinates: [number, number] } | null>(null);

// Platform API принимает для доставки по России только полный российский номер.
// Не отправляем промежуточное значение маски (например, "+7 (") при наборе.
const hasValidYandexRecipientPhone = (phone?: string): boolean => {
  const digits = (phone ?? '').replace(/\D/g, '');
  return /^7\d{10}$/.test(digits);
};

// Сброс при смене метода
watch(selectedDeliveryMethod, () => {
  yandexOffer.value       = null;
  yandexDeliveryData.value = null;
  selectedYandexOffer.value = null;
  yandexOffers.value      = [];
  yandexError.value       = '';
  cdekDeliveryData.value = null;
  selectedCdekTariff.value = null;
  cdekTariffs.value = [];
  cdekError.value = '';
  if (!isCdekPickup.value) selectedCdekPvzCode.value = null;
  if (!isYandexPickup.value) {
    selectedPvz.value = null;
    pvzCode.value     = null;
    pvzAddress.value  = null;
  }
});

// ─── СДЭК ─────────────────────────────────────────────────────────────────────
const cdekCities = ref<CdekCity[]>([]);
const cdekCityCode = ref<number | null>(null);
const cdekCityLoading = ref(false);
const cdekPvzPoints = ref<CdekPvz[]>([]);
const cdekPvzLoading = ref(false);
const selectedCdekPvzCode = ref<string | null>(null);
const showCdekPvzModal = ref(false);
const cdekTariffs = ref<CdekTariff[]>([]);
const selectedCdekTariff = ref<CdekTariff | null>(null);
const cdekLoading = ref(false);
const cdekError = ref('');

let cdekCityTimer: ReturnType<typeof setTimeout> | null = null;
watch([isCdekDelivery, currentCode, cityName], ([enabled, _code, city]) => {
  cdekCityCode.value = null;
  cdekCities.value = [];
  cdekPvzPoints.value = [];
  selectedCdekPvzCode.value = null;
  if (!enabled || !city) return;
  if (cdekCityTimer) clearTimeout(cdekCityTimer);
  cdekCityTimer = setTimeout(async () => {
    cdekCityLoading.value = true;
    try {
      const { data, error } = await useApi<{ cities: CdekCity[] }>('/public/delivery/cdek/cities', { query: { query: city, country_code: countryCode.value || 'RU' } });
      cdekCities.value = error.value ? [] : (data.value?.cities ?? []);
      if (cdekCities.value.length) selectCdekCity(cdekCities.value[0]);
    } finally {
      cdekCityLoading.value = false;
    }
  }, 350);
}, { immediate: true });

const selectCdekCity = async (city: CdekCity) => {
  cdekCityCode.value = city.code;
  cdekTariffs.value = [];
  selectedCdekTariff.value = null;
  cdekDeliveryData.value = null;
  if (!isCdekPickup.value) return;
  cdekPvzLoading.value = true;
  try {
    const pointType = currentCode.value === 'cdek_postamat' ? 'POSTAMAT' : 'PVZ';
    const { data, error } = await useApi<{ points: CdekPvz[] }>('/public/delivery/cdek/pvz', { query: { city_code: city.code, type: pointType } });
    cdekPvzPoints.value = error.value ? [] : (data.value?.points ?? []);
  } finally {
    cdekPvzLoading.value = false;
  }
};

const cdekItems = () => useCartStore().cart.map((item: any) => ({
  name: item.name ?? 'Товар', weight: item.weight ?? 500, price: item.price ?? 0, quantity: item.quantity ?? 1,
}));
const fetchCdekTariffs = async () => {
  if (!cdekCityCode.value || (isCdekPickup.value && !selectedCdekPvzCode.value) || (isCdekCourier.value && !address.value)) return;
  cdekLoading.value = true;
  cdekError.value = '';
  cdekTariffs.value = [];
  selectedCdekTariff.value = null;
  cdekDeliveryData.value = null;
  try {
    const { data, error } = await useApi<{ success: boolean; tariffs: CdekTariff[]; message?: string }>('/public/delivery/cdek/calculate', {
      method: 'POST', body: { delivery_type: currentCode.value === 'cdek_postamat' ? 'postamat' : (isCdekPickup.value ? 'pickup' : 'courier'), destination: { city_code: cdekCityCode.value, address: address.value }, pvz_code: selectedCdekPvzCode.value, items: cdekItems() },
    });
    if (!error.value && data.value?.success) cdekTariffs.value = data.value.tariffs ?? [];
    else cdekError.value = (error.value as any)?.data?.message ?? data.value?.message ?? 'Не удалось рассчитать доставку СДЭК.';
    if (!cdekTariffs.value.length && !cdekError.value) cdekError.value = 'Для указанного адреса нет доступных тарифов СДЭК.';
  } finally {
    cdekLoading.value = false;
  }
};

watch(selectedCdekPvzCode, async (code) => {
  if (!code) return;
  const point = cdekPvzPoints.value.find((item) => item.code === code);
  address.value = point?.location?.address ?? point?.location?.address_full ?? '';
  pvzCode.value = code;
  pvzAddress.value = address.value;
  await fetchCdekTariffs();
});
let cdekCourierTimer: ReturnType<typeof setTimeout> | null = null;
watch([isCdekCourier, cdekCityCode, address], () => {
  if (!isCdekCourier.value || !cdekCityCode.value || !address.value) return;
  if (cdekCourierTimer) clearTimeout(cdekCourierTimer);
  cdekCourierTimer = setTimeout(fetchCdekTariffs, 700);
});
const selectCdekTariff = (tariff: CdekTariff) => {
  selectedCdekTariff.value = tariff;
  const point = cdekPvzPoints.value.find((item) => item.code === selectedCdekPvzCode.value);
  cdekDeliveryData.value = {
    provider: 'cdek', delivery_type: currentCode.value === 'cdek_postamat' ? 'postamat' : (isCdekPickup.value ? 'pickup' : 'courier'), ...tariff,
    destination: { city_code: cdekCityCode.value, address: address.value },
    pvz: point ? { code: point.code, type: point.type, address: point.location?.address ?? point.location?.address_full, coordinates: [point.location?.longitude, point.location?.latitude] } : null,
  };
  freeShipping.setSelected(cdekCandidateKey(tariff), tariff.price);
};

// ─── Бесплатная доставка ──────────────────────────────────────────────────────
// Правила настраиваются в админке (Настройки → Бесплатная доставка).
// Бэкенд говорит, какие из показанных вариантов бесплатны, и сколько не хватает
// до ближайшего порога. См. lara_admin/docs/tasks/free-shipping.md
const freeShipping = useFreeShippingStore();

const cdekCandidateKey = (tariff: CdekTariff) =>
    `cdek:${isCdekPickup.value ? 'pickup' : 'courier'}:${tariff.tariff_code}`;

const yandexCandidateKey = (offer: YandexOffer) =>
    `yandex:${isYandexPickup.value ? 'pickup' : 'courier'}:${offer.offer_id}`;

const freeShippingCandidates = computed(() => {
  const list: Array<{ key: string; service: 'cdek' | 'yandex'; delivery_type: 'pickup' | 'courier'; price: number }> = [];

  cdekTariffs.value.forEach((tariff) => list.push({
    key: cdekCandidateKey(tariff),
    service: 'cdek',
    delivery_type: isCdekPickup.value ? 'pickup' : 'courier',
    tariff_code: tariff.tariff_code,
    price: tariff.price,
  }));

  yandexOffers.value.forEach((offer) => list.push({
    key: yandexCandidateKey(offer),
    service: 'yandex',
    delivery_type: isYandexPickup.value ? 'pickup' : 'courier',
    price: offer.price,
  }));

  return list;
});

const freeShippingHint = computed(() => {
  const progress = freeShipping.progress;
  if (!progress) return '';

  const format = (value: number) => new Intl.NumberFormat('ru-RU').format(Math.ceil(value));

  return `Бесплатная доставка от ${format(progress.min_order_amount)} ₽ — добавьте ещё ${format(progress.remaining)} ₽`;
});

let freeShippingTimer: ReturnType<typeof setTimeout> | null = null;

const evaluateFreeShipping = () => {
  if (freeShippingTimer) clearTimeout(freeShippingTimer);

  freeShippingTimer = setTimeout(() => {
    const cartStore = useCartStore();

    freeShipping.evaluate({
      items: cartStore.getCartForCheckout(),
      candidates: freeShippingCandidates.value,
      paymentMethod: props.paymentMethod ?? null,
      promoCode: props.promoCode ?? null,
      countryId: geoCountryId.value,
      cityId: geoCityId.value,
      country: countryName.value || null,
      region: region.value || null,
      city: cityName.value || null,
    });
  }, 300);
};

watch(
    [
      freeShippingCandidates,
      () => props.paymentMethod,
      () => props.promoCode,
      geoCountryId,
      geoCityId,
      () => useCartStore().total,
    ],
    evaluateFreeShipping,
    { immediate: true },
);

/** Запрашивает тарифы у бэка. */
const fetchYandexOffers = async (params: {
  deliveryType: 'pickup' | 'courier';
  pvzId?: string;
  pvzCoords?: [number, number];
  destination?: { address: string; coordinates: [number, number] };
}) => {
  if (!props.recipient?.phone) {
    yandexOffers.value = [];
    yandexError.value = 'Укажите телефон получателя, чтобы рассчитать Яндекс.Доставку.';
    return;
  }
  if (!hasValidYandexRecipientPhone(props.recipient.phone)) {
    yandexOffers.value = [];
    yandexError.value = 'Введите полный российский номер получателя в формате +7 (999) 123-45-67.';
    return;
  }
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
      recipient: {
        name: [props.recipient?.first_name, props.recipient?.last_name].filter(Boolean).join(' ') || 'Покупатель',
        phone: props.recipient?.phone || '',
        email: props.recipient?.email,
      },
    };
    if (params.pvzId)        body.pvz_id      = params.pvzId;
    if (params.pvzCoords)    body.pvz_coords  = params.pvzCoords;
    if (params.destination)  body.destination = params.destination;

    const { data, error } = await useApi<{ success: boolean; offers: YandexOffer[]; message?: string }>(
        '/public/delivery/yandex/calculate',
        { method: 'POST', body },
    );

    if (!error.value && data.value?.success) {
      yandexOffers.value = data.value.offers ?? [];
      if (!yandexOffers.value.length) {
        yandexError.value = 'Для указанного адреса нет доступных тарифов.';
      }
    } else {
      yandexError.value = (error.value as any)?.data?.message
        ?? data.value?.message
        ?? 'Не удалось рассчитать стоимость доставки.';
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

    courierDestination.value = { address: fullAddr, coordinates: coords };

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
  yandexDeliveryData.value = {
    provider: 'yandex',
    delivery_type: isYandexPickup.value ? 'pickup' : 'courier',
    offer_id: offer.offer_id,
    price: offer.price,
    scheduled_time: offer.delivery_date,
    delivery_interval: offer.delivery_interval,
    pvz: isYandexPickup.value && selectedPvz.value ? {
      id: selectedPvz.value.pvzApiId ?? selectedPvz.value.id,
      address: selectedPvz.value.address,
      coordinates: selectedPvz.value.coordinates,
    } : null,
    destination: isYandexCourier.value ? courierDestination.value : null,
  };
  freeShipping.setSelected(yandexCandidateKey(offer), offer.price);
};

// ─── ПВЗ модалка ──────────────────────────────────────────────────────────────
const showPvzModal = ref(false);
const selectedPvz  = ref<{ id: string; name: string; address: string; pvzApiId?: string; coordinates?: [number, number] } | null>(null);

const onPickOnMap = async () => {
  if (isCdekPickup.value) {
    showCdekPvzModal.value = true;
    return;
  }
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

  // Platform API принимает именно id точки из pickup-points/list.
  const pvzApiId = point.id;

  // Координаты ПВЗ из ответа Platform API
  const coords: [number, number] | undefined = (point.position)
      ? [point.position.longitude, point.position.latitude]
      : undefined;

  selectedPvz.value  = { id: point.id, name: point.name, address: addr, pvzApiId, coordinates: coords };
  address.value      = addr;
  pvzCode.value      = pvzApiId;
  pvzAddress.value   = addr;

  // Сбрасываем прошлый тариф и считаем новые
  selectedYandexOffer.value = null;
  yandexOffer.value         = null;
  yandexDeliveryData.value  = null;

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

// Если способ доставки был выбран раньше телефона, повторяем расчёт сразу после
// ввода номера. До этого fetchYandexOffers намеренно не делает запрос, чтобы не
// отправлять в Яндекс неполные данные получателя.
watch(() => props.recipient?.phone, (phone, previousPhone) => {
  if (!phone || phone === previousPhone || !isYandexDelivery.value) return;

  if (isYandexPickup.value && selectedPvz.value) {
    void fetchYandexOffers({
      deliveryType: 'pickup',
      pvzId: selectedPvz.value.pvzApiId ?? selectedPvz.value.id,
      pvzCoords: selectedPvz.value.coordinates,
    });
    return;
  }

  if (isYandexCourier.value && courierDestination.value) {
    void fetchYandexOffers({
      deliveryType: 'courier',
      destination: courierDestination.value,
    });
  }
});

// ─── Утилиты форматирования ───────────────────────────────────────────────────
const formatDeliveryDate = (date: string): string => {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};

const formatDeliveryInterval = (interval: { from: string; to: string }): string => {
  const formatTime = (date: string): string => {
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime())
      ? date
      : parsed.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return `${formatTime(interval.from)}–${formatTime(interval.to)}`;
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

.checkout__delivery-date {
  @media (max-width: $mobile) {
    margin-top: 1.5rem;
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

  @media (max-width: $mobile) {
    flex: 0 0 auto;
    width: 100%;
  }
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

.checkout__cdek {
  margin-top: 1.5rem;
}

.checkout__cdek-cities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.checkout__cdek-cities .checkout__yandex-offers-title {
  flex-basis: 100%;
  margin-bottom: 0;
}

.checkout__cdek-city {
  border: 1px solid #d5d5d5;
  border-radius: 0.6rem;
  padding: 0.8rem 1rem;
  background: #fff;
  cursor: pointer;
  font-size: var(--fz-small);

  &._selected {
    border-color: var(--color-primary, #000);
    background: #f7f7f7;
  }
}

.checkout__cdek-pvz {
  margin-top: 1.5rem;
}

.checkout__cdek-select {
  display: block;
  width: 100%;
  min-height: 4.8rem;
  padding: 0 1.2rem;
  border: 1px solid #d5d5d5;
  border-radius: 0.6rem;
  background: #fff;
  font: inherit;
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

.checkout__cdek-tariff-original {
  font-size: var(--fz-small);
  color: var(--color-gray, #888);
  margin-top: 0.1rem;
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

/* Бесплатная доставка: зачёркнутый тариф + «Бесплатно» */
.checkout__offer-price-old {
  margin-right: .6rem;
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--color-gray, #888);
  text-decoration: line-through;
}

.checkout__offer-price-free {
  color: var(--fg-green, #2e9c4a);
}

.checkout__free-shipping-hint {
  margin-top: 1rem;
  font-size: var(--fz-small);
  color: var(--color-gray, #888);
}
</style>
