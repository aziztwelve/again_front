<template>
  <div class="checkout__gift-card">
    <div class="checkout__gift-card-header">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 7H4V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20 7L18.5 3H5.5L4 7M12 7V21M9 11H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Подарочная карта</span>
    </div>

    <!-- 🆕 НОВОЕ: Предупреждение если есть сертификат -->
    <div v-if="cartStore.hasGiftCertificateInCart" class="checkout__gift-card-warning">
      ⚠️ В корзине есть подарочный сертификат. Оплата другими картами недоступна.
    </div>

    <div class="checkout__gift-card-flex">
      <input
          type="text"
          class="checkout__gift-card-input"
          placeholder="Введите код подарочной карты"
          v-model="giftCardInput"
          :disabled="isLoading || !!giftCardStore.giftCardCode || cartStore.hasGiftCertificateInCart"
          @keyup.enter="checkAndApplyGiftCard"
          @input="giftCardInput = giftCardInput.toUpperCase()"
          maxlength="12"
      >
      <button
          v-if="!giftCardStore.giftCardCode"
          class="checkout__gift-card-button"
          @click="checkAndApplyGiftCard"
          :disabled="isLoading || !giftCardInput || giftCardInput.length !== 12 || cartStore.hasGiftCertificateInCart"
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
          class="checkout__gift-card-remove"
          @click="removeGiftCard"
          title="Удалить карту"
      >
        ✕
      </button>
    </div>

    <!-- Сообщения -->
    <div v-if="giftCardStore.giftCardMessage" class="checkout__gift-card-message" :class="giftCardStore.giftCardClass">
      {{ giftCardStore.giftCardMessage }}
    </div>

    <!-- Детали карты -->
    <div v-if="giftCardStore.giftCardCode && giftCardStore.giftCardData" class="checkout__gift-card-details">
      <div class="checkout__gift-card-details-row">
        <span class="label">Код карты:</span>
        <span class="value code">{{ formatCode(giftCardStore.giftCardCode) }}</span>
      </div>
      <div class="checkout__gift-card-details-row">
        <span class="label">Баланс карты:</span>
        <span class="value">{{ getFormatPrice().formattedPrice(giftCardStore.giftCardBalance) }} ₽</span>
      </div>
      <div class="checkout__gift-card-details-row highlight">
        <span class="label">Будет списано:</span>
        <span class="value">{{ getFormatPrice().formattedPrice(giftCardStore.giftCardAmount) }} ₽</span>
      </div>
      <div v-if="giftCardStore.giftCardBalance > giftCardStore.giftCardAmount" class="checkout__gift-card-details-row">
        <span class="label">Остаток после покупки:</span>
        <span class="value">{{ getFormatPrice().formattedPrice(giftCardStore.giftCardBalance - giftCardStore.giftCardAmount) }} ₽</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';
import { useGiftCardPaymentStore } from '~/stores/giftCardPayment';

const cartStore = useCartStore();
const giftCardStore = useGiftCardPaymentStore();
const giftCardInput = ref('');
const isLoading = ref(false);

const checkAndApplyGiftCard = async () => {
  // Очищаем предыдущие сообщения
  giftCardStore.giftCardMessage = '';
  giftCardStore.giftCardClass = '';

  const cleanCode = giftCardInput.value.trim().toUpperCase();

  if (!cleanCode) {
    giftCardStore.giftCardMessage = 'Введите код карты';
    giftCardStore.giftCardClass = 'error';
    return;
  }

  if (cleanCode.length !== 12) {
    giftCardStore.giftCardMessage = 'Код должен состоять из 12 символов';
    giftCardStore.giftCardClass = 'error';
    return;
  }

  if (cartStore.cart.length === 0) {
    giftCardStore.giftCardMessage = 'Сначала добавьте товары в корзину';
    giftCardStore.giftCardClass = 'error';
    return;
  }

  isLoading.value = true;

  try {
    const success = await giftCardStore.validateGiftCard(
        cleanCode,
        cartStore.cart,
        cartStore.total
    );

    if (!success) {
      giftCardInput.value = '';
    }
  } catch (err) {
    console.error('Gift card error:', err);
    giftCardStore.giftCardMessage = 'Ошибка при проверке карты. Попробуйте позже.';
    giftCardStore.giftCardClass = 'error';
    giftCardInput.value = '';
  } finally {
    isLoading.value = false;
  }
};

const removeGiftCard = () => {
  giftCardStore.removeGiftCard();
  giftCardInput.value = '';
};

const formatCode = (code: string) => {
  return code.match(/.{1,4}/g)?.join('-') || code;
};

// Синхронизация при монтировании
onMounted(() => {
  const giftCardLS = localStorage.getItem('giftCardCode');

  if (giftCardStore.giftCardCode || giftCardLS) {
    giftCardInput.value = giftCardStore.giftCardCode || giftCardLS || '';
    checkAndApplyGiftCard();
  }
});

// Пересчитываем сумму при изменении корзины
watch(() => cartStore.total, () => {
  if (giftCardStore.giftCardCode) {
    giftCardStore.calculateGiftCardAmount(cartStore.total);
  }
});
</script>

<style scoped lang="scss">


.checkout__gift-card-warning {
  margin-bottom: 1.5rem;
  padding: 1rem 1.2rem;
  background: rgba(255, 152, 0, 0.1);
  border-left: 3px solid #ff9800;
  border-radius: 0.6rem;
  color: #f57c00;
  font-size: 1.3rem;
  font-weight: 500;

  @media (max-width: $mobile) {
    font-size: 1.2rem;
  }
}

.checkout__gift-card {
  position: relative;
  --height: 6.6rem;
  --bg: rgba(255, 215, 0, 0.1); // Золотистый оттенок для отличия от промокода
  --border-color: rgba(255, 215, 0, 0.3);
  margin-top: 3rem;
  padding: 2rem;
  background: var(--bg);
  border: 1px solid var(--border-color);
  border-radius: 1.2rem;

  @media (max-width: $mobile) {
    margin-top: 2rem;
    padding: 1.5rem;
    --height: 5rem;
  }
}

.checkout__gift-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  font-size: 1.6rem;
  color: #3F3F3F;

  svg {
    color: #FFB800;
  }

  @media (max-width: $mobile) {
    font-size: 1.4rem;
  }
}

.checkout__gift-card-flex {
  position: relative;
  display: flex;
  align-items: center;
}

.checkout__gift-card-input {
  width: 100%;
  height: var(--height);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: #fff;
  padding: 0 7rem 0 1.8rem;
  font-size: 1.4rem;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &::placeholder {
    text-transform: none;
    letter-spacing: normal;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid #FFB800;
    outline-offset: 2px;
  }

  @media (max-width: $mobile) {
    font-size: 1.2rem;
  }
}

.checkout__gift-card-button,
.checkout__gift-card-remove {
  position: absolute;
  right: 0;
  top: 0;
  height: var(--height);
  min-width: 5.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 215, 0, 0.2);
  box-shadow: inset 0 0 40px 0 rgba(255, 215, 0, 0.15);
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(255, 215, 0, 0.3);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.checkout__gift-card-remove {
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
  border-top: 2px solid #FFB800;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.checkout__gift-card-message {
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
}

.checkout__gift-card-details {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  animation: slideDown 0.3s ease-out;
}

.checkout__gift-card-details-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.3rem;

  &:last-child {
    margin-bottom: 0;
  }

  &.highlight {
    padding: 1rem;
    background: rgba(255, 215, 0, 0.1);
    border-radius: 0.6rem;
    margin-top: 1rem;

    .label, .value {
      font-weight: 700;
      color: #3F3F3F;
    }

    .value {
      font-size: 1.6rem;
      color: #FFB800;
    }
  }

  .label {
    color: #666;
  }

  .value {
    font-weight: 600;
    color: #2F2F2F;

    &.code {
      font-family: monospace;
      letter-spacing: 0.1em;
      color: #FFB800;
    }
  }

  @media (max-width: $mobile) {
    font-size: 1.2rem;

    &.highlight .value {
      font-size: 1.4rem;
    }
  }
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