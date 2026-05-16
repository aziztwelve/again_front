<template>
  <!-- Блокировка промокода если акция не разрешает промокоды -->
  <div v-if="promotionStore.hasPromotion && !promotionStore.allowPromoCodes" class="cart__promo">
    <div class="cart__promo-blocked">
      Промокоды и скидки недоступны — действует акция «{{ promotionStore.activePromotion?.name }}»
    </div>
  </div>

  <!-- Блокировка промокода если пользователь выбрал подарок (а не скидку) -->
  <div v-else-if="promotionStore.hasPromotion && promotionStore.allowPromoCodes && promotionStore.userChoice === 'gift'" class="cart__promo">
    <div class="cart__promo-blocked _info">
      Вы выбрали подарок. Чтобы использовать промокод, переключитесь на «Промокод / скидка» выше.
    </div>
  </div>

  <div v-else class="cart__promo">
    <div class="cart__promo-flex">
      <input
          type="text"
          class="cart__promo-input"
          placeholder="Активировать промокод"
          v-model="promoCodeInput"
          :disabled="isLoading || !!cart.promoCode"
          @keyup.enter="checkAndApplyPromoCode"
      >
      <button
          v-if="!cart.promoCode"
          class="cart__promo-button"
          @click="checkAndApplyPromoCode"
          :disabled="isLoading || !promoCodeInput"
      >
        <svg v-if="!isLoading" width="14" height="14" viewBox="0 0 14 14" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <path
              d="M-0.000649004 5.78519L10.0573 5.7852L5.44157 1.16944L6.611 -5.78009e-07L13.2227 6.61165L6.611 13.2233L5.44157 12.0539L10.0573 7.43811L-0.000649149 7.43811L-0.000649004 5.78519Z"
              fill="#3F3F3F"/>
        </svg>
        <span v-else class="loading-spinner"></span>
      </button>
      <button
          v-else
          class="cart__promo-remove"
          @click="removePromoCode"
          title="Удалить промокод"
      >
        ✕
      </button>
    </div>

    <!-- Сообщения -->
    <div v-if="cart.promoMessage" class="cart__promo-message" :class="cart.promoClass">
      {{ cart.promoMessage }}
    </div>

    <!-- Детали промокода -->
    <div v-if="cart.promoCode && cart.promoData" class="cart__promo-details">
      <div class="cart__promo-details-row">
        <span class="label">Промокод:</span>
        <span class="value">{{ cart.promoCode }}</span>
      </div>
      <div class="cart__promo-details-row">
        <span class="label">Скидка по промокоду:</span>
        <span class="value highlight">-{{ getFormatPrice().formattedPrice(cart.promoDiscount) }} ₽</span>
      </div>
      <div v-if="cart.promoData.description" class="cart__promo-description">
        {{ cart.promoData.description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePromotionStore } from '~/stores/promotion';

const cart = useCartStore();
const promotionStore = usePromotionStore();
const promoCodeInput = ref('');
const isLoading = ref(false);

const checkAndApplyPromoCode = async () => {

  console.log(
      'promoCodeInput.value', promoCodeInput.value,
      'isLoading.value', isLoading.value,
      'cart.cart.length', cart.cart.length
  );
  if (!promoCodeInput.value || isLoading.value || cart.cart.length === 0) {
    cart.promoMessage = 'Корзина пуста';
    cart.promoClass = 'error';
    return;
  }

  isLoading.value = true;

  try {
    const params = new URLSearchParams();
    params.append('code', promoCodeInput.value.trim());

    // Собираем товары из корзины
    cart.cart.forEach(item => {
      const productId = item.id;
      const variantId = item?.selected_variant?.id ?? item?.product_variant_id ?? null;

      if (variantId) {
        params.append(`product_ids[${productId}][]`, String(variantId));
      } else {
        params.append(`product_ids[${productId}]`, '');
      }
    });

    const {data, error} = await useApi(`/promo-codes/validate?${params.toString()}`, {});

    if (error.value) {
      cart.promoMessage = error.value.data?.message || 'Промокод недействителен';
      cart.promoClass = 'error';
      cart.promoType = 'error';
      promoCodeInput.value = '';
      return;
    }

    if (data.value && data.value.success) {
      // Применяем промокод к корзине
      const applied = cart.applyPromoToCart(data.value);

      if (!applied) {
        cart.promoMessage = 'Ошибка применения промокода';
        cart.promoClass = 'error';
        return;
      }
    }
  } catch (err) {
    console.error('Promo code error:', err);
    cart.promoMessage = 'Ошибка при проверке промокода';
    cart.promoClass = 'error';
    promoCodeInput.value = '';
  } finally {
    isLoading.value = false;
  }
}

const removePromoCode = () => {
  cart.removePromoFromCart();
  promoCodeInput.value = '';
}

// Синхронизация при монтировании
onMounted(() => {

  const promoCodeLS = localStorage.getItem('promoCode');

  if (cart.promoCode || promoCodeLS) {
    promoCodeInput.value = cart.promoCode || promoCodeLS || ''

    checkAndApplyPromoCode()
  }
});
</script>

<style scoped lang="scss">
.cart__promo-blocked {
  margin-top: 2rem;
  padding: 1.2rem 1.4rem;
  border-radius: 0.8rem;
  font-size: 1.2rem;
  line-height: 1.4;
  background: rgba(211, 47, 47, 0.08);
  border-left: 3px solid #d32f2f;
  color: #c62828;

  &._info {
    background: rgba(33, 150, 243, 0.08);
    border-left-color: #2196F3;
    color: #1565c0;
  }
}

.cart__promo {
  position: relative;
  --height: 6.6rem;
  --bg: rgba(216, 216, 216, .25);
  margin-top: 4rem;

  @media (max-width: $mobile) {
    margin-top: 2rem;
    --height: 5rem;
  }
}

.cart__promo-flex {
  position: relative;
  display: flex;
  align-items: center;
}

.cart__promo-input {
  width: 100%;
  height: var(--height);
  border-radius: 1rem;
  border: none;
  background: var(--bg);
  padding: 0 7rem 0 1.8rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid #3F3F3F;
    outline-offset: 2px;
  }
}

.cart__promo-button,
.cart__promo-remove {
  position: absolute;
  right: 0;
  top: 0;
  height: var(--height);
  min-width: 5.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  box-shadow: inset 0 0 40px 0 rgba(216, 216, 216, 0.25);
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.8;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.cart__promo-remove {
  background: rgba(255, 99, 71, 0.2);
  font-size: 2rem;
  font-weight: bold;
  color: #d32f2f;

  &:hover {
    background: rgba(255, 99, 71, 0.3);
  }
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3F3F3F;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.cart__promo-message {
  margin-top: 1rem;
  padding: 1rem 1.2rem;
  border-radius: 0.6rem;
  font-size: 1.2rem;
  animation: slideDown 0.3s ease-out;

  &.error {
    color: #d32f2f;
    background: rgba(211, 47, 47, 0.1);
    border-left: 3px solid #d32f2f;
  }

  &.success {
    color: #2e7d32;
    background: rgba(46, 125, 50, 0.1);
    border-left: 3px solid #2e7d32;
  }

  &.warning {
    color: #f57c00;
    background: rgba(245, 124, 0, 0.1);
    border-left: 3px solid #f57c00;
  }
}

.cart__promo-details {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(46, 125, 50, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(46, 125, 50, 0.2);
  animation: slideDown 0.3s ease-out;
}

.cart__promo-details-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  font-size: 1.3rem;

  &:last-child {
    margin-bottom: 0;
  }

  .label {
    color: #666;
  }

  .value {
    font-weight: 600;
    color: #2F2F2F;

    &.highlight {
      color: #2e7d32;
      font-size: 1.5rem;
    }
  }
}

.cart__promo-description {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(46, 125, 50, 0.2);
  font-size: 1.2rem;
  color: #666;
  font-style: italic;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>