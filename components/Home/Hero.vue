<template>
  <section v-if="visibleSlides.length" class="hero">
    <div class="hero__container container">
      <ClientOnly>
        <!-- key: при переходе через границу мобильной ширины слайды другие, слайдер собираем заново -->
        <swiper-container
            :key="isMobile ? 'mobile' : 'desktop'"
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
          <swiper-slide v-for="(slide, index) in visibleSlides" :key="index">
            <HeroSlide
                :title="slide.title"
                :subtitle="slide.subtitle"
                :text="slide.text"
                :desktop-image="isMobile ? undefined : slide.image_urls"
                :mobile-image="isMobile ? slide.mobile_image_urls : undefined"
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
  id?: number,
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

// Мобильная вёрстка включается до этой ширины (как $mobile в стилях).
const MOBILE_QUERY = '(max-width: 575px)';
const isMobile = ref(false);
let mobileQuery: MediaQueryList | null = null;
const onMobileChange = (event: MediaQueryListEvent) => { isMobile.value = event.matches; };

onMounted(() => {
  mobileQuery = window.matchMedia(MOBILE_QUERY);
  isMobile.value = mobileQuery.matches;
  mobileQuery.addEventListener('change', onMobileChange);
});
onBeforeUnmount(() => mobileQuery?.removeEventListener('change', onMobileChange));

// Слайд показывается только там, где для него загружена картинка: только
// мобильная картинка — только на телефонах, только десктопная — только на
// компьютерах, обе — везде. Слайд без картинок вообще (только текст) — везде.
const visibleSlides = computed(() => (slides.value ?? []).filter((slide) => {
  const hasDesktop = Boolean(slide.image_urls?.original);
  const hasMobile = Boolean(slide.mobile_image_urls?.original || slide.mobile_image_urls?.sm);
  if (!hasDesktop && !hasMobile) return true;
  return isMobile.value ? hasMobile : hasDesktop;
}));
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