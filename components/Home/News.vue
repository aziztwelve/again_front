<template>
  <section class="section news home-news">
    <div class="news__container container">

      <NewsGrid :list="list" />

      <div class="news__more">
        <NuxtLink to="/articles" class="btn _border _gray">читать все статьи</NuxtLink>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const list = blogQuery().getLast();
</script>

<style scoped lang="scss">
.news__more {
  display: flex;
  justify-content: center;
  margin-top: 5.9rem;

  @media (max-width: $mobile) {
    margin-top: 3.5rem;
  }
}
</style>