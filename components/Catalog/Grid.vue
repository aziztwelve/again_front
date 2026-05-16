<template>
  <div class="catalog__grid">
    <CatalogCard v-for="(item, index) in list" :key="item.id" :product="item" />
  </div>
</template>

<script setup lang="ts">
import type {Product} from "~/types/catalog";

defineProps<{
  list: Product[]
}>();
</script>

<style scoped lang="scss">
.catalog__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 1.5rem;
  row-gap: 3rem;

  @media (max-width: $tablet) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: $mobile) {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 1rem;
    row-gap: 2rem;
  }
}
</style>