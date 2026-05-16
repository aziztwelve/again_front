<template>
  <NotFound v-if="favourites.favourites.length === 0" />
  <CatalogGrid v-else class="profile-fav__grid" :list="favourites.favourites" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'profile',
  title: 'Хочу купить',
  middleware: 'auth'
});

useBirthdayReminder();

const favourites = useFavouritesStore();
</script>

<style scoped lang="scss">
.profile-fav__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.8rem;

  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
  }
}

.profile-fav__empty {
  color: #575757;
  opacity: .5;
}

</style>