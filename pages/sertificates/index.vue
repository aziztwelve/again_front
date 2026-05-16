<template>
  <Breadcrumbs />
  <div class="certificates page-padding">
    <div class="certificates__container container">
      <div class="certificates-block__header block__header _left _30">
        <h1 class="block__header-title fz-h2--mobile">Сертификаты</h1>
      </div>
      <div class="certificates__grid">
        <a
           v-for="( item, key ) in list"
           :key="key"
           :href="item"
           class="certificates__item item--cover"
           data-fancybox="gallery"
        >
          <img :src="item" alt="">
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Fancybox as NativeFancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css';

definePageMeta( {
  title: 'Сертификаты',
} )

const list = ref( [
    '/img/certificates.again/1.jpg'
] )

onMounted( () => {
  NativeFancybox.bind('[data-fancybox]', {});

  return () => {
    NativeFancybox.destroy()
  }
} )
</script>

<style scoped lang="scss">
.certificates__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: $tablet) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
  }
}

.certificates__item {
  display: block;
  min-height: 20rem;

  @media (max-width: $mobile) {
    min-height: 15rem;
  }
}

:global(.fancybox__container.is-ready) {
  opacity: 1 !important;
}
</style>