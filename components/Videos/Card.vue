<template>
  <div class="videos__item" @click="openModal">
    <!-- Превью видео (первый кадр) -->
    <video
        ref="videoPreview"
        :src="videoUrl"
        class="videos__thumbnail"
        muted
        playsinline
        preload="metadata"
    ></video>

    <!-- Кнопка Play -->
    <button class="videos__play-btn">
      <svg
          width="60"
          height="60"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="48" fill="rgba(255,255,255,0.7)" />
        <polygon points="40,30 75,50 40,70" fill="#CB0B13" />
      </svg>
    </button>
  </div>

  <!-- Модальное окно -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isModalOpen" class="video-modal" @click="closeModal">
        <div class="video-modal__content" @click.stop>
          <!-- Видеоплеер -->
          <video
              ref="videoPlayer"
              :src="videoUrl"
              class="video-modal__player"
              controls
              autoplay
              playsinline
          ></video>

          <!-- Кнопка закрытия -->
          <button @click="closeModal" class="video-modal__close">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M24 8L8 24M8 8L24 24" stroke="white" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  videoUrl: string
}>()

const isModalOpen = ref(false)
const videoPreview = ref<HTMLVideoElement | null>(null)
const videoPlayer = ref<HTMLVideoElement | null>(null)

// Открыть модальное окно
const openModal = () => {
  isModalOpen.value = true
  // Блокируем скролл body
  document.body.style.overflow = 'hidden'
}

// Закрыть модальное окно
const closeModal = () => {
  isModalOpen.value = false
  // Разблокируем скролл body
  document.body.style.overflow = ''

  // Останавливаем видео
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.currentTime = 0
  }
}

// Загружаем первый кадр для превью
onMounted(() => {
  if (videoPreview.value) {
    videoPreview.value.currentTime = 0.1 // Берём кадр с 0.1 секунды
  }
})
</script>

<style scoped lang="scss">
.videos__item {
  width: 100%;
  height: 44rem;
  position: relative;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  min-height: 44rem;

  @media (max-width: 600px) {
    height: 30rem;
    min-height: unset;
    aspect-ratio: 9 / 16;
  }

  &:hover {
    transform: scale(1.02);
  }

  .videos__thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .videos__play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease;
    z-index: 2;

    &:hover {
      transform: translate(-50%, -50%) scale(1.1);
    }
  }
}

// Модальное окно
.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;

  @media (max-width: $mobile) {
    padding: 1rem;
  }
}

.video-modal__content {
  position: relative;
  width: 100%;
  max-width: 120rem;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-modal__player {
  width: 100%;
  max-height: 90vh;
  border-radius: 1rem;
  box-shadow: 0 2rem 6rem rgba(0, 0, 0, 0.5);
}

.video-modal__close {
  position: absolute;
  top: -4rem;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  @media (max-width: $mobile) {
    top: -5rem;
    width: 4.5rem;
    height: 4.5rem;
  }
}

// Анимация появления модалки
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>