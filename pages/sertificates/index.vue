<template>
  <Breadcrumbs />
  <div class="certificates page-padding">
    <div class="certificates__container container">
      <div class="certificates-block__header block__header _left _30">
        <h1 class="block__header-title fz-h2--mobile">Сертификаты</h1>
      </div>
      <div class="certificates__grid">
        <a
           v-for="item in certificates"
           :key="item.href"
           :href="item.href"
           class="certificates__item item--cover"
           :target="item.type === 'pdf' ? '_blank' : undefined"
           :rel="item.type === 'pdf' ? 'noopener' : undefined"
           :data-fancybox="item.type === 'image' ? 'gallery' : undefined"
        >
          <img v-if="item.type === 'image'" :src="item.href" :alt="item.title">
          <div v-else class="certificates__pdf">
            <span class="certificates__pdf-type">PDF</span>
            <span class="certificates__pdf-title">{{ item.title }}</span>
            <span class="certificates__pdf-action">Открыть сертификат</span>
          </div>
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

const certificates = [
  {
    title: 'Сертификат соответствия № 05916',
    href: '/documents/certificates/scan-ss-05916.pdf',
    type: 'pdf',
  },
  {
    title: 'Сертификат BY.70.06.01.001.R.002680.11.24',
    href: '/documents/certificates/by-70-06-01-001-r-002680-11-24.pdf',
    type: 'pdf',
  },
  {
    title: 'Декларация соответствия ТР ЕАЭС № 423006',
    href: '/documents/certificates/423006-maket-ds-tr-eaes.pdf',
    type: 'pdf',
  },
  {
    title: 'Сертификат AGAIN',
    href: '/img/certificates.again/1.jpg',
    type: 'image',
  },
] as const

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

.certificates__pdf {
  display: flex;
  min-height: 20rem;
  padding: 2rem;
  flex-direction: column;
  justify-content: space-between;
  background: #f4f2ef;
  color: #292725;
  transition: background-color .2s ease;

  &:hover {
    background: #e8e5e1;
  }

  @media (max-width: $mobile) {
    min-height: 15rem;
  }
}

.certificates__pdf-type {
  align-self: flex-start;
  padding: .35rem .6rem;
  background: #292725;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: .08em;
}

.certificates__pdf-title {
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.35;
}

.certificates__pdf-action {
  font-size: 1.4rem;
  text-decoration: underline;
}

:global(.fancybox__container.is-ready) {
  opacity: 1 !important;
}
</style>
