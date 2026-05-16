<template>
  <div class="favs__row">
    <FavouritesMiniCard
      v-for="item in favouritesStore.favourites"
      :key="item.id"
      :product="item"
    />
  </div>

</template>

<script setup lang="ts">
const favouritesStore = useFavouritesStore();
</script>

<style scoped lang="scss">

</style>