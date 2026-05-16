<template>
  <div class="product__header">
    <div class="product__sku" v-if="sku">Арт.: {{ sku }}</div>
    <div class="product__rating" v-if="rating">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 0L6.41068 3.05836L9.75528 3.45492L7.28254 5.74164L7.93893 9.04508L5 7.4L2.06107 9.04508L2.71746 5.74164L0.244718 3.45492L3.58932 3.05836L5 0Z" fill="black"/>
      </svg>
      <span>{{ rating }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sku?: string | null,
  rating?: string | null
}>();
</script>

<style scoped lang="scss">

</style>