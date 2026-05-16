<template>
  <section class="banners section" v-if="hasBanners">
    <div class="banners__container container">

      <!-- MOBILE: все баннеры в колонку -->
      <div class="banners__mobile">
        <NuxtLink
            v-for="banner in list"
            :key="banner.id"
            :to="`/catalog?category=${banner.slug}`"
            class="banners__link"
            aria-label="Открыть категорию"
        >
          <img
              :src="banner.mobile_url || banner.desktop_url || ''"
              :alt="banner.name || 'banner'"
              class="banners__img banners__img--mobile"
              loading="lazy"
          />
        </NuxtLink>
      </div>

      <!-- DESKTOP: 4 карточки в один ряд -->
      <div class="banners__desktop">
        <NuxtLink
            v-for="banner in desktopBanners"
            :key="banner.id"
            :to="`/catalog?category=${banner.slug}`"
            class="banners__link"
            aria-label="Открыть категорию"
        >
          <img
              :src="banner.desktop_url || banner.mobile_url || ''"
              :alt="banner.name || 'banner'"
              class="banners__img banners__img--desktop"
              loading="lazy"
          />
        </NuxtLink>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Banner {
  id: number
  name?: string
  slug: string
  desktop_url?: string | null
  mobile_url?: string | null
  description?: string
}

const { data: banners } = await useApi<{
  success: boolean
  data: Banner[]
}>('/public/catalog/home-banners')

const list = computed<Banner[]>(() => banners.value?.data || [])
const hasBanners = computed(() => !!banners.value?.success && list.value.length > 0)

/**
 * DESKTOP: берём первые 4 с desktop_url, если мало — добиваем любыми.
 */
const desktopBanners = computed<Banner[]>(() => {
  const withDesktop = list.value.filter(b => !!b.desktop_url)
  const fallback = list.value.filter(b => !withDesktop.includes(b))
  return [...withDesktop, ...fallback].slice(0, 4)
})
</script>

<style scoped lang="scss">
.banners {
  padding: 7rem 0 5.2rem;

  @media (max-width: $tablet) {
    padding: 5rem 0 4rem;
  }

  @media (max-width: $mobile) {
    padding: 3rem 0 2.5rem;
  }
}

/* MOBILE / DESKTOP переключение */
.banners__mobile {
  display: none;

  @media (max-width: $mobile) {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
}

.banners__desktop {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;

  @media (max-width: $tablet) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $mobile) {
    display: none;
  }
}

.banners__link {
  display: block;
  width: 100%;
  overflow: hidden;
  text-decoration: none;
}

.banners__img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 0.8rem;
}

/* DESKTOP: 3/4 (750×1000) */
.banners__img--desktop {
  aspect-ratio: 3 / 4;
}

/* MOBILE: 3/2 (600×400) */
.banners__img--mobile {
  aspect-ratio: 3 / 2;
}
</style>
