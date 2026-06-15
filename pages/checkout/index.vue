<template>
  <Breadcrumbs/>

  <ClientOnly>
    <div class="checkout">
      <div class="checkout__container container">
        <template v-if="cartStore.cart.length">
          <div class="checkout__form">
            <div class="checkout-block__header block__header _small">
              <div class="block__header-title">Оформление заказа</div>
            </div>
            <div class="checkout__row">

              <div class="checkout__block">
                <!--
                  Авторизованный клиент: показываем «вы вошли как ...».
                  Гость: показываем приглашение войти + поле email (опционально).
                  Имя/фамилия/телефон собираются в CheckoutRecipient ниже.
                -->
                <CheckoutUser
                    v-model:email="form.user.email"
                />
              </div>

              <CheckoutGiftCardData
                  ref="giftCardDataRef"
              />

              <CheckoutDelivery
                  v-model:country-code="form.country_code"
                  v-model:country-name="form.country_name"
                  v-model:city-name="form.city_name"
                  v-model:address="form.delivery_address"
                  v-model:region="form.region"
                  v-model:postal-code="form.postal_code"
                  v-model:entrance="form.entrance"
                  v-model:floor="form.floor"
                  v-model:intercom="form.intercom"
                  v-model:delivery-date="form.delivery_date"
                  v-model:buyer-comment="form.buyer_comment"
                  v-model:delivery-method-id="form.delivery_method_id"
                  v-model:delivery-method-name="form.delivery_method_name"
                  v-model:delivery-method-code="form.delivery_method_code"
                  v-model:yandex-offer="form.yandex_offer"
                  v-model:pvz-code="form.pvz_code"
                  v-model:pvz-address="form.pvz_address"
              />
              <CheckoutRecipient
                  ref="recipientRef"
                  v-model:first-name="form.user.first_name"
                  v-model:last-name="form.user.last_name"
                  v-model:phone="form.user.phone"
              />

              <CheckoutPayment
                  v-model:payment-method="form.payment_method"
                  @click-to-button="onSubmit"
                  :is-loading="isLoading"
                  :error="submitError"
              />
            </div>
          </div>
          <div class="checkout__items">
            <div class="checkout__items-block__header block__header _small">
              <div class="block__header-title">Оформление заказа</div>
            </div>
            <div class="checkout__cart">
              <CheckoutCartItem
                  v-for="item in cartStore.cart"
                  :key="item.id"
                  :product="item"
              />
            </div>
            <div class="checkout__total">
              <CheckoutTotal
                  :with-button="false"
                  v-model:promo-code="form.promo_code"
              />

              <CheckoutGiftCard/>

            </div>
          </div>
        </template>
        <NotFound v-else class="cart__not" :is-title="true" to="/catalog"/>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';
import { useGiftCardPaymentStore } from '~/stores/giftCardPayment';
import { usePromotionStore } from '~/stores/promotion';
import type { Country } from '~/types/countries';
import type { CheckoutForm } from '~/types/order';
import { useCheckoutSubmit } from '~/composables/useCheckoutSubmit';

const cartStore = useCartStore();
const giftCardPaymentStore = useGiftCardPaymentStore();
const promotionStore = usePromotionStore();

// Проверяем применимые акции при загрузке checkout.
// Важно: cartStore.total пересчитывается через cartInit() в app.vue::onMounted,
// который выполняется ПОСЛЕ onMounted этой страницы (child → parent).
// Поэтому здесь нельзя дёргать checkApplicable с total=0 — бэк отфильтрует все акции
// по min_purchase_amount и reset() затрёт уже выставленный selectedGift.
const runPromotionCheck = async () => {
  if (cartStore.cart.length > 0 && cartStore.total > 0) {
    await promotionStore.checkApplicable(cartStore.cart, cartStore.total);
  } else if (cartStore.cart.length === 0) {
    promotionStore.reset();
  }
};

onMounted(async () => {
  await nextTick();
  // Перед показом корзины на чекауте обновляем цены/скидки с бэка.
  // Корзина живёт в localStorage и может содержать «старую» цену
  // (товар был положен до активации скидки) — без рефреша бэк бракует
  // заказ с PRICE_MISMATCH.
  await cartStore.refreshPrices();
  await runPromotionCheck();
});

// Перепроверяем при изменении корзины или total (после cartInit)
watch(() => [cartStore.cart.length, cartStore.total], runPromotionCheck);

const giftCardDataRef = ref<{ validate: () => boolean; $el: HTMLElement } | null>(null);
const recipientRef = ref<{
  selectedCountry: Country | null,
  setPhoneError: (msg: string) => void,
  $el: HTMLElement
} | null>(null);

// Поля получателя НЕ префиллим профилем: в Recipient.vue есть чекбокс
// «Получатель — я сам», который подставляет данные авторизованного юзера.
// Так юзер сам решает, на кого оформлять заказ.
const form = reactive<CheckoutForm>({
  promo_code: cartStore.promoCode,
  gift_card_data: '',
  gift_card_code: giftCardPaymentStore.giftCardCode,
  user: {
    first_name: '',
    last_name: '',
    phone: '',
    // Email опционален. Используется только для гостевого заказа (для отправки
    // чека/ссылки на /orders/{view_token}). Для авторизованного клиента
    // подтягивается на бэкенде из его профиля.
    email: '',
  },
  country_code: '',
  country_name: '',
  city_name: '',
  delivery_address: '',
  region: '',
  postal_code: '',
  entrance: '',
  floor: '',
  intercom: '',
  delivery_date: '',
  buyer_comment: '',
  delivery_method_id: null,
  delivery_method_name: '',
  delivery_method_code: '',
  payment_method: '',
  yandex_offer: null,
  pvz_code: null,
  pvz_address: null,
});

// Вся валидация + сборка payload'а + POST живут в composable.
// Здесь только связка с DOM (refs + scrollIntoView).
const { isLoading, submitError, submit } = useCheckoutSubmit({
  form,
  getSelectedCountry: () => recipientRef.value?.selectedCountry ?? null,
  setPhoneError: (msg) => recipientRef.value?.setPhoneError(msg),
  getRecipientEl: () => recipientRef.value?.$el ?? null,
  validateGiftCardData: () => giftCardDataRef.value?.validate() ?? true,
  getGiftCardDataEl: () => giftCardDataRef.value?.$el ?? null,
});

const onSubmit = async () => {
  const result = await submit();
  if (!result.success) return;

  // Редирект на публичную страницу заказа по view_token —
  // работает и для гостя (нет /orders/{id} без авторизации).
  if (result.viewToken) {
    return navigateTo('/orders/' + result.viewToken);
  }
  // Фолбэк: старая success-страница (для совместимости со старыми сборками).
  if (result.orderId) {
    return navigateTo('/success?id=' + result.orderId);
  }
  // Если бэк зачем-то вернул success без идентификаторов — ведём в корзину,
  // чтобы юзер хоть что-то увидел.
  return navigateTo('/cart');
};
</script>

<style scoped lang="scss">
.checkout__message__btn {
  margin-top: 2rem;
}
</style>
