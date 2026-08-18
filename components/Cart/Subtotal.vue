<template>
  <div class="cart__subtotal cart-subtotal">
    <div class="cart-subtotal__title">Итого</div>
    <div class="cart-subtotal__price">{{ getFormatPrice().formattedPrice(total) }} ₽</div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';

const props = withDefaults(defineProps<{
  /**
   * Учитывать стоимость доставки (только на чекауте, где тариф уже выбран).
   * Бесплатная доставка приходит из правил — см.
   * lara_admin/docs/tasks/free-shipping.md
   */
  withDelivery?: boolean
}>(), {
  withDelivery: false,
});

const cart = useCartStore();
const freeShipping = useFreeShippingStore();

const total = computed(() => {
  const base = cart.getFinalTotal();

  if (!props.withDelivery || freeShipping.deliveryCost === null) return base;

  return base + freeShipping.deliveryCost;
});
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
