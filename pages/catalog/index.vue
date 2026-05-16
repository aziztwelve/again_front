<template>
  <Breadcrumbs/>
  <div class="catalog-page page-padding">
    <div class="container catalog-page__container">
      <CatalogFilters
          class="catalog-page__filter"
          @filter-click="submitFilter"
          @reset-click="resetFilter"
      />

      <div class="catalog-page__body">

        <h1 class="catalog-page__title" v-if="nProducts.meta.category?.name">
          {{ nProducts.meta.category?.name }}
        </h1>

        <p
            v-if="nProducts.meta.category?.description"
            class="catalog-page__subtitle"
        >
          {{ nProducts.meta.category.description }}
        </p>


        <template v-if="nProducts?.data?.length > 0">

          <CatalogGrid
              class="catalog-page__grid"
              :list="nProducts?.data"
          />

          <Loadmore
              class="catalog-page__loadmore"
              v-if="nProducts?.meta?.last_page > 1 && page !== nProducts?.meta.last_page"
              @load-more="loadMore"
          />
        </template>
        <NotFound v-else/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Catalog} from "~/types/catalog"
import {getFilterParams} from "~/utils/getFilterParams"
import {useApi} from "~/composables/useApi"

definePageMeta({
  title: "Каталог",
})

const route = useRoute()
const filters = getFilterParams()
const page = ref(1)

const emptyCatalog: Catalog = {
  data: [],
  meta: {
    last_page: 1,
    category: undefined,
  },
}


const {data: products, refresh} = await useAsyncData(
    "products",
    async () => {
      // формируем query параметры
      const query = {
        per_page: 12,
        page: page.value,

        category_id: route.query.category_id || "",
        category_slug: route.query.category || "",

        absorbency_level: filters.value.absorbency_level || "",
        fit_type: filters.value.fit_type || "",
        is_new: filters.value.is_new || "",

        color_id: filters.value.color || "",
        price_before: filters.value.price.before || "",
        price_after: filters.value.price.after || "",
        // in_stock: false,
        search: filters.value.search || "",
        sort_by: 'display_order',
        sort_order: 'asc',
      }

      const {data, error} = await useApi<Catalog>("/public/catalog/products", {query})


      if (error.value) {
        console.error("Ошибка загрузки продуктов:", error.value)
        return emptyCatalog
      }

      return data.value
    },
    {
      server: true,
      immediate: true,
    }
)

const nProducts = ref<Catalog>(emptyCatalog)

watch(products, (newProducts) => {
  if (!newProducts) return

  if (page.value === 1) {
    nProducts.value = newProducts
  } else {
    nProducts.value = {
      ...newProducts,
      data: [...nProducts.value.data, ...newProducts.data],
    }
  }
}, {immediate: true})


// Следим за изменением query параметров (категория, фильтры)
watch(() => route.query, () => {
  page.value = 1
  refresh()
}, {deep: true})

const submitFilter = (args: any) => {

  page.value = 1
  filters.value.color = args.color
  filters.value.price.after = args.price.before
  filters.value.price.before = args.price.after
  filters.value.in_stock = 1

  filters.value.absorbency_level = args.absorbency_level || ''
  filters.value.fit_type = args.fit_type || ''
  filters.value.is_new = args.is_new ? 1 : 0


  refresh()
}

const loadMore = () => {
  page.value += 1
  refresh()
}

const resetFilter = () => {
  page.value = 1
  filters.value.color = ""
  filters.value.price.after = ""
  filters.value.price.before = ""
  filters.value.search = ''
  filters.value.in_stock = 0

  filters.value.absorbency_level = ''
  filters.value.fit_type = ''
  filters.value.is_new = 0

  refresh()
}
</script>

<style scoped lang="scss">
.catalog-page__container {
  display: grid;
  grid-template-columns: 3fr 9fr;
  gap: 3.6rem;
  align-items: flex-start;

  @media (max-width: $tablet) {
    grid-template-columns: 1fr;
    gap: 0;
  }
}


.catalog-page__loadmore {
  margin-top: 4.7rem;
  display: flex;
  justify-content: center;
}


.catalog-page__title {
  font-size: 3.2rem;
  font-weight: 600; // было 500
  line-height: 1.25;
  letter-spacing: -0.02em; // делает текст «дороже»
  color: var(--fg-regular-100);
  margin-bottom: 1.2rem;

  @media (max-width: $mobile) {
    font-size: 2.2rem;
    line-height: 1.3;
  }


}


.catalog-page__subtitle {
  font-size: 1.4rem;
  line-height: 1.5;
  color: var(--fg-regular-60);
  max-width: 72rem;
  margin-bottom: 3.2rem;
}


</style>