<template>
  <div class="product__description">
    <h2 class="product__description-title fz-h2">Описание</h2>
    <div class="product__description-text text__content" v-html="text"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>();
</script>

<style scoped lang="scss">

</style>