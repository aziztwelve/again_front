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
.product__description-text {
  // Описание приходит из админки обычным текстом или HTML. Сохраняем переносы
  // строк у текстовых описаний, не меняя уже размеченный HTML.
  white-space: pre-line;
}
</style>
