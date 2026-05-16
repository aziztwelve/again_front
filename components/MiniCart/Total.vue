<template>
  <div class="mini-cart__total">
    <span class="mini-cart__total-text">Итого:</span>
    <span class="mini-cart__total-price"><span>{{ getFormatPrice().formattedPrice( cartStore.total ) }}</span> ₽</span>
  </div>
</template>

<script setup lang="ts">
const cartStore = useCartStore();
</script>

<style scoped lang="scss">

</style>