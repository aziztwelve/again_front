<template>
  <section class="hero">
    <div class="hero__container container">
      <ClientOnly>
        <swiper-container
            class="hero__slider"
            slides-per-view="1"
            space-between="5"
            :loop="true"
            :modules="[Pagination, Autoplay]"
            :autoplay="{
              delay: 7000
            }"
            effect="fade"
            :pagination="{
              clickable: true
            }"
            :breakpoints="{
              0: {
                delay: 7000
              },
               992: {
                delay: 6000
               }
            }"
        >
          <swiper-slide v-for="(slide, index) in slides" :key="index">
            <HeroSlide
                :title="slide.title"
                :subtitle="slide.subtitle"
                :text="slide.text"
                :desktop-image="slide?.image_urls"
                :mobile-image="slide?.mobile_image_urls"
            />
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import { register } from 'swiper/element/bundle';
import { Pagination, Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/pagination";

register();

type Slide = {
  title: string,
  subtitle: string,
  text: string,
  image_urls?: {
    original?: string,
    lg?: string,
    md?: string,
    sm?: string
  },
  mobile_image_urls?: {
    original?: string,
    sm?: string
  }
}

const { data: slides } = await useApi<Slide[]>( '/get_slides' );
</script>

<style scoped lang="scss">
.hero {
  padding: 2.364rem 0 5.7rem;

  @media (max-width: $mobile) {
    padding-bottom: 1.6rem;
  }
}

.hero__dots, swiper-container::part(pagination) {
  margin-top: 3rem;
  position: relative;
  z-index: 15;

  @media (max-width: $mobile) {
    margin-top: 1.8rem;
  }
}
</style>