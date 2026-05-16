<template>
  <div class="preloader" :class="{ 'preloader--hide': ! loading }">
    <div class="preloader__content">
      <div class="preloader__logo">
        <img src="/img/logo.again/logo.svg" alt="">
      </div>
      <div class="preloader__icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M41 32.3377L38.4525 31.0395C35.8025 36.4159 30.3262 40.1072 24.0003 40.1072C15.0806 40.1072 7.85003 32.7682 7.85003 23.7146C7.85003 16.0278 13.0624 9.5768 20.0954 7.80437L19.3931 5C11.1259 7.09007 5 14.6763 5 23.7146C5 34.3654 13.5069 43 24.0003 43C31.44 43 37.8812 38.6597 41 32.3377ZM43.0006 23.7448C43.0006 23.7347 43.0006 23.7247 43.0006 23.7146C43.0006 23.7045 43.0006 23.6944 43.0006 23.6843V23.7448Z" fill="white"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const loading = ref( true );
nuxtApp.hook("page:start", () => {
  loading.value = true;
} );
nuxtApp.hook("page:finish", () => {
  loading.value = false;
});
</script>

<style scoped lang="scss">
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--fg-white);
  z-index: 99999;
  transition: var(--tr-regular);

  &--hide {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__logo {
    & img {
      width: 15rem;
      height: auto;
    }
  }

  &__icon {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
    animation: rotate 1s linear infinite;

    & path {
      fill: var(--fg-black);
    }
  }
}
</style>