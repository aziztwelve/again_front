<template>
  <div class="favourites page-padding">
    <div class="container favourites__container">
      <div class="favourites-block__header block__header _left _small">
        <h1 class="block__header-title">Избранное</h1>
        <div class="block__header-counter">{{ favouritesStore.countInFavourites() }}</div>
      </div>
      <NotFound v-if="favouritesStore.favourites.length === 0" />
      <ClientOnly v-else>
        <CatalogGrid
            class="favourites__grid"
            :list="favouritesStore.favourites"
        />
      </ClientOnly>
    </div>

  </div>
</template>

<script setup lang="ts">
const favouritesStore = useFavouritesStore();
definePageMeta( {
  title: 'Избранное',
} )
</script>

<style scoped lang="scss">
.favourites {

}

.favourites__title {
  display: flex;
  align-items: center;
  text-align: left;
}

.favourites__title-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  border: .1rem solid #3A3A3A;
  font-family: var(--ff-regular);
  font-size: 1.6rem;
  margin-left: 1.9rem;
  margin-top: .5rem;
}

.favourites__grid {
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: $tablet) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
  }
}

</style>