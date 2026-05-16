<template>
  <div class="related cart__related">
    <div class="related__container container">
      <div class="related-block__header block__header _left _small">
        <div class="block__header-left">
          <h2 class="block__header-title">C этим покупают</h2>
        </div>
        <div class="block__header-right">
          <div class="swiper__nav">
            <button class="swiper__arrow _border swiper__arrow--prev related__prev">
              <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.146447 4.35355C-0.0488155 4.15829 -0.0488155 3.84171 0.146447 3.64645L3.32843 0.464466C3.52369 0.269204 3.84027 0.269204 4.03553 0.464466C4.2308 0.659728 4.2308 0.97631 4.03553 1.17157L1.20711 4L4.03553 6.82843C4.2308 7.02369 4.2308 7.34027 4.03553 7.53553C3.84027 7.7308 3.52369 7.7308 3.32843 7.53553L0.146447 4.35355ZM1 4.5L0.5 4.5L0.5 3.5L1 3.5L1 4.5Z" fill="black"/>
              </svg>
            </button>
            <button class="swiper__arrow _border swiper__arrow--next related__next">
              <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.85355 4.35355C5.04882 4.15829 5.04882 3.84171 4.85355 3.64645L1.67157 0.464466C1.47631 0.269204 1.15973 0.269204 0.964466 0.464466C0.769204 0.659728 0.769204 0.97631 0.964466 1.17157L3.79289 4L0.964466 6.82843C0.769204 7.02369 0.769204 7.34027 0.964466 7.53553C1.15973 7.7308 1.47631 7.7308 1.67157 7.53553L4.85355 4.35355ZM4 4.5L4.5 4.5L4.5 3.5L4 3.5L4 4.5Z" fill="black"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <swiper-container
          class="related__swiper"
          :navigation="{
            nextEl: '.related__next',
            prevEl: '.related__prev',
          }"
          :breakpoints="{
            0: {
              slidesPerView: 1.15,
              spaceBetween: 10,
            },
            575: {
              slidesPerView: 2.5,
              spaceBetween: 10,
            }
          }"
      >
        <swiper-slide>

        </swiper-slide>
      </swiper-container>
      <div class="related__button">
        <a href="#" class="btn _border _gray">В каталог</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { register } from 'swiper/element/bundle';
register();
</script>

<style scoped lang="scss">

</style>