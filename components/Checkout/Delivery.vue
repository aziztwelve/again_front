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
          :selected-id="useMyAddress ? userStore.user?.profile?.delivery_country_id : undefined"
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
      <FormInput
          name="address"
          placeholder="Адрес*"
          v-model="address"
      />

      <div class="checkout__delivery-extras">
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
          name="delivery_date"
          placeholder="Желаемая дата доставки"
          v-model="deliveryDate"
      />

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
          <button
              v-if="canPickOnMap"
              type="button"
              class="checkout__delivery-map-btn btn _border _thin"
              @click="onPickOnMap"
          >
            Выбрать на карте
          </button>
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
  </div>
</template>

<script setup lang="ts">
import type { Cities, Countries } from "~/types/countries";

interface DeliveryMethod {
  id: number,
  name: string,
  delivery_type_code?: string,
  description?: string,
  is_active?: boolean,
}

const userStore = useAuthStore();
const countryId = ref(0);

// Двухсторонние связки с родителем (pages/checkout/index.vue):
const countryCode = defineModel('countryCode');
const countryName = defineModel('countryName');
const cityName = defineModel('cityName');
const address = defineModel('address');
const region = defineModel('region');
const postalCode = defineModel('postalCode');
const entrance = defineModel('entrance');
const floor = defineModel('floor');
const intercom = defineModel('intercom');
const deliveryDate = defineModel<string | number>('deliveryDate');
const buyerComment = defineModel('buyerComment');
const deliveryMethodId = defineModel<number | null>('deliveryMethodId');
const deliveryMethodName = defineModel<string>('deliveryMethodName');
const deliveryMethodCode = defineModel<string>('deliveryMethodCode');

// FormSelect эмитит { name: <form-поле>, id, title, code }.
// Здесь нужен именно `title` (название страны/города), а не `name`
// (там просто имя поля формы, типа "country"/"city").
const setCountry = (object: any) => {
  countryCode.value = object.code;
  countryName.value = object.title ?? object.name ?? object.code;
  countryId.value = object.id;
};

const setCity = (object: any) => {
  cityName.value = object.title ?? object.name;
};

// Чекбокс «Доставка по моему адресу». По умолчанию выключен.
// При включении подставляем страну/город/индекс/адрес из профиля,
// при выключении — обнуляем, чтобы юзер ввёл данные вручную.
const useMyAddress = ref(false);
const hasProfileAddress = computed(() => {
  const p = userStore.user?.profile;
  return !!(p?.delivery_country_id || p?.delivery_city_id || p?.delivery_address);
});

watch(useMyAddress, (checked) => {
  const p = userStore.user?.profile;
  if (checked && p) {
    address.value = p.delivery_address || '';
    postalCode.value = p.delivery_postal_code || '';
    // countryId триггерит подгрузку списка городов (watch: [countryId]).
    // После remount FormSelect-ов :selected-id подставит значения
    // из профиля → setCountry/setCity сработают автоматически.
    if (p.delivery_country_id) {
      countryId.value = p.delivery_country_id;
    }
  } else {
    address.value = '';
    postalCode.value = '';
    region.value = '';
    countryCode.value = '';
    countryName.value = '';
    cityName.value = '';
    countryId.value = 0;
  }
});

const selectDeliveryMethod = (method: DeliveryMethod) => {
  deliveryMethodId.value = method.id;
  deliveryMethodName.value = method.name;
  deliveryMethodCode.value = method.delivery_type_code ?? '';
};

// FormSelect эмитит { name, id, title, code } — резолвим обратно в DeliveryMethod
// и переиспользуем существующую логику записи в модели формы.
const onDeliveryMethodSelected = (object: { id: number, title?: string, code?: string }) => {
  const method = deliveryMethodsList.value.find(m => m.id === object.id);
  if (method) {
    selectDeliveryMethod(method);
  }
};

const { data: countries } = await useCountries();
const { data: cities } = await useApi<Cities>('/countries/cities', {
  query: {
    country_id: countryId,
  },
  watch: [countryId],
});

// Загружаем активные методы доставки. Список не зависит от адреса —
// для расчёта стоимости отдельно вызывается /api/delivery/calculate.
// Используем публичный эндпоинт /public/delivery/methods — он доступен
// и гостям, и авторизованным пользователям (в отличие от
// /delivery/methods/admin, который защищён admin-мидлварью и для гостя
// возвращает 401/403). Публичные роуты у Laravel все живут под /api/public/*.
const { data: deliveryMethods } = await useApi<{
  data: DeliveryMethod[],
  meta: { total_methods: number }
}>('/public/delivery/methods', {
  query: { active: 1 },
});

const deliveryMethodsList = computed<DeliveryMethod[]>(
    () => deliveryMethods.value?.data ?? []
);

// Коды методов доставки, для которых нужен выбор пункта выдачи на карте.
// Список синхронизирован с админкой (vue-admin/.../OrderCreate.vue).
const MAP_PICK_DELIVERY_CODES = [
  'cdek_pickup',
  'yandex_pickup',
  'russian_post_office',
  'russian_post_on_demand',
];

const selectedDeliveryMethod = computed<DeliveryMethod | null>(
    () => deliveryMethodsList.value.find(m => m.id === deliveryMethodId.value) ?? null
);

const canPickOnMap = computed(() =>
    MAP_PICK_DELIVERY_CODES.includes(selectedDeliveryMethod.value?.delivery_type_code ?? '')
);

// TODO: открыть модалку с картой и выбором ПВЗ. Пока — заглушка,
// аналогичная админке (vue-admin OrderCreate.vue → onPickOnMap).
const onPickOnMap = () => {
  if (import.meta.client) {
    window.alert('Выбор пункта выдачи на карте будет добавлен позже.');
  }
};

// Преселектим первый метод, чтобы пользователь не получал ошибку
// «Способ доставки обязателен», если просто не дотянулся до радио-кнопок.
watch(deliveryMethodsList, (list) => {
  if (list.length && !deliveryMethodId.value) {
    selectDeliveryMethod(list[0]);
  }
}, { immediate: true });
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

  & > .form__row + .form__row {
    margin-top: 1.2rem;
  }
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

// Селект не растягиваем во всю ширину строки: иначе кнопка «Выбрать на карте»
// уезжает в правый край. Ограничиваем разумным max-width, чтобы кнопка стояла
// прямо рядом с селектом.
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

  @media (max-width: $mobile) {
    width: 100%;
  }
}

.checkout__delivery-comment {
  margin-top: 3.3rem;
}
</style>
