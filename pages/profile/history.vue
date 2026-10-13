<template>
  <div class="profile-history">
    <template v-if="pending && !orders.length">
      <div class="profile-history__loader">Загрузка…</div>
    </template>

    <template v-else-if="orders.length">
      <p v-if="error" class="profile-history__error" role="alert">Не удалось загрузить следующие заказы. Попробуйте ещё раз.</p>
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
        {{ pending ? 'Загрузка…' : 'Показать ещё заказы' }}
      </button>
    </template>

    <template v-else-if="error">
      <div class="profile-history__empty" role="alert">
        <p>Не удалось загрузить историю заказов.</p>
        <button type="button" class="btn _border" @click="refresh()">Попробовать снова</button>
      </div>
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

const page = ref(1);
const orders = ref<Order[]>([]);
const total = ref(0);
const { data, pending, error, refresh } = await useApi<UserOrdersResponse>('/orders/user', {
  query: { page, per_page: 10 },
  watch: false,
});

watch(data, response => {
  if (!response) return;
  total.value = response.pagination?.total ?? response.orders.length;
  if (page.value === 1) orders.value = response.orders;
  else {
    const known = new Set(orders.value.map(order => order.id));
    orders.value = [...orders.value, ...response.orders.filter(order => !known.has(order.id))];
  }
}, { immediate: true });

const hasMore = computed(() => total.value > orders.value.length);
const loadMore = async () => {
  if (pending.value) return;
  page.value += 1;
  await refresh();
  if (error.value) page.value -= 1;
};
</script>

<style scoped lang="scss">
.profile-history__row { min-width: 0; }
.profile-history__error { color: var(--fg-red); font-size: 1.3rem; line-height: 1.5; margin-bottom: 1.5rem; }
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
