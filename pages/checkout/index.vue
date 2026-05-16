<template>
  <Breadcrumbs/>

  <ClientOnly>
    <div class="checkout">
      <div class="checkout__container container">
        <div class="checkout__message" v-if="!userStore.isAuthenticated">
          <h2 class="checkout__message-title">Для оформления заказа требуется авторизоваться</h2>
          <NuxtLink to="/login" class="checkout__message__btn btn _left">Авторизоваться</NuxtLink>
        </div>
        <template v-else-if="cartStore.cart.length">
          <div class="checkout__form">
            <div class="checkout-block__header block__header _small">
              <div class="block__header-title">Оформление заказа</div>
            </div>
            <div class="checkout__row">

              <div class="checkout__block">
                <CheckoutUser/>
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
              />
              <CheckoutRecipient
                  ref="recipientRef"
                  v-model:first-name="form.user.first_name"
                  v-model:last-name="form.user.last_name"
                  v-model:phone="form.user.phone"
              />

              <CheckoutPayment
                  v-model:payment-method="form.payment_method"
                  @click-to-button="submit"
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
        <NotFound v-else-if="cartStore.cart.length === 0" class="cart__not" :is-title="true" to="/catalog"/>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import {useCartStore} from '~/stores/cart';
import {useAuthStore} from '~/stores/auth';
import {useGiftCardPaymentStore} from '~/stores/giftCardPayment';
import {useGiftCardPurchaseStore} from '~/stores/giftCardPurchase';
import {usePromotionStore} from '~/stores/promotion';
import type {Country} from "~/types/countries";

const cartStore = useCartStore();
const userStore = useAuthStore();
const giftCardPaymentStore = useGiftCardPaymentStore();
const giftCardPurchaseStore = useGiftCardPurchaseStore();
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
  await runPromotionCheck();
});

// Перепроверяем при изменении корзины или total (после cartInit)
watch(() => [cartStore.cart.length, cartStore.total], runPromotionCheck);
const isLoading = ref(false);
const submitError = ref('');
const giftCardDataRef = ref(null);

const recipientRef = ref<{
  selectedCountry: Country | null,
  setPhoneError: (msg: string) => void,
  $el: HTMLElement
} | null>(null);

// Форма — обычный ref, без обёртки computed/ref-ом-в-ref-е.
// Поля получателя НЕ префиллим профилем: в Recipient.vue есть чекбокс
// «Получатель — я сам», который подставляет данные авторизованного юзера.
// Так юзер сам решает, на кого оформлять заказ.
const form = reactive({
  promo_code: cartStore.promoCode,
  gift_card_data: '',
  gift_card_code: giftCardPaymentStore.giftCardCode,
  user: {
    first_name: '',
    last_name: '',
    phone: '',
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
  delivery_date: '' as string | number,
  buyer_comment: '',
  delivery_method_id: null as number | null,
  delivery_method_name: '',
  delivery_method_code: '',
  payment_method: '',
});


const validateRecipientPhone = () => {
  const selectedCountry = recipientRef.value?.selectedCountry ?? null;

  if (!selectedCountry || !form.user.phone) {
    return true;
  }

  const { validatePhoneLength } = usePhoneMask();
  const isPhoneValid = validatePhoneLength(
      form.user.phone,
      selectedCountry.phone_code,
      selectedCountry.phone_length
  );

  if (!isPhoneValid) {
    recipientRef.value?.setPhoneError(`Номер должен содержать ${selectedCountry.phone_length} цифр`);
    recipientRef.value?.$el?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    return false;
  }

  recipientRef.value?.setPhoneError('');
  return true;
};


const showError = async (msg: string) => {
  submitError.value = msg;
  await nextTick();
  // Скроллим к самой ошибке (она теперь рендерится прямо над кнопкой
  // «Подтвердить заказ» внутри CheckoutPayment).
  document
      .querySelector('.checkout__submit-error')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// Склеивает список отсутствующих полей в человеко-читаемую фразу:
// ['адрес доставки']                       → 'Заполните адрес доставки'
// ['страну', 'адрес доставки']             → 'Заполните страну и адрес доставки'
// ['страну', 'город', 'адрес доставки']    → 'Заполните страну, город и адрес доставки'
const joinMissing = (parts: string[]) => {
  if (parts.length <= 1) return `Заполните ${parts[0] ?? ''}`.trim();
  const head = parts.slice(0, -1).join(', ');
  const tail = parts[parts.length - 1];
  return `Заполните ${head} и ${tail}`;
};

const submit = async () => {
  submitError.value = '';

  // Валидация данных сертификата (если есть в корзине)
  if (cartStore.hasGiftCertificateInCart) {
    const isValid = giftCardDataRef.value?.validate();
    if (!isValid) {
      giftCardDataRef.value?.$el?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
  }


  // Валидация телефона
  if (!validateRecipientPhone()) {
    return;
  }

  // Минимальные проверки обязательных полей до отправки на бэк.
  // Показываем только реально пустые поля, а не общий текст.
  const missing: string[] = [];
  if (!form.country_name) missing.push('страну');
  if (!form.city_name) missing.push('город');
  if (!form.delivery_address) missing.push('адрес доставки');
  if (!form.user.first_name) missing.push('имя');
  if (!form.user.last_name) missing.push('фамилию');
  if (!form.user.phone) missing.push('телефон');
  if (missing.length) {
    await showError(joinMissing(missing));
    return;
  }

  // Если активна акция и клиент выбрал подарок (а не скидку),
  // требуем выбор размера/варианта у подарков с вариативностью.
  if (promotionStore.hasPromotion && !promotionStore.isGiftSelectionComplete) {
    await showError('Пожалуйста, выберите вариант для подарка по акции');
    const promoEl = document.querySelector('.cart__promotion');
    if (promoEl) {
      promoEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  isLoading.value = true;

  // Получатель и контактная информация — берём из формы профиля.
  // Если в будущем понадобится разделить «заказчик» и «получатель» —
  // сделаем отдельный блок с собственной валидацией.
  const deliveryAddress: Record<string, any> = {
    country: form.country_name,
    city: form.city_name,
    address: form.delivery_address,
  };
  if (form.region) deliveryAddress.region = form.region;
  if (form.postal_code) deliveryAddress.postal_code = form.postal_code;
  if (form.entrance) deliveryAddress.entrance = form.entrance;
  if (form.floor) deliveryAddress.floor = form.floor;
  if (form.intercom) deliveryAddress.intercom = form.intercom;
  if (form.delivery_date) deliveryAddress.delivery_date = form.delivery_date;
  if (form.buyer_comment) deliveryAddress.buyer_comment = form.buyer_comment;

  const requestData: Record<string, any> = {
    promo_code: form.promo_code,
    gift_card_code: form.gift_card_code,
    items: cartStore.getCartForCheckout(),
    user: { ...form.user },
    recipient: { ...form.user },
    delivery_address: deliveryAddress,
  };

  if (form.payment_method) {
    requestData.payment_method = form.payment_method;
  }

  if (form.delivery_method_name) {
    requestData.delivery_method = { name: form.delivery_method_name };
  }

  if (cartStore.hasGiftCertificateInCart) {
    requestData.gift_card_data = giftCardPurchaseStore.getDataForAPI(
        userStore.user?.email,
        userStore.user?.profile?.phone
    );
  }

  // Акция (если активна)
  if (promotionStore.hasPromotion) {
    const promotionData = promotionStore.getDataForOrder();
    Object.assign(requestData, promotionData);

    if (!promotionStore.useDiscountInstead) {
      delete requestData.promo_code;
    }
  }

  const {data, error} = await useApi('/orders', {
    body: requestData
  }, '', 'POST');

  isLoading.value = false;

  if (data.value?.success === true) {
    cartStore.setEmptyCart();
    promotionStore.reset();
    return navigateTo('/success?id=' + data.value.order.id);
  }

  // Ошибка от бэка — показываем пользователю + скроллим к ней
  const payload: any = error.value?.data ?? data.value;
  let message = 'Не удалось оформить заказ';
  if (payload?.errors && typeof payload.errors === 'object') {
    const messages = Object.values(payload.errors).flat() as string[];
    message = messages[0] || payload.message || message;
  } else if (payload?.message) {
    message = payload.message;
  }
  await showError(message);
  console.error('Order error:', error.value ?? data.value);
}




</script>

<style scoped lang="scss">
.checkout__message__btn {
  margin-top: 2rem;
}
</style>