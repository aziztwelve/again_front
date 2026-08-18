<template>
  <!--
    Прогресс до бесплатной доставки. Порог и условия задаются в админке
    (Настройки → Бесплатная доставка), считает бэкенд — см.
    lara_admin/docs/tasks/free-shipping.md
    Если подходящих правил нет (или порог уже взят по всем) — блок скрыт.
  -->
  <div v-if="progress" class="cart__progress cart-progress">
    <div class="cart-progress__title">
      <span class="cart-progress__text">До бесплатной доставки осталось</span>
      <strong class="cart-progress__price"><span>{{ formattedRemaining }}</span> ₽</strong>
    </div>
    <div class="cart-progress__line">
      <div :style="{ '--width': widthPercent }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();
const freeShipping = useFreeShippingStore();

const progress = computed(() => freeShipping.progress);

const formattedRemaining = computed(() =>
    new Intl.NumberFormat('ru-RU').format(Math.ceil(progress.value?.remaining ?? 0)),
);

const widthPercent = computed(() => {
  const item = progress.value;
  if (!item || !item.min_order_amount) return '0%';

  const ratio = Math.min(1, item.qualifying_amount / item.min_order_amount);

  return `${Math.round(ratio * 100)}%`;
});

let timer: ReturnType<typeof setTimeout> | null = null;

const refresh = () => {
  if (timer) clearTimeout(timer);

  timer = setTimeout(() => {
    freeShipping.evaluate({
      items: cartStore.getCartForCheckout(),
      candidates: [],
      promoCode: cartStore.promoCode || null,
    });
  }, 300);
};

onMounted(refresh);

// Корзина пересчитывается асинхронно (cartInit в app.vue) — следим за суммой.
watch(() => [cartStore.cart.length, cartStore.total], refresh);
</script>

<style scoped lang="scss">
.cart-progress {

}

.cart-progress__title {
  display: flex;
  align-items: flex-end;
  font-size: 1.2rem;
  line-height: normal;
  color: #202020;

  @media (max-width: $mobile) {
    font-size: 1rem;
  }
}

.cart-progress__price {
  margin-left: .5rem;
  font-size: 1.6rem;

  @media (max-width: $mobile) {
    font-size: 1.3rem;
  }
}

.cart-progress__line {
  position: relative;
  height: 1rem;
  width: 100%;
  background: #F0F0F0;
  border-radius: 2rem;
  overflow: hidden;
  margin-top: 1.6rem;

  & div {
    width: var(--width);
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: var(--fg-red);
    border-radius: 2rem;
  }

  @media (max-width: $mobile) {
    margin-top: 1rem;
    height: .5rem;
  }
}

</style>
