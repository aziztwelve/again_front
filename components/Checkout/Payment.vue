<template>
  <div class="checkout__block">
    <div class="checkout__block-title fz-h2">Способ оплаты*</div>
    <div class="checkout__payment">
      <FormRadio
          v-for="opt in paymentOptions"
          :key="opt.code"
          name="payment"
          :title="opt.title"
          :text="opt.text"
          :checked="paymentMethod === opt.code"
          @click="selectPayment(opt)"
      />
    </div>
    <div class="checkout__submit">
      <p v-if="error" class="checkout__submit-error" role="alert">{{ error }}</p>
      <button
          class="checkout__btn btn _loader"
          @click="emit('clickToButton')"
          :class="{ '_loading': isLoading }"
          :disabled="isDisabled || isLoading"
      >
        Подтвердить заказ
      </button>
      <div class="space-y-4">
        <FormCheckbox
            class="form__policy"
            name="privacy_policy"
            :label="getPrivacyPolicyLink()"
            v-model="isCheckedPolicy"
        />

        <FormCheckbox
            class="form__personal-data-consent"
            name="personal_data_consent"
            :label="getPersonalDataConsentLink()"
            v-model="isCheckedPersonalDataConsent"
        />

        <FormCheckbox
            class="form__oferta"
            name="oferta"
            :label="getOfertaLink()"
            v-model="isCheckedOferta"
        />

        <FormCheckbox
            class="form__marketing"
            name="marketing_consent"
            :label="getMarketingConsentLink()"
            v-model="isCheckedMarketing"
        />

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getMarketingConsentLink,
  getPersonalDataConsentLink,
  getPrivacyPolicyLink,
  getOfertaLink,
} from '~/utils/getPolicyLink';
import { PAYMENT_OPTIONS, ROBOKASSA_OPTION, type PaymentOption } from '~/constants/payment';

withDefaults(defineProps<{
  isLoading?: boolean,
  error?: string,
}>(), {
  isLoading: false,
  error: '',
});

const emit = defineEmits(['clickToButton']);
const isDisabled = ref(true);

const paymentMethod = defineModel<string>('paymentMethod');

// Список — единый источник правды (см. ~/constants/payment.ts). Тот же
// справочник используется в pages/orders/[token].vue для маппинга кода
// в человекочитаемое название.
// Robokassa показываем только если бэкенд разрешил этому покупателю
// (закрытый тест по списку email; пустой список на бэке — способ виден всем).
// Запрос только в браузере: ответ зависит от токена покупателя.
const authStore = useAuthStore();
const { data: extraOptions, refresh: refreshExtraOptions } = await useApi<{ success: boolean; robokassa: boolean }>(
  '/public/checkout/payment-options',
  { server: false, key: 'checkout-payment-options' },
);

const paymentOptions = computed<PaymentOption[]>(() => {
  if (extraOptions.value?.robokassa !== true) return PAYMENT_OPTIONS;
  const [first, ...rest] = PAYMENT_OPTIONS;
  return [first, ROBOKASSA_OPTION, ...rest];
});

// Вошёл или вышел — список мог измениться.
watch(() => authStore.token, () => refreshExtraOptions());

// Выбранный способ пропал из списка (например, вышли из аккаунта) — берём первый.
watch(paymentOptions, (options) => {
  if (paymentMethod.value && !options.some((o) => o.code === paymentMethod.value)) {
    selectPayment(options[0]);
  }
});

const selectPayment = (opt: PaymentOption) => {
  paymentMethod.value = opt.code;
};

// Преселектим первую опцию.
onMounted(() => {
  if (!paymentMethod.value) {
    selectPayment(paymentOptions.value[0]);
  }
});

const isCheckedPolicy = defineModel<boolean>('privacyPolicyAccepted', { required: true });
const isCheckedPersonalDataConsent = defineModel<boolean>('personalDataConsent', { required: true });
const isCheckedOferta = defineModel<boolean>('ofertaAccepted', { required: true });
const isCheckedMarketing = defineModel<boolean>('subscribedToNewsletter', { required: true });

// Первые три галочки обязательны: без них кнопка «Подтвердить заказ»
// неактивна. Согласие на рассылку — добровольное.
watch([isCheckedPolicy, isCheckedPersonalDataConsent, isCheckedOferta], ([policyAccepted, personalDataAccepted, ofertaAccepted]) => {
  isDisabled.value = !policyAccepted || !personalDataAccepted || !ofertaAccepted;
}, {
  immediate: true,
});
</script>

<style scoped lang="scss">
.checkout__payment {
  & > .form__row + .form__row {
    margin-top: 1.2rem;
  }
}

.checkout__submit-error {
  margin: 0 0 1.2rem 0;
  padding: 1.2rem 1.6rem;
  border: 1px solid #f5c6cb;
  border-radius: .8rem;
  background: #fde4e6;
  color: #842029;
  font-size: 1.4rem;
  line-height: 1.4;
}
</style>
