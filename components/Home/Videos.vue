<template>
  <section class="videos">
    <ClientOnly>
      <swiper-container
          class="videos__swiper swiper"
          :slidesPerView="2.2"
          :spaceBetween="10"
          :pagination="{ clickable: true }"
          :modules="[Pagination, Autoplay]"
          :autoplay="{ delay: 7000 }"
          :breakpoints="{
            0: { slidesPerView: 2.2, spaceBetween: 10 },
            600: { slidesPerView: 3.5, spaceBetween: 10, pagination: false },
            992: { slidesPerView: 7.4, spaceBetween: 10 }
          }"
      >
        <swiper-slide v-for="(item, idx) in videos" :key="idx">
          <VideosCard :videoUrl="item.url" />
        </swiper-slide>
      </swiper-container>
      <div class="videos__dots swiper__dots"></div>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {register} from 'swiper/element/bundle';
import "swiper/css";
import "swiper/css/pagination";
import {Autoplay, Pagination} from "swiper/modules";

register();

const videos = ref([
  {
    url: 'https://11805945-1e17-4a04-95b0-a33eaa00dbac.selstorage.ru/2025-09-22%2011-23-00%20(1).mov'
  },
  // {
  //   url: 'https://11805945-1e17-4a04-95b0-a33eaa00dbac.selstorage.ru/2025-09-22%2011-23-00.mov'
  // },
  {
    url: 'https://11805945-1e17-4a04-95b0-a33eaa00dbac.selstorage.ru/-1626757947923848104_04.11.2025.mp4'
  },
  {
    url: 'https://11805945-1e17-4a04-95b0-a33eaa00dbac.selstorage.ru/2025-09-22%2009-01-44.mov'
  },
  {
    url: 'https://11805945-1e17-4a04-95b0-a33eaa00dbac.selstorage.ru/2025-09-22%2011-07-39.mov'
  },
  {
    url: 'https://11805945-1e17-4a04-95b0-a33eaa00dbac.selstorage.ru/2025-09-22%2011-08-27.mov'
  },
  {
    url: 'https://11805945-1e17-4a04-95b0-a33eaa00dbac.selstorage.ru/2025-09-22%2011-10-02.mov'
  },
  {
    url: 'https://11805945-1e17-4a04-95b0-a33eaa00dbac.selstorage.ru/2025-09-22%2011-11-31.mov'
  },
  {
    url: 'https://11805945-1e17-4a04-95b0-a33eaa00dbac.selstorage.ru/2025-09-22%2011-16-18.mov'
  },
  {
    url: 'https://11805945-1e17-4a04-95b0-a33eaa00dbac.selstorage.ru/2025-09-22%2011-17-23.mov'
  },
  {
    url: 'https://11805945-1e17-4a04-95b0-a33eaa00dbac.selstorage.ru/2025-09-22%2011-18-05%20(1).mov'
  },
  {
    url: 'https://11805945-1e17-4a04-95b0-a33eaa00dbac.selstorage.ru/2025-09-22%2011-18-05%20(2).mov'
  },
  {
    url: 'https://11805945-1e17-4a04-95b0-a33eaa00dbac.selstorage.ru/2025-09-22%2011-18-05.mov'
  },
  {
    url: 'https://11805945-1e17-4a04-95b0-a33eaa00dbac.selstorage.ru/2025-09-22%2011-21-21.mov'
  }
])
</script>

<style scoped lang="scss">
.videos {
  padding-bottom: 9rem;
  @media (max-width: $mobile) {
    padding-bottom: 5rem;
  }
}

swiper-container::part(pagination) {
  margin-top: 2rem;
}

.videos__dots {
  margin-top: 2rem;
  display: none;
  @media (max-width: $mobile) {
    display: flex;
  }
}
</style>