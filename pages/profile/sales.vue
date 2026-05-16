<template>
  <div class="profile-sales__grid" v-if="sales && sales.data.length > 0">
    <ProfileSalesCard
        v-for="( item ) in sales.data"
        :key="item.id"
        :item="item"
    />
  </div>

  <NotFound v-else />
</template>

<script setup lang="ts">
import type {Sale} from "~/types/sales";

definePageMeta({
  layout: 'profile',
  title: 'Ваши скидки и бонусы',
  middleware: 'auth'
});

useBirthdayReminder();

type Data = {
  success: boolean,
  data: Sale[]
}

const userStore = useAuthStore();
const { data: sales } = await useApi<Data>( '/promo-code-clients/available-promo-codes?client_id=' + userStore.user.id );

</script>

<style scoped lang="scss">
.profile-sales__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.7rem;

  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

</style>