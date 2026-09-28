<template>
  <div
      class="videos__item"
      :class="{ '_started': hasStarted }"
      :role="hasStarted ? undefined : 'button'"
      :tabindex="hasStarted ? undefined : 0"
      :aria-label="hasStarted ? undefined : 'Воспроизвести видеоотзыв'"
      @click="playVideo"
      @keydown.enter.prevent="playVideo"
      @keydown.space.prevent="playVideo"
  >
    <!-- Один плеер остаётся в карточке: без модалки и перехода из страницы. -->
    <video
        ref="videoPlayer"
        :src="videoUrl"
        class="videos__thumbnail"
        :controls="hasStarted"
        playsinline
        preload="metadata"
        @click="hasStarted && $event.stopPropagation()"
        @loadedmetadata="setPreviewFrame"
        @play="hasStarted = true"
    />

    <button
        v-if="!hasStarted"
        type="button"
        class="videos__play-btn"
        aria-label="Воспроизвести видеоотзыв"
        @click.stop="playVideo"
    >
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
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  videoUrl: string
}>()

const videoPlayer = ref<HTMLVideoElement | null>(null)
const hasStarted = ref(false)

const playVideo = async () => {
  if (!videoPlayer.value) return

  try {
    await videoPlayer.value.play()
    hasStarted.value = true
  } catch {
    // Браузер покажет свою ошибку плеера, если формат видео не поддерживается.
  }
}

const setPreviewFrame = () => {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = 0.1
  }
}
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

  &:focus-visible {
    outline: .2rem solid var(--accent, #cb0b13);
    outline-offset: .3rem;
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

</style>
