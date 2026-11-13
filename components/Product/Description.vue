<template>
  <div class="product__description">
    <h2 class="product__description-title fz-h2">Описание</h2>
    <div
      class="product__description-text"
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
// Типографика описания товара. Описание пишут в визуальном редакторе админки
// (RichTextEditor.vue, content_style), поэтому ритм отступов и шрифты здесь и
// там должны совпадать: правите здесь — поправьте и там.
// Общие стили .text__content (статьи, политики) не подключаем: у них отступы
// между блоками по 4rem, а у списков — по 1.8rem между пунктами.
.product__description-text {
  --description-gap: 1.4rem;

  font-family: inherit;
  font-size: var(--fz-regular);
  line-height: 150%;
  overflow-wrap: anywhere;

  @media (max-width: $mobile) {
    --description-gap: 1.2rem;
    --fz-regular: 1.4rem;
  }

  &--plain {
    white-space: pre-line;
  }

  // Блоки: одинаковый отступ снизу, у последнего в контейнере его нет.
  :deep(p),
  :deep(ul),
  :deep(ol),
  :deep(table),
  :deep(figure) {
    margin: 0 0 var(--description-gap);
  }

  // Старые описания набраны <div>-ами: «листовой» div (только текст и
  // инлайн-теги внутри) ведёт себя как абзац.
  :deep(div:not(:has(> :not(strong, b, em, i, u, a, span, br)))) {
    margin: 0 0 var(--description-gap);
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 2rem;
  }

  :deep(ul) { list-style: disc; }
  :deep(ol) { list-style: decimal; }

  :deep(li) {
    margin: 0 0 .5rem;
    line-height: 150%;
  }

  :deep(li:last-child),
  :deep(li > p),
  :deep(:last-child) {
    margin-bottom: 0;
  }

  // Подзаголовки — Tenor Sans, как заголовки на сайте.
  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    margin: calc(var(--description-gap) * 1.6) 0 .8rem;
    font-family: var(--ff-heading);
    font-weight: 400;
    line-height: 130%;
  }

  :deep(h1),
  :deep(h2) { font-size: 2.4rem; }
  :deep(h3) { font-size: 2rem; }
  :deep(h4),
  :deep(h5),
  :deep(h6) { font-size: 1.8rem; }

  @media (max-width: $mobile) {
    :deep(h1),
    :deep(h2) { font-size: 2rem; }
    :deep(h3) { font-size: 1.8rem; }
    :deep(h4),
    :deep(h5),
    :deep(h6) { font-size: 1.6rem; }
  }

  // Заголовок в начале описания не отступает от верха блока.
  :deep(:first-child) { margin-top: 0; }

  :deep(strong),
  :deep(b) {
    font-weight: 600;
  }

  :deep(img),
  :deep(video),
  :deep(iframe) {
    max-width: 100%;
  }

  :deep(img) {
    height: auto;
    border-radius: .8rem;
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
