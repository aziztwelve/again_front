<template>
  <article class="product-reviews__item">
    <div v-if="review.content" class="product-reviews__item-text">
      <div
        :id="contentId"
        ref="textContentRef"
        class="product-reviews__item-text-content"
        :class="{ '_clamped': !isExpanded }"
      >{{ review.content }}</div>
      <button
        v-if="isTextLong"
        type="button"
        class="product-reviews__item-toggle"
        :aria-expanded="isExpanded"
        :aria-controls="contentId"
        @click="isExpanded = !isExpanded"
      >{{ isExpanded ? 'Скрыть' : 'Показать ещё' }}</button>
    </div>

    <div class="product-reviews__item-flex">
      <div class="product-reviews__item-stars" :aria-label="`Оценка: ${safeRating} из 5`">
        <svg
          v-for="star in 5"
          :key="star"
          width="14" height="13" viewBox="0 0 14 13"
          aria-hidden="true"
          :class="{ '_active': star <= safeRating }"
        ><path d="M6.75667 0.193448C6.91076 -0.0676563 7.28848 -0.0676558 7.44257 0.193448L9.3186 3.37249C9.37461 3.46741 9.46746 3.53487 9.57504 3.55881L13.1782 4.36065C13.4742 4.4265 13.5909 4.78574 13.3902 5.01297L10.9464 7.77956C10.8735 7.86216 10.838 7.97132 10.8485 8.08103L11.1993 11.7556C11.2282 12.0574 10.9226 12.2795 10.6444 12.1588L7.25811 10.6896C7.157 10.6457 7.04223 10.6457 6.94113 10.6896L3.55479 12.1588C3.27666 12.2795 2.97107 12.0574 2.99989 11.7556L3.35075 8.08103C3.36122 7.97131 3.32576 7.86216 3.25279 7.77956L0.809064 5.01297C0.608354 4.78574 0.725078 4.4265 1.02102 4.36065L4.62419 3.55881C4.73178 3.53487 4.82463 3.46741 4.88064 3.37249L6.75667 0.193448Z" /></svg>
      </div>
      <div class="product-reviews__item-icon" aria-hidden="true">&quot;</div>
    </div>

    <div class="product-reviews__item-footer">
      <div>
        <div class="product-reviews__item-user__name">{{ authorName }}</div>
        <time v-if="formattedDate" :datetime="formattedDate.datetime" class="product-reviews__item-user__date">
          {{ formattedDate.text }}
        </time>
      </div>
      <button
        type="button"
        class="product-reviews__item-like"
        :class="{ '_active': isLiked }"
        :disabled="isLiking"
        :aria-pressed="isLiked"
        :aria-busy="isLiking"
        :aria-label="isLiked ? 'Убрать отметку «полезный отзыв»' : 'Отметить отзыв как полезный'"
        @click="handleLike"
      ><span aria-hidden="true">👍</span><span v-if="likesCount > 0">{{ likesCount }}</span></button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Review } from '~/types/review';

const props = defineProps<{ review: Review }>();
const { toggleLike } = useReviewLikes();
const authStore = useAuthStore();
const isExpanded = ref(false);
const isTextLong = ref(false);
const isLiked = ref(props.review.is_liked);
const likesCount = ref(props.review.likes_count);
const isLiking = ref(false);
const textContentRef = ref<HTMLElement | null>(null);
const contentId = `review-content-${props.review.id}`;
const safeRating = computed(() => Math.min(5, Math.max(0, Number(props.review.rating) || 0)));
const authorName = computed(() => props.review.client?.name?.trim() || 'Покупатель');
const formattedDate = computed(() => formatReviewDate(props.review.published_at ?? props.review.created_at));

const measureOverflow = () => nextTick(() => {
  const element = textContentRef.value;
  if (!element || isExpanded.value) return;
  isTextLong.value = element.scrollHeight > element.clientHeight + 1;
});

useResizeObserver(textContentRef, measureOverflow);
onMounted(measureOverflow);
watch(() => props.review.content, () => { isExpanded.value = false; void measureOverflow(); });
watch(() => props.review.id, () => {
  isExpanded.value = false;
  isTextLong.value = false;
});
watch(() => [props.review.is_liked, props.review.likes_count] as const, ([liked, count]) => {
  if (!isLiking.value) { isLiked.value = liked; likesCount.value = count; }
});

const handleLike = async () => {
  if (!authStore.isAuthenticated) { alert('Необходима авторизация для лайков'); return; }
  if (isLiking.value) return;
  isLiking.value = true;
  const result = await toggleLike(props.review.id, isLiked.value);
  if (result.success) { isLiked.value = !isLiked.value; likesCount.value = result.likes_count; }
  isLiking.value = false;
};
</script>

<style scoped lang="scss">
.product-reviews__item { display:flex; flex-direction:column; width:100%; height:auto; min-height:0; padding:2rem; border-radius:2.2rem; background:#F6F5F3; }
.product-reviews__item-text { margin-bottom:1rem; }
.product-reviews__item-text-content { white-space:pre-line; overflow-wrap:anywhere; }
.product-reviews__item-text-content._clamped { display:-webkit-box; -webkit-line-clamp:5; -webkit-box-orient:vertical; overflow:hidden; }
.product-reviews__item-toggle { margin-top:.5rem; padding:0; border:0; color:var(--fg-red); background:none; cursor:pointer; text-decoration:underline; }
.product-reviews__item-flex,.product-reviews__item-footer { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
.product-reviews__item-flex { margin:1rem 0; }
.product-reviews__item-footer { margin-top:auto; padding-top:1rem; align-items:flex-end; }
.product-reviews__item-stars { display:flex; gap:.3rem; }
.product-reviews__item-stars svg path { fill:#d7d3cc; }
.product-reviews__item-stars svg._active path { fill:#F7BB2B; }
.product-reviews__item-like { display:flex; align-items:center; gap:.5rem; padding:.5rem 1rem; border:1px solid #e0e0e0; border-radius:2rem; cursor:pointer; }
.product-reviews__item-like._active { color:white; border-color:var(--fg-red); background:var(--fg-red); }
.product-reviews__item-like:disabled { cursor:wait; opacity:.6; }
button:focus-visible { outline:2px solid var(--fg-red); outline-offset:3px; }
@media (prefers-reduced-motion: reduce) { * { transition:none !important; } }
</style>
