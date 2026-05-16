<template>
  <div>
    <Top />
    <Header />
      <div class="error__page">
        <div class="error__page-container container">
          <NuxtLayout name="default" v-if="error.statusCode !== 404">
            <!-- Content for general errors (e.g., 500) -->
            <h1 class="error__page-title">Страницы не существует</h1>
            <button @click="handleClearError">На главную</button>
          </NuxtLayout>

          <NuxtLayout name="404" v-else>
            <!-- Content specifically for 404 errors -->
            <h1 class="error__page-title">Страницы не существует</h1>
            <button class="btn" @click="handleClearError">На главную</button>
          </NuxtLayout>
        </div>
      </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { useError, clearError } from '#app'; // Import clearError

const props = defineProps({
  error: Object, // The error object passed by Nuxt
});

const handleClearError = async () => {
  await clearError({ redirect: '/' }); // Redirect to home after clearing error
};
</script>

<style scoped lang="scss">
.error__page {
  text-align: center;
  min-height: 100vh;
  padding: 6rem 0;
}
</style>