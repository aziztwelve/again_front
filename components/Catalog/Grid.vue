<template>
  <div class="catalog__grid">
    <CatalogCard
        v-for="item in list"
        :key="item.id"
        :product="item"
        :is-coming-soon="isComingSoon"
    />
  </div>
</template>

<script setup lang="ts">
import type {Product} from "~/types/catalog";

withDefaults(defineProps<{
  list: Product[]
  isComingSoon?: boolean
}>(), {
  isComingSoon: false,
});
</script>

<style scoped lang="scss">
.catalog__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 1.5rem;
  row-gap: 3rem;

  @supports (grid-template-rows: subgrid) {
    row-gap: 0;

    :deep(.catalog-item) {
      display: grid;
      grid-row: span 2;
      grid-template-rows: subgrid;
    }

    :deep(.cart_btns) {
      margin-bottom: 3rem;
    }
  }

  @media (max-width: $tablet) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: $mobile) {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 1rem;
    row-gap: 2rem;

    @supports (grid-template-rows: subgrid) {
      row-gap: 0;

      :deep(.cart_btns) {
        margin-bottom: 2rem;
      }
    }
  }
}
</style>
