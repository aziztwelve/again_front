<template>
  <ClientOnly>
    <div class="product-gallery" v-if="images.length > 0">
      <!-- transition оборачивает и главный слайдер, и миниатюры -->
      <transition name="fade-slide" mode="out-in">
        <div :key="galleryKey" class="gallery-inner">
          <!-- главный слайдер -->
          <swiper-container
              ref="mainSwiperEl"
              thumbs-swiper=".my-thumbs"
              :spaceBetween="15"
              :touchStartPreventDefault="false"
              :preventClicks="false"
              :preventClicksPropagation="false"
          >
            <swiper-slide v-for="(image, index) in images" :key="image.id ?? index">
              <a :href="getImage(image.path)" data-fancybox="gallery">
                <picture class="product-gallery__main-pic">
                  <img
                      :src="getImage(image.path)"
                      class="product-gallery__main-img"
                      :alt="product.name"
                  />
                </picture>
              </a>
            </swiper-slide>
          </swiper-container>

          <!-- миниатюры -->
          <div class="product-gallery__flex" v-if="images.length > 1">
            <div class="product-gallery__thumbs">
              <swiper-container
                  ref="thumbsSwiperEl"
                  class="my-thumbs"
                  :slidesPerView="4"
              >
                <swiper-slide v-for="(image, index) in images" :key="image.id ?? 't' + index">
                  <button
                      class="product-gallery__thumbs-item"
                      :class="{ '_active': activeItemIndex === index }"
                      @click="goTo(index)"
                      type="button"
                  >
                    <img
                        :src="getImage(image.path)"
                        class="product-gallery__thumbs-img"
                        :alt="product.name"
                    />
                  </button>
                </swiper-slide>
              </swiper-container>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import {ref, computed, watch, nextTick, onMounted, onBeforeUnmount} from 'vue';
import type {Product} from '~/types/catalog';
import {Fancybox as NativeFancybox} from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import {register} from 'swiper/element/bundle';

register();

const props = defineProps<{
  product: Product,
  selectedSize: any,
}>();

const activeItemIndex = ref(0);

const mainSwiperEl = ref<HTMLElement | null>(null);
const thumbsSwiperEl = ref<HTMLElement | null>(null);

const images = computed(() => {
  const sel = props.selectedSize;
  const productImages = Array.isArray(props.product?.images) ? props.product.images : [];

  // A size can have only its cover image configured. Do not let that one image
  // replace the complete product gallery when several product images exist.
  if (
    sel
    && Array.isArray(sel.images)
    && sel.images.length > 0
    && !(sel.images.length === 1 && productImages.length > 1)
  ) {
    return sel.images;
  }
  if (productImages.length > 0) {
    return productImages;
  }
  if (props.product?.main_image) {
    return [props.product.main_image];
  }
  return [];
});

const galleryKey = computed(() => {
  return 'g-' + images.value.map((i: any) => i?.id ?? i?.path ?? '').join('-');
});

function goTo(index: number) {
  activeItemIndex.value = index;
  const mainEl: any = mainSwiperEl.value;
  if (mainEl?.swiper && typeof mainEl.swiper.slideTo === 'function') {
    mainEl.swiper.slideTo(index);
  } else {
    nextTick().then(() => {
      const m: any = mainSwiperEl.value;
      if (m?.swiper && typeof m.swiper.slideTo === 'function') {
        m.swiper.slideTo(index);
      }
    });
  }
}

watch(images, async () => {
  activeItemIndex.value = 0;

  await nextTick();

  try {
    NativeFancybox.bind('[data-fancybox]', {});
  } catch (e) {
    // ignore
  }

  const mainEl: any = mainSwiperEl.value;
  if (mainEl?.swiper && typeof mainEl.swiper.slideTo === 'function') {
    mainEl.swiper.slideTo(0);
  } else {
    setTimeout(() => {
      const m: any = mainSwiperEl.value;
      if (m?.swiper && typeof m.swiper.slideTo === 'function') {
        m.swiper.slideTo(0);
      }
    }, 50);
  }
}, {immediate: true});

onMounted(() => {
  NativeFancybox.bind('[data-fancybox]', {});
});

onBeforeUnmount(() => {
  try {
    NativeFancybox.destroy();
  } catch (e) {
    // ignore
  }
});
</script>

<style scoped lang="scss">
swiper-container,
swiper-container::part(container) {
  touch-action: pan-y;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 300ms cubic-bezier(.2,.9,.2,1), transform 320ms cubic-bezier(.2,.9,.2,1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.product-gallery__main-img {
  transition: opacity 260ms ease, transform 260ms ease;
  will-change: opacity, transform;
}

</style>
