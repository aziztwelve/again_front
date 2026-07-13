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
          :disabled="isDisabled"
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
import { getMarketingConsentLink, getPrivacyPolicyLink, getOfertaLink } from '~/utils/getPolicyLink';
import { PAYMENT_OPTIONS, type PaymentOption } from '~/constants/payment';

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
const paymentOptions = PAYMENT_OPTIONS;

const selectPayment = (opt: PaymentOption) => {
  paymentMethod.value = opt.code;
};

// Преселектим первую опцию.
onMounted(() => {
  if (!paymentMethod.value) {
    selectPayment(paymentOptions[0]);
  }
});

const isCheckedPolicy = ref(false);
const isCheckedOferta = ref(false);
const isCheckedMarketing = ref(false);

watch(isCheckedPolicy, (newValue) => {
  isDisabled.value = !newValue;
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
