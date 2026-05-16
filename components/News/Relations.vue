<template>
  <section class="section news news__related" v-if="list && list.length > 0">
    <div class="news__container container">
      <div class="news__header block__header @@title_class">
        <div class="block__header-title">Вам может быть это&nbsp;интересно!</div>
      </div>
      <ClientOnly>
        <swiper-container
            class="videos__swiper swiper"
            :slidesPerView="1"
            :spaceBetween="18"
            :pagination="{
            clickable: true
          }"
            :modules="[Pagination, Autoplay]"
            :breakpoints="{
            0: {
              slidesPerView: 1,
              spaceBetween: 18,
            },
            600: {
              slidesPerView: 2,
              spaceBetween: 18,
              pagination: false
            },
            992: {
              slidesPerView: 3,
              spaceBetween: 18,
            }
          }"
        >
          <swiper-slide v-for="(item, index) in list" :key="index">
            <NewsCard
                :title="item.title"
                :text="item.text.short"
                :slug="item.slug"
                :banner="item.banner"
                :date="item.date"
            />
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import { register } from 'swiper/element/bundle';
import {Autoplay, Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

register();
const list = blogQuery().getRandomItems();
</script>

<style scoped lang="scss">
.news__related {
  padding-bottom: 7rem;
}

swiper-container::part(pagination) {
  margin-top: 2rem;
}
</style>