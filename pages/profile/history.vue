<template>
  <div class="profile-history__row">
    <template v-if="cards && cards.orders.length > 0">
      <ProfileHistoryCard
          v-for="(order, index) in cards.orders"
          :key="order.id"
          :order="order"
      />
    </template>
  </div>
  <button class="profile-history__btn btn _gray _border">Показать все заказы</button>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'profile',
  title: 'История заказов',
  middleware: 'auth',
});

useBirthdayReminder();

const { data: cards } = await useApi( '/orders/user' );
</script>

<style scoped lang="scss">
.profile-history__btn {
  margin-top: 5.3rem;

  @media (max-width: $mobile) {
    margin-top: 2.5rem;
  }
}

</style>