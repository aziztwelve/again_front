<template>
  <div class="inline-block">
    <!-- Image attachment -->
    <div
        v-if="attachment.type === 'image'"
        class="relative group cursor-pointer"
        @click="openImage"
    >
      <img
          :src="attachment.url"
          :alt="attachment.file_name"
          class="w-full h-full rounded-lg object-cover"
          loading="lazy"
      />

      <!-- Overlay on hover -->
      <div
          class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
        <svg
            class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
        </svg>
      </div>

      <!-- File size badge -->
      <div
          v-if="attachment.file_size"
          class="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded"
      >
        {{ formatFileSize(attachment.file_size) }}
      </div>
    </div>

    <!-- Audio attachment -->
    <div
        v-else-if="attachment.type === 'audio'"
        class="flex items-center gap-3 rounded-lg p-3 min-w-[250px] max-w-[300px]"
        :class="props.isOutgoing ? 'bg-red-500 bg-opacity-20' : 'bg-gray-100'"
    >
      <!-- Play button -->
      <button
          @click="toggleAudio"
          class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
      >
        <svg
            v-if="!isPlaying"
            class="w-5 h-5 ml-0.5"
            fill="currentColor"
            viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z"/>
        </svg>
        <svg
            v-else
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
        >
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      </button>

      <!-- Audio info -->
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-gray-900 truncate">
          {{ attachment.file_name }}
        </div>
        <div class="text-xs text-gray-500 flex items-center gap-2">
          <span v-if="attachment.file_size">
            {{ formatFileSize(attachment.file_size) }}
          </span>
          <span v-if="duration">• {{ formatDuration(duration) }}</span>
        </div>
      </div>

      <!-- Download button -->
      <a
          :href="attachment.url"
          :download="attachment.file_name"
          class="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors"
          title="Скачать"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
      </a>

      <!-- Hidden audio element -->
      <audio
          ref="audioElement"
          :src="attachment.url"
          @ended="handleAudioEnded"
          @loadedmetadata="handleAudioLoaded"
      />
    </div>

    <!-- File attachment -->
    <div
        v-else
        class="flex items-center gap-3 rounded-lg p-3 cursor-pointer transition-colors min-w-[250px] max-w-[300px]"
        :class="props.isOutgoing ? 'bg-red-500 bg-opacity-20 hover:bg-opacity-30' : 'bg-gray-100 hover:bg-gray-200'"
        @click="downloadFile"
    >
      <!-- File icon -->
      <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-300 flex items-center justify-center">
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      </div>

      <!-- File info -->
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-gray-900 truncate">
          {{ attachment.file_name }}
        </div>
        <div class="text-xs text-gray-500">
          {{ attachment.file_size ? formatFileSize(attachment.file_size) : 'Файл' }}
        </div>
      </div>

      <!-- Download icon -->
      <svg class="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import type {Attachment} from '~/features/LiveChat/types'
import {formatFileSize} from '~/features/LiveChat/types'

interface Props {
  attachment: Attachment
  isOutgoing?: boolean

}

const props = withDefaults(defineProps<Props>(), {
  isOutgoing: false
})

const emit = defineEmits<{
  imageClick: [url: string]
}>()

// Audio player state
const audioElement = ref<HTMLAudioElement>()
const isPlaying = ref(false)
const duration = ref<number>(0)

// Open image in new tab or lightbox
const openImage = () => {
  emit('imageClick', props.attachment.url)
  // Или открыть в новой вкладке:
  // window.open(props.attachment.url, '_blank')
}

// Toggle audio playback
const toggleAudio = () => {
  if (!audioElement.value) return

  if (isPlaying.value) {
    audioElement.value.pause()
    isPlaying.value = false
  } else {
    audioElement.value.play()
    isPlaying.value = true
  }
}

// Handle audio ended
const handleAudioEnded = () => {
  isPlaying.value = false
}

// Handle audio loaded
const handleAudioLoaded = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration
  }
}

// Download file
const downloadFile = () => {
  const link = document.createElement('a')
  link.href = props.attachment.url
  link.download = props.attachment.file_name
  link.click()
}

// Format duration (seconds to MM:SS)
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
/* Smooth transitions */
button {
  transition: all 0.2s ease;
}

/* Image hover effect */
img {
  transition: transform 0.2s ease;
}

img:hover {
  transform: scale(1.02);
}
</style>