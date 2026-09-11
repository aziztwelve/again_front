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
  font-family: inherit;

  // Global storefront styles use a decorative font for headings. Product
  // content from the editor should keep the same readable font as its text.
  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    font-family: inherit;
  }

  :deep(img),
  :deep(video),
  :deep(iframe) {
    max-width: 100%;
  }

  :deep(img) {
    height: auto;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
  }

  :deep(th),
  :deep(td) {
    padding: .6rem;
    border: 1px solid #d7d7d7;
  }
}
</style>
