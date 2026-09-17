<template>
  <div class="product__description">
    <h2 class="product__description-title fz-h2">Описание</h2>
    <div
      class="product__description-text text__content"
      :class="{'product__description-text--plain': !containsHtml}"
      v-html="text"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'

const props = defineProps<{
  text: string
}>();

// Переносы нужны для старых обычных текстовых описаний. Для HTML они уже
// задаются тегами; pre-line превращает технические переводы строк редактора
// в большие пустые отступы.
const containsHtml = computed(() => /<\/?[a-z][^>]*>/i.test(props.text))
</script>

<style scoped lang="scss">
.product__description-text {
  font-family: inherit;

  &--plain {
    white-space: pre-line;
  }

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

  :deep(strong),
  :deep(b) {
    font-weight: 800;
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
