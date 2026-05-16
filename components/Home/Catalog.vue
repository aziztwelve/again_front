<template>
  <section class="catalog section">
    <div class="catalog__container container">

      <div class="catalog__header">
        <NuxtLink to="/catalog" class="catalog__all-btn">
          <span>Все товары</span>
        </NuxtLink>
      </div>

      <CatalogGrid v-if="products" :list="products.data.slice(4)"/>
    </div>
  </section>
</template>

<script setup lang="ts">
import type {Product} from "~/types/catalog";

const {data: products} = await useApi<{
  data: Product[]
}>('/public/catalog/products', {
  query: {
    per_page: 12,
    page: 1,
    in_stock: 1,
    sort_by: 'display_order',
    sort_order: 'asc',
  }
})
</script>

<style scoped lang="scss">
.catalog__header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.catalog__all-btn {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 1.7rem 1.4rem 2.1rem;
  border: .1rem solid #3F3F3F;
  border-radius: 5.3rem;
  color: #3F3F3F;
  gap: 1rem;
  transition: var(--tr-regular);

  @media(any-hover: hover) {
    &:hover {
      background: #3F3F3F;
      color: var(--fg-white);

      & path {
        fill: var(--fg-white);
      }
    }
  }

  & path {
    transition: var(--tr-regular);
  }

  @media (max-width: $mobile) {
    padding: .9rem 1rem .7rem 1.5rem;
    font-size: 1rem;
  }
}
</style>