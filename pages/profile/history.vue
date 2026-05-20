<template>
  <div class="profile-history">
    <template v-if="pending && !data">
      <div class="profile-history__loader">Загрузка…</div>
    </template>

    <template v-else-if="orders.length">
      <div class="profile-history__row">
        <ProfileHistoryCard
            v-for="order in orders"
            :key="order.id"
            :order="order"
        />
      </div>

      <button
          v-if="hasMore"
          class="profile-history__btn btn _gray _border"
          :class="{ _loading: pending }"
          :disabled="pending"
          @click="loadMore"
      >
        {{ pending ? 'Загрузка…' : 'Показать все заказы' }}
      </button>
    </template>

    <template v-else>
      <div class="profile-history__empty">
        <p>У вас пока нет оформленных заказов.</p>
        <NuxtLink to="/catalog" class="btn _border">Перейти в каталог</NuxtLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Order, UserOrdersResponse } from '~/types/orders';

definePageMeta({
  layout: 'profile',
  title: 'История заказов',
  middleware: 'auth',
});

useBirthdayReminder();

// Грузим первую страницу с дефолтным per_page=10 (см. OrderController::getUserOrders).
// «Показать все заказы» докручивает per_page; при желании можно перейти на
// «по странице» — для этого появится last_page в PaginationHelper.
const perPage = ref(10);

const { data, pending, refresh } = await useApi<UserOrdersResponse>(
    '/orders/user',
    { query: { per_page: perPage } },
);

const orders = computed<Order[]>(() => data.value?.orders ?? []);

const hasMore = computed(() => {
  const p = data.value?.pagination;
  if (!p) return false;
  return p.total > orders.value.length;
});

const loadMore = async () => {
  if (!data.value?.pagination) return;
  // useFetch уже подписан на perPage через query — увеличиваем размер страницы
  // и просим Nuxt сделать рефетч.
  perPage.value = Math.max(perPage.value * 2, data.value.pagination.total);
  await refresh();
};
</script>

<style scoped lang="scss">
.profile-history__loader {
  padding: 4rem 0;
  text-align: center;
  font-size: 1.4rem;
  color: #7a7a7a;
}

.profile-history__empty {
  padding: 4rem 0;
  text-align: center;

  p {
    margin: 0 0 2rem;
    font-size: 1.6rem;
    line-height: 1.5;
  }

  .btn {
    display: inline-flex;
  }
}

.profile-history__btn {
  margin-top: 5.3rem;

  @media (max-width: $mobile) {
    margin-top: 2.5rem;
  }
}
</style>
