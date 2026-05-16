<template>
  <div class="product-reviews__item">


    <!-- Текст отзыва -->
    <div class="product-reviews__item-text" v-if="content">
      <div
          class="product-reviews__item-text-content"
          :class="{ '_clamped': !isExpanded }"
          v-html="content"
          ref="textContentRef"
      ></div>
      <button
          v-if="isTextLong"
          class="product-reviews__item-toggle"
          @click="toggleExpand"
      >
        {{ isExpanded ? 'Скрыть' : 'Показать ещё' }}
      </button>
    </div>



    <!-- Звёзды и иконка кавычек -->
    <div class="product-reviews__item-flex">
      <div class="product-reviews__item-stars">
        <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg" v-for="star in rating" :key="star">
          <path d="M6.75667 0.193448C6.91076 -0.0676563 7.28848 -0.0676558 7.44257 0.193448L9.3186 3.37249C9.37461 3.46741 9.46746 3.53487 9.57504 3.55881L13.1782 4.36065C13.4742 4.4265 13.5909 4.78574 13.3902 5.01297L10.9464 7.77956C10.8735 7.86216 10.838 7.97132 10.8485 8.08103L11.1993 11.7556C11.2282 12.0574 10.9226 12.2795 10.6444 12.1588L7.25811 10.6896C7.157 10.6457 7.04223 10.6457 6.94113 10.6896L3.55479 12.1588C3.27666 12.2795 2.97107 12.0574 2.99989 11.7556L3.35075 8.08103C3.36122 7.97131 3.32576 7.86216 3.25279 7.77956L0.809064 5.01297C0.608354 4.78574 0.725078 4.4265 1.02102 4.36065L4.62419 3.55881C4.73178 3.53487 4.82463 3.46741 4.88064 3.37249L6.75667 0.193448Z" fill="#F7BB2B"/>
        </svg>
      </div>
      <div class="product-reviews__item-icon">"</div>
    </div>

    <!-- Футер: имя пользователя + лайк (в самом низу) -->
    <div class="product-reviews__item-footer">
      <div class="product-reviews__item-user">
        <div class="product-reviews__item-user__content">
          <div class="product-reviews__item-user__name" v-if="userName">{{ userName }}</div>
          <div class="product-reviews__item-user__date">{{ date }}</div>
        </div>
      </div>

      <ClientOnly>
        <button
            class="product-reviews__item-like"
            :class="{ '_active': review.is_liked }"
            @click="handleLike"
            :disabled="isLiking"
        >
          <span class="product-reviews__item-like-icon">👍</span>
          <span class="product-reviews__item-like-count" v-if="likesCount > 0">{{ likesCount }}</span>
        </button>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Review } from "~/types/review";

const props = defineProps<{
  rating: number;
  content?: string;
  userName?: string;
  date: string;
  review: Review;
}>();

const { toggleLike } = useReviewLikes();
const authStore = useAuthStore();

const isExpanded = ref(false);
const isTextLong = ref(false);
const likesCount = ref(props.review.likes_count || 0);
const isLiking = ref(false);
const textContentRef = ref<HTMLElement | null>(null); // Добавляем ref

// Проверяем, длинный ли текст (больше 5 строк)
onMounted(() => {
  nextTick(() => {
    if (textContentRef.value) {
      const lineHeight = parseFloat(window.getComputedStyle(textContentRef.value).lineHeight);
      const height = textContentRef.value.scrollHeight;
      const lines = Math.round(height / lineHeight);
      isTextLong.value = lines > 5;
    }
  });
});

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const handleLike = async () => {
  if (!authStore.isAuthenticated) {
    alert('Необходима авторизация для лайков');
    return;
  }

  isLiking.value = true;

  const result = await toggleLike(props.review);

  if (result?.success) {
    // Обновляем локальный счётчик и статус
    likesCount.value = result.likes_count;
    props.review.is_liked = !props.review.is_liked;
  }

  isLiking.value = false;
};
</script>



<style scoped lang="scss">
.product-reviews__item {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-reviews__item-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.product-reviews__item-text {
  flex: 1;
  margin-bottom: 1rem;
}

.product-reviews__item-text-content {
  transition: max-height 0.3s ease;

  &._clamped {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &:not(._clamped) {
    max-height: 100px; // Максимальная высота при раскрытии
    overflow-y: auto; // Скролл если текст очень длинный
    padding-right: 0.5rem; // Отступ для скроллбара

    // Стилизация скроллбара
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: #CB0B13;
      border-radius: 10px;

      &:hover {
        background: #a00a10;
      }
    }
  }
}

.product-reviews__item-toggle {
  margin-top: 0.5rem;
  color: #CB0B13;
  font-size: 1.4rem;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
}

.product-reviews__item-footer {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
}

.product-reviews__item-like {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e8e8e8;
  }

  &._active {
    background: #CB0B13;
    border-color: #CB0B13;

    .product-reviews__item-like-icon {
      filter: grayscale(0);
    }

    .product-reviews__item-like-count {
      color: white;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.product-reviews__item-like-icon {
  font-size: 1.6rem;
  filter: grayscale(1);
  transition: filter 0.3s ease;
}

.product-reviews__item-like-count {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
}
</style>