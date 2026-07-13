<template>
  <section class="reviews">
    <div class="reviews__container container">
      <div class="product-reviews__header">
        <div class="product-reviews__title block__title fz-h2">Отзывы</div>
        <div class="product-reviews__header-right">
          <div class="swiper__nav">
            <button class="swiper__arrow _border swiper__arrow--prev product-reviews__prev">
              <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.146447 4.35355C-0.0488155 4.15829 -0.0488155 3.84171 0.146447 3.64645L3.32843 0.464466C3.52369 0.269204 3.84027 0.269204 4.03553 0.464466C4.2308 0.659728 4.2308 0.97631 4.03553 1.17157L1.20711 4L4.03553 6.82843C4.2308 7.02369 4.2308 7.34027 4.03553 7.53553C3.84027 7.7308 3.52369 7.7308 3.32843 7.53553L0.146447 4.35355ZM1 4.5L0.5 4.5L0.5 3.5L1 3.5L1 4.5Z" fill="black"/>
              </svg>
            </button>
            <button class="swiper__arrow _border swiper__arrow--next product-reviews__next">
              <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.85355 4.35355C5.04882 4.15829 5.04882 3.84171 4.85355 3.64645L1.67157 0.464466C1.47631 0.269204 1.15973 0.269204 0.964466 0.464466C0.769204 0.659728 0.769204 0.97631 0.964466 1.17157L3.79289 4L0.964466 6.82843C0.769204 7.02369 0.769204 7.34027 0.964466 7.53553C1.15973 7.7308 1.47631 7.7308 1.67157 7.53553L4.85355 4.35355ZM4 4.5L4.5 4.5L4.5 3.5L4 3.5L4 4.5Z" fill="black"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <ClientOnly>
        <swiper-container
            v-if="reviews?.success && reviewsList.length"
            class="swiper product-reviews__swiper"
            :slidesPerView="1.3"
            :spaceBetween="10"
            :navigation="{
              nextEl: '.product-reviews__next',
              prevEl: '.product-reviews__prev',
            }"
            :breakpoints="{
            0: {
              slidesPerView: 1.3,
              spaceBetween: 10,
            },
            575: {
              slidesPerView: 2.5,
              spaceBetween: 10,
            },
            992: {
              slidesPerView: 4,
              spaceBetween: 16,
            }
          }"
        >
          <swiper-slide v-for="review in reviewsList" :key="review.id">
            <ReviewsCard
                :review="review"
            />
          </swiper-slide>
        </swiper-container>
        <div v-else>Отзывов не добавлено</div>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import {ModalsReview} from "#components";
import type {Review} from "~/types/review";
import { register } from 'swiper/element/bundle';
import "swiper/css";
import "swiper/css/pagination";

register();

const { data: reviews } = await useApi<{
  success: boolean,
  data: Review[],
}>( '/reviews/home-random' );

const modal = useModal();
const openModal = () => {
  modal.openModal( ModalsReview, {
    customClass: 'review'
  } )
}

const reviewsList = computed(() => reviews.value?.data ?? []);
</script>

<style scoped lang="scss">
.reviews {
  padding: 3.5rem 0 9rem;

  @media (max-width: $mobile) {
    padding: 2.5rem 0 2.25rem;
  }
}

// У главного слайдера отзывы должны пролистываться и на desktop. Базовый
// product-reviews__header скрывает стрелки только для карточки товара.
.reviews .product-reviews__header .swiper__nav {
  display: flex;
}

.reviews__row {
  max-width: 98.2rem;
  margin: 0 auto;
}

.reviews__btn {
  margin-top: 4rem;
}

.reviews-item {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 3rem;

  &:last-child {
    margin-bottom: 0;
  }

  &:nth-child(even) {
    .reviews-item__media {
      order: 2;
    }

    .reviews-item__content {
      order: 1;
      margin-left: 0;
      margin-right: 3.3rem;
    }
  }

  @media (max-width: $mobile) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 2rem;

    .reviews-item__media {
      order: 2 !important;
      margin-top: 1rem;
    }

    .reviews-item__content {
      order: 1 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      width: 100% !important;
    }
  }
}

.reviews-item__media {
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  overflow: hidden;

  @media (max-width: $mobile) {
    width: 4.9rem;
    height: 4.9rem;
    margin-left: 0 !important;
  }
}

.reviews-item__content {
  width: calc(100% - 10rem);
  margin-left: 3.3rem;
  padding: 3.1rem 4.3rem 3.2rem 5rem;
  background: #F3F4F8;
  border-radius: 1rem;

  @media (max-width: $mobile) {
    padding: 2.2rem 1.5rem 2.3rem;
  }
}

.reviews-item__text {
  & > * {
    margin-bottom: 1.7rem;
    font-size: var(--fz-1-5);
    color: var(--fg-gray);
    line-height: 130%;

    &:last-child {
      margin-bottom: 0;
    }

    @media (max-width: $mobile) {
      font-size: var(--fz-regular);
    }
  }
}

.reviews-item__name {
  margin-top: 1rem;
  color: var(--fg-gray);
  opacity: .5;
}

.reviews swiper-slide {
  height: auto;
  display: flex;

}



.reviews swiper-slide .product-reviews__item {
  width: 100%;
  display: flex;
  flex-direction: column;
}

</style>
