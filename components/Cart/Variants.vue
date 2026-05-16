<template>
  <div class="checkout-cart__item-variables cart-item__variables" v-if="variant || color">
    <div class="cart-item__variables-item" v-if="color">{{ color.name }}</div>
    <div class="cart-item__variables-item" v-if="variant">{{ variant.size }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  variant?: object,
  color?: object,
}>();
</script>


<style scoped lang="scss">

</style>