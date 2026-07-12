<template>
  <section class="product__reviews product-reviews" aria-labelledby="product-reviews-title">
    <header class="product-reviews__header">
      <h2 id="product-reviews-title" class="product-reviews__title block__title fz-h2">
        Отзывы<span v-if="total !== null && !isOutOfSync"> ({{ total }})</span>
      </h2>
      <button type="button" class="product-reviews__button" @click="openModal">Написать отзыв</button>
    </header>

    <div v-if="isInitialLoading" class="product-reviews__skeletons" aria-hidden="true">
      <div v-for="index in 4" :key="index" class="product-reviews__skeleton" />
    </div>
    <p v-if="isInitialLoading" class="sr-only" aria-live="polite">Загружаем отзывы</p>

    <div v-else-if="initialError" class="product-reviews__state" role="alert">
      <p>Не удалось загрузить отзывы.</p>
      <button v-if="initialError.retryable" type="button" class="btn _border" @click="refresh">Повторить</button>
    </div>

    <div v-else-if="total === 0" class="product-reviews__state">
      У этого товара пока нет отзывов. Станьте первым, кто поделится впечатлением.
    </div>

    <template v-else>
      <div class="product-reviews__grid" role="list">
        <div v-for="review in items" :key="review.id" role="listitem">
          <ReviewsCard :review="review" />
        </div>
      </div>

      <div v-if="isOutOfSync" class="product-reviews__state" aria-live="polite">
        <p>Список отзывов изменился.</p>
        <button type="button" class="btn _border" @click="refresh">Обновить отзывы</button>
      </div>
      <div v-else class="product-reviews__pagination">
        <p>Показано {{ shownCount }} из {{ total }}</p>
        <p v-if="loadMoreError" role="alert">Не удалось загрузить ещё отзывы.</p>
        <button
          v-if="hasMore"
          type="button"
          class="btn _border product-reviews__more"
          :disabled="isLoadingMore"
          @click="loadMore"
        >{{ isLoadingMore ? 'Загрузка…' : (loadMoreError?.retryable ? 'Повторить' : 'Показать ещё отзывы') }}</button>
        <p v-else-if="shownCount === total" tabindex="-1" aria-live="polite">Все {{ total }} отзывов показаны</p>
      </div>
    </template>

    <p class="sr-only" aria-live="polite">
      <template v-if="addedCount">Добавлено {{ addedCount }} отзывов. Показано {{ shownCount }} из {{ total }}.</template>
    </p>
    <button type="button" class="product-reviews__button _mobile" @click="openModal">Написать отзыв</button>
  </section>
</template>

<script setup lang="ts">
import { ModalsReview } from '#components';

const props = defineProps<{ productId: number }>();
const {
  items, total, isInitialLoading, isLoadingMore, initialError, loadMoreError,
  isOutOfSync, hasMore, shownCount, addedCount, loadMore, refresh,
} = await useProductReviews(toRef(props, 'productId'));

const modal = useModal();
const openModal = () => modal.openModal(ModalsReview, { customClass: 'review', productId: props.productId });
</script>

<style scoped lang="scss">
.product-reviews__header { display:flex; align-items:center; justify-content:space-between; gap:2rem; margin-bottom:2.4rem; }
.product-reviews__grid,.product-reviews__skeletons { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:1.6rem; align-items:start; }
.product-reviews__skeleton { min-height:24rem; border-radius:2.2rem; background:linear-gradient(90deg,#f6f5f3 25%,#ece9e4 50%,#f6f5f3 75%); background-size:200% 100%; animation:skeleton 1.3s infinite; }
.product-reviews__pagination,.product-reviews__state { display:flex; flex-direction:column; align-items:center; gap:1.2rem; margin-top:2rem; text-align:center; }
.product-reviews__more { display:inline-flex !important; }
.product-reviews__button { cursor:pointer; }
.product-reviews__button._mobile { display:none; width:100%; margin-top:2rem; }
button:focus-visible { outline:2px solid var(--fg-red); outline-offset:3px; }
.sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
@keyframes skeleton { to { background-position:-200% 0; } }
@media (max-width:$tablet) {
  .product-reviews__grid,.product-reviews__skeletons { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .product-reviews__skeleton:nth-child(n+3),.product-reviews__header .product-reviews__button { display:none; }
  .product-reviews__button._mobile { display:block; }
}
@media (max-width:$mobile) {
  .product-reviews__grid,.product-reviews__skeletons { grid-template-columns:minmax(0,1fr); }
  .product-reviews__skeleton:nth-child(n+2) { display:none; }
}
@media (prefers-reduced-motion:reduce) { .product-reviews__skeleton { animation:none; } }
</style>
