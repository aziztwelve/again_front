<template>
  <article class="catalog-item" :data-id="product.id">
    <div class="catalog-item__card">

      <NuxtLink :to="to" class="catalog-item__media">
        <div class="catalog-item__media-container"
             @mousemove="handleMouseMove"
             @mouseenter="handleMouseEnter"
             @mouseleave="handleMouseLeave"
             @touchstart="handleTouchStart"
             @touchmove="handleTouchMove"
             @touchend="handleTouchEnd"
             @touchcancel="resetTouchGesture">
          <picture class="catalog-item__media-pic">
            <img
                :src="getImage( product.main_image?.path ? product.main_image?.path : '' )"
                alt=""
                class="catalog-item__media-img catalog-item__media-main"
                :class="{ '_hidden': currentImageIndex !== 0 }"
            >
            <img v-for="(image, index) in displayedImages"
                 :key="image.id || index"
                 :src="getImage(image.path)"
                 alt=""
                 class="catalog-item__media-img catalog-item__media-hover"
                 :class="{
                   '_active': currentImageIndex === index + 1,
                   '_hidden': currentImageIndex !== index + 1
                 }"
            >
          </picture>
          <div class="catalog-item__sale" v-if="product.total_discount">
            <span>Выгода</span>
            {{ formattedPrice(product.total_discount) }} ₽
          </div>
          <div class="catalog-item__status" v-if="product.stock_quantity === 0">Нет в наличии</div>
          <div class="catalog-item__rating" v-if="product.avg_rating">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M5 0L6.41068 3.05836L9.75528 3.45492L7.28254 5.74164L7.93893 9.04508L5 7.4L2.06107 9.04508L2.71746 5.74164L0.244718 3.45492L3.58932 3.05836L5 0Z"
                  fill="black"/>
            </svg>
            <span>{{ product.avg_rating }}</span>
          </div>

          <!-- Mobile swipe indicators (bars) -->
          <div class="catalog-item__swipe-indicators" v-if="isMobile && displayedImages.length > 1">
            <div v-for="(_, index) in displayedImagesWithMain"
                 :key="index"
                 class="catalog-item__swipe-indicator"
                 :class="{ '_active': currentImageIndex === index }">
            </div>
          </div>

          <!-- Desktop hover indicator (bars) -->
          <div class="catalog-item__swipe-indicators_desktop"
               v-if="!isMobile && isHovering && displayedImages.length > 1">
            <div class="catalog-item__hover-track">
              <div v-for="(_, index) in displayedImagesWithMain"
                   :key="index"
                   class="catalog-item__hover-seg"
                   :class="{ '_active': currentImageIndex === index }"></div>
            </div>
          </div>
        </div>
      </NuxtLink>


      <ClientOnly>
        <button
            :key="`fav-${product.id}-${favouritesStore.favourites.length}`"
            class="catalog-item__fav add-to-fav"
            :class="{ '_active': isFavourite }"
            @click="favouritesStore.toggleFavourites( product )"
        >
          <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11.62 18.8101C11.28 18.9301 10.72 18.9301 10.38 18.8101C7.48 17.8201 1 13.6901 1 6.6901C1 3.6001 3.49 1.1001 6.56 1.1001C8.38 1.1001 9.99 1.9801 11 3.3401C12.01 1.9801 13.63 1.1001 15.44 1.1001C18.51 1.1001 21 3.6001 21 6.6901C21 13.6901 14.52 17.8201 11.62 18.8101Z"
                stroke="#4F4F4F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </ClientOnly>

      <div class="catalog-item__content">
        <div class="catalog-item__header">
          <NuxtLink :to="to" class="catalog-item__title">
            {{ product.name }}
          </NuxtLink>
          <div class="catalog-item__price" v-if="product.price">
            <div class="catalog-item__price-new">{{ getNormalPrice(product.price, product.old_price) }} ₽</div>
            <div class="catalog-item__price-old" v-if="product.old_price">{{ formattedPrice(product.old_price) }} ₽
            </div>
          </div>
        </div>
        <div class="catalog-item__drop" v-if="product.absorbency_level > 0">
          <svg width="35" height="53" viewBox="0 0 35 53" fill="none" xmlns="http://www.w3.org/2000/svg"
               v-for="() in product.absorbency_level">
            <path
                d="M17.5 2.44238C17.9642 3.22192 18.5965 4.2922 19.3438 5.5791C20.9647 8.37082 23.1253 12.1781 25.2842 16.2441C27.4447 20.3133 29.5956 24.6268 31.2041 28.4336C32.0084 30.3371 32.6709 32.0998 33.1309 33.6328C33.5953 35.181 33.8339 36.4317 33.834 37.333C33.834 45.0358 26.6503 51.5 17.5 51.5C8.3499 51.4998 1.16699 45.0357 1.16699 37.333C1.16705 36.4317 1.40466 35.181 1.86914 33.6328C2.3291 32.0997 2.99251 30.3372 3.79688 28.4336C5.40542 24.6268 7.55625 20.3133 9.7168 16.2441C11.8757 12.1782 14.0363 8.37079 15.6572 5.5791C16.4043 4.29242 17.0359 3.22186 17.5 2.44238Z"
                stroke="#CB0B13" stroke-width="2" fill="#CB0B13"/>
          </svg>
        </div>

        <div class="catalog-item__colors colors" v-if="product.colors && product.colors.length > 0">
          <div class="colors__list">
            <div
                v-for="(color, key) in product.colors"
                :key="color.id"
                class="colors__item"
                :class="{
          '_white': isWhiteColor(color.code),
          '_print': isPrintColor(color.code)
        }"
                :style="isPrintColor(color.code) ? {} : { '--color': color.code }"
            >
              <input
                  type="radio"
                  class="colors__input"
                  :value="color.id"
                  :checked="product.colors[key] === color"
              >
              <label for="color" class="colors__label">
                <span v-if="!isPrintColor(color.code)"></span>
                <img
                    v-else
                    :src="`/img_colors_print/${color.name}.jpg`"
                    :alt="color.name"
                    class="colors__print-img"
                >
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="cart_btns">
      <MarketplaceLinksButtons
          class="mb-2"
          v-if="checkLinkMarketplace(product.marketplace_links)"
          :marketplace-links="product.marketplace_links"
      />

      <button
          v-if="shouldNotifyRestock"
          type="button"
          class="catalog-item__btn catalog-item__btn--notify"
          @click="openRestockNotify"
      >
        <span>Сообщить о поступлении</span>
        <svg class="catalog-item__btn-bell" width="18" height="20" viewBox="0 0 18 20" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <path
              d="M9 0C8.17 0 7.5 0.67 7.5 1.5V2.1C4.91 2.74 3 5.09 3 7.9V12.5L1.29 14.21C0.66 14.84 1.1 15.92 1.99 15.92H16.01C16.9 15.92 17.35 14.84 16.72 14.21L15 12.5V7.9C15 5.09 13.09 2.74 10.5 2.1V1.5C10.5 0.67 9.83 0 9 0ZM9 20C10.1 20 11 19.1 11 18H7C7 19.1 7.9 20 9 20Z"
              fill="currentColor"/>
        </svg>
      </button>

      <NuxtLink v-else :to="to" class="catalog-item__btn">
        <span>Заказать</span>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M0.0920253 9.11633L7.20409 2.00427H0.676418V0.350437H10.0267V9.70073L8.37287 9.70073L8.37287 3.17306L1.26081 10.2851L0.0920253 9.11633Z"
              fill="#3F3F3F"/>
        </svg>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import type {Product} from "~/types/catalog";
import MarketplaceLinksButtons from "~/components/Catalog/MarketplaceLinksButtons.vue";
import {CatalogRestockNotify} from "#components";

const props = defineProps<{
  product: Product
}>();


function checkLinkMarketplace(links: Record<string, any>): boolean {
  if (!links || typeof links !== 'object') return false;
  return Object.values(links).some(link => link !== null && link !== '');
}


const {formattedPrice, getNormalPrice} = getFormatPrice();
const favouritesStore = useFavouritesStore();
const asideMenuStore = useAsideMenuStore();

// Image display logic
const currentImageIndex = ref(0);
const isHovering = ref(false);
const mouseX = ref(0);
const containerWidth = ref(0);
const touchStartX = ref(0);
const touchStartY = ref(0);
const touchDirection = ref<'none' | 'horizontal' | 'vertical'>('none');
const isMobile = ref(false);

// Limit images to maximum 7 (main + 6 additional)
const displayedImages = computed(() => {
  const imgs: Array<any> = props.product.images || [];
  const main = props.product.main_image;
  const mainId = main?.id;
  const mainPath = main?.path;

  // Фильтруем все изображения, которые совпадают с main по id или path
  const filtered = imgs.filter(img => {
    if (!img) return false;
    if (mainId && img.id) return img.id !== mainId;
    if (mainPath && img.path) return img.path !== mainPath;
    return true;
  });

  // Ограничение: максимум 6 дополнительных
  return filtered.slice(0, 6);
});

const displayedImagesWithMain = computed(() => {
  const result: Array<any> = [];
  if (props.product.main_image) result.push(props.product.main_image);

  for (const img of displayedImages.value) {
    // на всякий случай проверяем дубликаты (хотя displayedImages уже отфильтрован)
    const exists = result.some(r =>
        (r.id && img.id && r.id === img.id) || (r.path && img.path && r.path === img.path)
    );
    if (!exists) result.push(img);
  }

  return result;
});

const to = computed(() => {
  return {
    name: 'catalog-slug',
    params: {
      slug: props.product.slug || props.product.id
    }
  }
});

const isFavourite = computed(() => {
  return favouritesStore.isFavorite(props.product.id)
});

const shouldNotifyRestock = computed(() => {
  return props.product.cta === 'notify_restock' || Number(props.product.stock_quantity || 0) <= 0;
});

const openRestockNotify = () => {
  asideMenuStore.open(CatalogRestockNotify, {
    title: 'Узнать о поступлении',
    product: props.product,
  });
};

const isPrintColor = (code: string) => {
  return code && code.toLowerCase().includes('print');
};

// Desktop mouse movement effect
const handleMouseEnter = (event: MouseEvent) => {
  if (isMobile.value || displayedImages.value.length === 0) return;

  isHovering.value = true;
  const target = event.currentTarget as HTMLElement;
  containerWidth.value = target.offsetWidth;
  handleMouseMove(event);
};

const handleMouseLeave = () => {
  isHovering.value = false;
  currentImageIndex.value = 0; // Reset to main image when mouse leaves
};

const handleMouseMove = (event: MouseEvent) => {
  if (!isHovering.value || displayedImagesWithMain.value.length === 0) return;

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = event.clientX - rect.left;
  mouseX.value = x;

  const totalSegments = displayedImagesWithMain.value.length; // включает main
  const segmentWidth = containerWidth.value / totalSegments;
  const newIndex = Math.min(Math.floor(x / segmentWidth), totalSegments - 1);

  if (newIndex !== currentImageIndex.value) {
    currentImageIndex.value = newIndex;
  }
};

// Thumb position for visual indicator (оставил — не менял логику, можно использовать при необходимости)
const thumbStyle = computed(() => {
  if (!isHovering.value || displayedImages.value.length === 0) return {};

  const totalSegments = displayedImages.value.length + 1;
  const segmentWidth = 100 / totalSegments;
  const position = (currentImageIndex.value * segmentWidth) + (segmentWidth / 2);

  return {
    left: `${position}%`
  };
});

// Touch swipe for mobile
const handleTouchStart = (e: TouchEvent) => {
  if (!isMobile.value || displayedImages.value.length === 0) return;
  const touch = e.touches[0];
  if (!touch) return;

  touchStartX.value = touch.clientX;
  touchStartY.value = touch.clientY;
  touchDirection.value = 'none';
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isMobile.value || displayedImages.value.length === 0 || touchDirection.value === 'vertical') return;

  const touch = e.touches[0];
  if (!touch) return;

  const deltaX = touch.clientX - touchStartX.value;
  const deltaY = touch.clientY - touchStartY.value;

  // Определяем жест только после небольшого смещения, чтобы обычный тап
  // продолжал открывать товар.
  if (touchDirection.value === 'none' && Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= 8) {
    touchDirection.value = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
  }

  // Блокируем нативный жест только во время горизонтального перелистывания.
  // Вертикальное движение остаётся прокруткой страницы.
  if (touchDirection.value === 'horizontal') {
    e.preventDefault();
  }
};

const handleTouchEnd = (e: TouchEvent) => {
  if (!isMobile.value || displayedImages.value.length === 0 || touchDirection.value !== 'horizontal') {
    resetTouchGesture();
    return;
  }

  const touch = e.changedTouches[0];
  if (!touch) return;

  handleSwipe(touch.clientX - touchStartX.value);
  resetTouchGesture();
};

const handleSwipe = (deltaX: number) => {
  const swipeThreshold = 50;
  const total = displayedImagesWithMain.value.length; // включает main

  if (Math.abs(deltaX) > swipeThreshold && total > 0) {
    if (deltaX < 0) {
      // Swipe left - next image
      currentImageIndex.value = (currentImageIndex.value + 1) % total;
    } else {
      // Swipe right - previous image
      currentImageIndex.value = currentImageIndex.value === 0 ? total - 1 : currentImageIndex.value - 1;
    }
  }
};

const resetTouchGesture = () => {
  touchDirection.value = 'none';
};

// Check if device is mobile
onMounted(() => {
  isMobile.value = window.innerWidth <= 768;

  const handleResize = () => {
    isMobile.value = window.innerWidth <= 768;
  };

  window.addEventListener('resize', handleResize);

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
});
</script>

<style scoped lang="scss">
.cart_btns {
  margin-top: 10px;
}

.catalog-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: $mobile) {
    padding-bottom: 5rem;
  }

  &__media {
    $media: &;
    position: relative;
    display: block;

    &-container {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      touch-action: pan-y;
    }

    &-pic {
      min-height: 32.8rem;
      border-radius: 2rem;
      overflow: hidden;
      position: relative;
      @media (min-width: $tablet + 1px) {
        aspect-ratio: 3/4; // Только для десктопа
      }
    }

    &-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-position: center;
      object-fit: cover;
      transition: opacity 0.3s ease;

      &._hidden {
        opacity: 0;
        pointer-events: none;
      }

      &._active {
        opacity: 1;
      }
    }

    &-main {
      opacity: 1;
    }

    &-hover {
      opacity: 0;
    }
  }

  /* Hover indicator wrapper */
  &__hover-indicator {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 6;
    padding: 0.35rem 0.6rem;
    border-radius: 1rem;
    /* тонкий фон для контраста если нужно */
    background: rgba(0, 0, 0, 0.15);
  }

  &__hover-track {
    display: flex;
    gap: 0.45rem;
    align-items: center;
    justify-content: center;
    padding: 0.15rem 0.25rem;
  }

  /* Segments (bars) for desktop hover */
  &__hover-seg {
    width: 30px; /* длина черточки */
    height: 3px; /* толщина */
    border-radius: 2px;
    background: rgba(255, 106, 106, 0.5); /* неактивная — полупрозрачная белая */
    transition: background 0.2s ease, transform 0.15s ease;
    box-shadow: none;
  }

  &__hover-seg._active {
    background: #ff1a23; /* активная — красная */
    transform: scale(1.07);
  }

  /* Mobile swipe indicators (bars) */
  &__swipe-indicators {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    z-index: 6;
    align-items: center;
    justify-content: center;
  }

  &__swipe-indicators_desktop {
    position: absolute;
    bottom: 0.1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    z-index: 6;
    align-items: center;
    justify-content: center;
  }

  &__swipe-indicator {
    width: 16px;
    height: 3px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.45);
    transition: background 0.25s ease, transform 0.15s ease;
  }

  &__swipe-indicator._active {
    background: #CB0B13; /* активная — красная */
    transform: scale(1.05);
  }

  &__sale {
    position: absolute;

    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 7rem;
    min-height: 7rem;
    font-size: 1.3rem;
    top: 1rem;
    left: 1rem;

    background: var(--fg-white);
    text-align: center;
    background: var(--fg-red);
    color: var(--fg-white);
    z-index: 4;


    @media (max-width: $mobile) {
      min-width: 4rem;    // Уменьшаем с 7rem до 5rem
      min-height: 4rem;   // Уменьшаем с 7rem до 5rem
      font-size: 1rem;    // Уменьшаем шрифт с 1.3rem до 1rem
      top: 0.8rem;        // Немного корректируем отступ
      left: 0.8rem;
    }
    @media (max-width: $tablet) {
      min-width: 5rem;    // Уменьшаем с 7rem до 5rem
      min-height: 5rem;   // Уменьшаем с 7rem до 5rem
      font-size: 1rem;    // Уменьшаем шрифт с 1.3rem до 1rem
      top: 0.8rem;        // Немного корректируем отступ
      left: 0.8rem;
    }

  }

  &__fav {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    position: absolute;
    top: 1rem;
    right: .9rem;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: var(--fg-white);
    z-index: 5;

    & svg {
      max-width: 1.5rem;
    }

    & path {
      transition: var(--tr-regular);
    }

    &._active path {
      fill: #CB0B13;
      stroke: #CB0B13;
    }

    &:hover {
      & path {
        fill: #CB0B13;
        stroke: #CB0B13;
      }
    }
  }

  &__rating {
    display: flex;
    align-items: flex-start;
    position: absolute;
    bottom: 1.7rem;
    right: 1.5rem;
    z-index: 4;

    & svg {
      width: 1.5rem;
      height: auto;
    }

    & span {
      margin-top: .6rem;
      line-height: 100%;
      font-weight: 700;
      margin-right: .1rem;
      font-size: 1.4rem;
    }
  }

  &__content {
    padding-top: 1.6rem;
    color: var(--fg-black);
  }

  &__header {
    display: flex;
    //align-items: center;
    align-items: flex-start;
    //justify-content: space-between;
    flex-direction: column; // Переносим сюда!

    //margin-bottom: .5rem;
    gap: 0.5rem;

    //@media (max-width: $mobile) {
    //  flex-direction: column; // Переносим сюда!
    //  align-items: flex-start;
    //  gap: 0.5rem;
    //}
    //@media (max-width: $tablet) {
    //  flex-direction: column; // Переносим сюда!
    //  align-items: flex-start;
    //  gap: 0.5rem;
    //}

  }

  &__title {
    font-size: 1.8rem;
    font-weight: 300;
    color: #000;
    @media (max-width: $mobile) {
      font-size: 1.6rem; // Оставляем только размер шрифта
    }
  }

  &__price {
    display: flex;
    align-items: flex-end;
    color: var(--fg-black);
    min-width: fit-content;
    //margin-left: 1.5rem;
    margin-left: 0;
    //@media (max-width: $mobile) {
    //  margin-left: 0; // Убираем отступ слева
    //}
    //@media (max-width: $tablet) {
    //  margin-left: 0; // Убираем отступ слева
    //}

    &-new {
      font-size: 1.8rem;
      line-height: 100%;

      @media (max-width: $mobile) {
        font-size: 1.4rem;

      }
    }

    &-old {
      margin-left: .6rem;
      font-size: 1.3rem;
      line-height: 100%;
      opacity: .3;
      text-decoration: line-through;
      font-weight: 700;

      @media (max-width: $mobile) {
        font-size: 1rem;
      }
    }
  }

  &__subtitle {
    opacity: .5;

    @media (max-width: $mobile) {
      font-size: 1.2rem;
      margin-bottom: 0;
    }
  }

  &__colors {
    margin-top: 1.5rem;

    & .colors__item {
      margin-right: .634rem;

      &._print .colors__label {
        background: transparent;
        border: 2px solid #ccc;
        overflow: hidden;

        &::after {
          display: none;
        }
      }

      &._print .colors__label span {
        display: none;
      }

    }
  }


  &__btn {
    appearance: none;
    cursor: pointer;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.4rem 1.7rem 1.4rem 2.1rem;
    border: .1rem solid #3F3F3F;
    border-radius: 5.3rem;
    color: #3F3F3F;

    & span {
      min-width: 0;
    }

    &--notify {
      gap: 1rem;
      border-color: #CB0B13;
      background: #CB0B13;
      color: var(--fg-white);
      text-align: left;

      & span {
        line-height: 1.2;
      }
    }

    &-bell {
      width: 1.8rem;
      height: 2rem;
      flex-shrink: 0;
    }

    @media(any-hover: hover) {
      &:not(.catalog-item__btn--notify):hover {
        background: #3F3F3F;
        color: var(--fg-white);

        & path {
          fill: var(--fg-white);
        }
      }

      &--notify:hover {
        background: #A60910;
        border-color: #A60910;
        color: var(--fg-white);
      }
    }

    & path {
      transition: var(--tr-regular);
    }

    @media (max-width: $mobile) {
      margin-top: 0;
      padding: .9rem 1rem .7rem 1.5rem;
      font-size: 1rem;

      & svg {
        margin-left: 1rem;
      }
    }
  }

  &__status {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    border-radius: 2.4rem;
    padding: .3rem .8rem .3rem;
    background: var(--fg-red);
    color: var(--fg-white);
    font-size: 1rem;
    width: fit-content;
    min-width: fit-content;
    z-index: 4;

    @media (max-width: $mobile) {
      min-width: 9rem;
      text-align: center;
    }
  }

  &__drop {
    display: flex;
    align-items: center;
    margin-top: 1rem;

    & svg {
      width: 1.05rem;
      height: auto;
      margin-right: .8rem;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}


.colors__print-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}
</style>
