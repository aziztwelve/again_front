<template>
  <div class="cart__total" :class="{ '_border': isBorder }">
    <div class="cart__total-top">
      <div class="cart__summary cart-summary">
        <!-- Промежуточный итог -->
        <div class="cart-summary__item">
          <span class="cart-summary__item-title">Всего</span>
          <span class="cart-summary__item-price">{{ getFormatPrice().formattedPrice(cart.subtotal) }} ₽</span>
        </div>

        <!-- Скидка на товары -->
        <div class="cart-summary__item" v-if="cart.regularDiscount > 0">
          <span class="cart-summary__item-title">Скидка на товары</span>
          <span class="cart-summary__item-price discount">-{{ getFormatPrice().formattedPrice(cart.regularDiscount) }} ₽</span>
        </div>

        <!-- Скидка по промокоду -->
        <div class="cart-summary__item" v-if="cart.promoDiscount > 0">
          <span class="cart-summary__item-title promo">Промокод</span>
          <span class="cart-summary__item-price discount promo">-{{ getFormatPrice().formattedPrice(cart.promoDiscount) }} ₽</span>
        </div>

        <!-- 🆕 НОВОЕ: Подарочная карта -->
        <div class="cart-summary__item" v-if="giftCardStore.giftCardAmount > 0">
          <span class="cart-summary__item-title gift-card">Подарочная карта</span>
          <span class="cart-summary__item-price discount gift-card">-{{ getFormatPrice().formattedPrice(giftCardStore.giftCardAmount) }} ₽</span>
        </div>
      </div>
    </div>

    <div class="cart__total-bottom">
      <CartSubtotal/>

      <!-- 🆕 НОВОЕ: Уведомление если полностью оплачено картой -->
      <div v-if="giftCardStore.giftCardAmount > 0 && cart.getFinalTotal() === 0" class="cart__total-message success">
        🎉 Заказ полностью оплачен подарочной картой!
      </div>

      <!-- 🆕 НОВОЕ: Остаток к оплате -->
      <div v-if="giftCardStore.giftCardAmount > 0 && cart.getFinalTotal() > 0" class="cart__total-message info">
        💳 Остаток {{ getFormatPrice().formattedPrice(cart.getFinalTotal()) }} ₽ будет оплачен картой/СБП
      </div>

      <NuxtLink v-if="withButton" to="/checkout" class="cart__checkout btn _wide _15 _60">Оформить заказ</NuxtLink>
      <CartPromotion />
      <CartPromocode v-if="isPromocode"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';
import { useGiftCardPaymentStore } from '~/stores/giftCardPayment';

withDefaults(defineProps<{
  isBorder?: boolean,
  isPromocode?: boolean,
  withButton?: boolean
}>(), {
  isBorder: false,
  isPromocode: true,
  withButton: true
});

const cart = useCartStore();
const giftCardStore = useGiftCardPaymentStore();
</script>

<style scoped lang="scss">

.cart__promo-message {
  margin-top: 1rem;
  font-size: 1.2rem;

  &--error {
    color: var(--fg-red);
  }

  &--success {
    color: var(--fg-green);
  }
}

.cart__total {
  border-radius: var(--br-regular);
  border: .1rem solid #E5E5E5;

  &-top {
    padding: 3.2rem 2.7rem 3rem;

    @media (max-width: $tablet) {
      padding: 1.6rem 1.5rem 2.1rem;
    }
  }

  &-bottom {
    padding: 2.3rem 2.7rem 3.8rem 2.8rem;
    border-top: .1rem solid #E5E5E5;

    @media (max-width: $tablet) {
      padding: 1.7rem 1.7rem 2.5rem 1.5rem;
    }
  }

  @media (max-width: $tablet) {
    &:not(._border) {
      margin-left: var(--m-m-container);
      margin-right: var(--m-m-container);
      border-radius: 0;
      padding: 2.4rem var(--p-container) 2rem;
      background: #F6F5F3;
      border: none;
    }
  }
}

@media (max-width: $tablet) {
  .cart__total:not(._border) .cart__total-top {
    padding: 0;
  }

  .cart__total:not(._border) .cart__total-bottom {
    padding: 0;
    border: none;
    margin-top: 2rem;
  }
}

.cart-summary__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.8rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.cart-summary__item-title {
  color: #2F2F2F;
  opacity: .7;
  font-size: var(--fz-secondary);
}

.cart-summary__item-price {
  font-weight: 300;
  line-height: var(--fz-regular);
  font-size: var(--fz-regular);
}

.cart__checkout {
  margin-top: 3.5rem;
}


.cart-summary__item-title {
  &.promo {
    color: #2e7d32;
  }

  &.gift-card {
    color: #FFB800;
    font-weight: 600;
  }
}

.cart-summary__item-price {
  &.discount {
    color: var(--fg-red, #d32f2f);

    &.promo {
      color: #2e7d32;
    }

    &.gift-card {
      color: #FFB800;
      font-weight: 600;
    }
  }
}

.cart__total-message {
  margin-top: 1.5rem;
  padding: 1rem 1.2rem;
  border-radius: 0.6rem;
  font-size: 1.2rem;
  line-height: 1.4;

  &.success {
    background: rgba(46, 125, 50, 0.1);
    border-left: 3px solid #2e7d32;
    color: #2e7d32;
    font-weight: 600;
  }

  &.info {
    background: rgba(255, 215, 0, 0.1);
    border-left: 3px solid #FFB800;
    color: #666;
  }

  @media (max-width: $tablet) {
    font-size: 1.1rem;
    padding: 0.8rem 1rem;
  }
}



.cart-summary__item-title {
  &.promo {
    color: #2e7d32;
  }

  &.gift-card {
    color: #FFB800;
    font-weight: 600;
  }
}

.cart-summary__item-price {
  &.discount {
    color: var(--fg-red, #d32f2f);

    &.promo {
      color: #2e7d32;
    }

    &.gift-card {
      color: #FFB800;
      font-weight: 600;
    }
  }
}

.cart__total-message {
  margin-top: 1.5rem;
  padding: 1rem 1.2rem;
  border-radius: 0.6rem;
  font-size: 1.2rem;
  line-height: 1.4;

  &.success {
    background: rgba(46, 125, 50, 0.1);
    border-left: 3px solid #2e7d32;
    color: #2e7d32;
    font-weight: 600;
  }

  &.info {
    background: rgba(255, 215, 0, 0.1);
    border-left: 3px solid #FFB800;
    color: #666;
  }

  @media (max-width: $tablet) {
    font-size: 1.1rem;
    padding: 0.8rem 1rem;
  }
}
</style>