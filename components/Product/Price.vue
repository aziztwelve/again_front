<template>
  <div class="product__price" v-if="price">
    <div class="product__price-new">{{ formattedPrice( price ) }} ₽</div>
    <div class="product__price-old" v-if="oldPrice">{{ formattedPrice( oldPrice ) }} ₽</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  price: number,
  oldPrice?: number,
}>();

const { formattedPrice } = getFormatPrice();
</script>

<style scoped lang="scss">

</style>