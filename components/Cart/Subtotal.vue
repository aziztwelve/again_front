<template>
  <div class="cart__subtotal cart-subtotal">
    <div class="cart-subtotal__title">Итого</div>
    <div class="cart-subtotal__price">{{ getFormatPrice().formattedPrice(cart.getFinalTotal()) }} ₽</div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';

const cart = useCartStore();
</script>

<style scoped lang="scss">
.cart__subtotal {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cart__subtotal-title {
  font-weight: 500;
  letter-spacing: -.05rem;
}

.cart__subtotal-price {
  font-size: 2rem;
  font-weight: 300;

  @media (max-width: $mobile) {
    font-size: 1.5rem;
  }
}

</style>