<template>
  <Top />
  <Header />

  <ClientOnly>
    <Breadcrumbs />

    <div class="profile">
      <div class="profile__container container">
        <ProfileMenu />
        <div class="profile__content">
          <div class="profile__title block__title fz-h2">{{ route.meta.title }}</div>
          <NuxtPage />
        </div>
      </div>
    </div>

  </ClientOnly>

  <Footer />
</template>

<script setup lang="ts">
const route = useRoute();
const authStore = useAuthStore();

// onMounted( () => {
//   if ( ! authStore.isAuthenticated ) {
//     return navigateTo( '/login' );
//   }
// } )
</script>

<style scoped lang="scss">
.profile {
  padding-bottom: 9.1rem;

  @media (max-width: $mobile) {
    padding-bottom: 5rem;
  }
}

.profile__container {
  display: grid;
  grid-template-columns: 3fr 9fr;
  gap: 3rem;
  align-items: flex-start;

  @media (max-width: $tablet) {
    grid-template-columns: 1fr;
  }
}

.profile__content {

}

.profile__title {
  margin-bottom: 2rem;
}
</style>