<template>
  <div class="hero-slide">
    <div class="hero-slide__subtitle" v-if="subtitle" v-html="subtitle"></div>
    <h1 class="hero-slide__title" v-if="title" v-html="title"></h1>
    <p class="hero-slide__text" v-if="text" v-html="text"></p>
    <NuxtLink to="/catalog" class="hero-slide__btn btn">КУПИТЬ</NuxtLink>
    <div class="hero-slide__media" v-if="desktopImage?.original || mobileImage?.original">
      <picture class="hero-slide__media-pic">
        <!-- Mobile изображение (если есть) -->
        <source
            v-if="mobileImage?.sm"
            media="(max-width: 600px)"
            :srcset="mobileImage.sm"
        >
        <source
            v-if="mobileImage?.original"
            media="(max-width: 600px)"
            :srcset="mobileImage.original"
        >

        <!-- Desktop изображение -->
        <source
            v-if="desktopImage?.original"
            media="(min-width: 601px)"
            :srcset="desktopImage.original"
        >

        <!-- Fallback: desktop оригинал или первое доступное -->
        <img
            :src="desktopImage?.original || mobileImage?.original"
            class="hero-slide__media-img"
            :alt="title"
        >
      </picture>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string,
  subtitle?: string,
  text?: string,
  desktopImage?: {
    original?: string,
    lg?: string,
    md?: string,
    sm?: string
  },
  mobileImage?: {
    original?: string,
    sm?: string
  }
}>();
</script>

<style scoped lang="scss">
.hero-slide {
  border-radius: 5rem;
  padding: 10rem 3rem;
  min-height: 67.1rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  @media (max-width: $mobile) {
    padding: 2.4rem 2.5rem;
    min-height: 39.5rem;
  }
}

.hero-slide__subtitle {
  font-weight: 200;
  font-size: 2rem;
  line-height: 4.71rem;
  color: #C1AE94;

  @media (max-width: $mobile) {
    font-size: 1.2rem;
    line-height: 2.97rem;
  }
}

.hero-slide__title {
  max-width: 75%;
  margin: 0 auto 1rem;
  font-weight: 300;
}

.hero-slide__text {
  font-family: var(--ff-helvetica-neue);
  font-size: 2rem;
  line-height: 100%;
  max-width: 38.11rem;
  margin: 0 auto 1.9rem;
  font-weight: 300;

  @media (max-width: $mobile) {
    font-size: 1.3rem;
    line-height: 120%;
    margin-bottom: 1.4rem;
  }

  & strong {
    font-weight: 500;
  }
}

.hero-slide__btn {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 6rem;

  @media (max-width: $tablet) {
    width: 80%;
  }
}

.hero-slide__media {
  &-pic {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  &-img {
    width: 100%;
    height: 100%;
    object-position: center;
    object-fit: cover;
  }
}
</style>