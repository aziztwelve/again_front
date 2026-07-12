<template>
  <HomeHero/>
  <HomeTechnology/>
  <HomeCatalog/>
  <HomeBanners/>
  <HomeRecommend/>
  <!--  <HomePayment />-->
  <HomeReviews/>
  <HomeVideos/>
  <HomeFaq/>
  <HomeNews/>
</template>

<script setup lang="ts">
useResponseHeader('Cache-Control', 'private, no-store');
useResponseHeader('Vary', 'Authorization, Cookie');
</script>

<style scoped>

</style>
