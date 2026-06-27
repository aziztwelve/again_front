<template>
  <button class="product__actions-cart btn _bell" @click="openRestockNotify">
    <svg class="product__actions-bell" width="18" height="20" viewBox="0 0 18 20" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <path
          d="M9 0C8.17 0 7.5 0.67 7.5 1.5V2.1C4.91 2.74 3 5.09 3 7.9V12.5L1.29 14.21C0.66 14.84 1.1 15.92 1.99 15.92H16.01C16.9 15.92 17.35 14.84 16.72 14.21L15 12.5V7.9C15 5.09 13.09 2.74 10.5 2.1V1.5C10.5 0.67 9.83 0 9 0ZM9 20C10.1 20 11 19.1 11 18H7C7 19.1 7.9 20 9 20Z"
          fill="currentColor"/>
    </svg>
    <span>Сообщить о поступлении</span>
  </button>
</template>

<script setup lang="ts">
import type {Product} from "~/types/catalog";
import {CatalogRestockNotify} from "#components";

const props = withDefaults(defineProps<{
  product: Product,
  variation?: object | null,
  color?: object | null,
}>(), {
  variation: null,
  color: null
});

const asideMenuStore = useAsideMenuStore();

const openRestockNotify = () => {
  asideMenuStore.open(CatalogRestockNotify, {
    title: 'Узнать о поступлении',
    product: props.product,
    variation: props.variation,
  });
};
</script>

<style scoped lang="scss">
.product__actions-cart._bell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.product__actions-bell {
  width: 1.8rem;
  height: 2rem;
  flex-shrink: 0;
}
</style>
