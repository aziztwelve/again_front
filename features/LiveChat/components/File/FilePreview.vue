<template>
  <Transition name="slide-up">
    <div
        v-if="files.length > 0"
        class="border-t border-gray-200 bg-white px-4 py-3"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-2">
        <span class="text-lg text-gray-600 font-medium">
          Файлов: {{ files.length }}
        </span>
        <button
            @click="emit('clearAll')"
            class="text-lg text-red-500 hover:text-red-600 font-medium"
        >
          Очистить все
        </button>
      </div>

      <!-- Files list -->
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <div
            v-for="file in files"
            :key="file.id"
            class="relative flex-shrink-0"
        >
          <!-- Image preview -->
          <div
              v-if="file.type === 'image' && file.preview"
              class="relative w-[50px] h-[50px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 "
          >
            <img
                :src="file.preview"
                :alt="file.name"
                class="w-full h-full object-cover"
            />

            <!-- Remove button -->
            <button
                @click="emit('remove', file.id)"
                class="absolute top-1 right-1 w-6 h-6 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Upload progress -->
<!--            <div-->
<!--                v-if="file.uploadProgress !== undefined && file.uploadProgress < 100"-->
<!--                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"-->
<!--            >-->
<!--              <span class="text-white text-xs font-medium">{{ file.uploadProgress }}%</span>-->
<!--            </div>-->

            <!-- Error overlay -->
            <div
                v-if="file.error"
                class="absolute inset-0 bg-red-500 bg-opacity-80 flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <!-- Audio/File preview -->
          <div
              v-else
              class="relative w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 flex flex-col items-center justify-center p-2"
          >
            <!-- Icon -->
            <div class="mb-1">
              <!-- Audio icon -->
              <svg
                  v-if="file.type === 'audio'"
                  class="w-8 h-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>

              <!-- File icon -->
              <svg
                  v-else
                  class="w-8 h-8 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>

            <!-- File name (truncated) -->
            <span class="text-xs text-gray-600 text-center line-clamp-1 w-full px-1">
              {{ truncateFileName(file.name, 10) }}
            </span>

            <!-- Remove button -->
            <button
                @click="emit('remove', file.id)"
                class="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Upload progress -->
            <div
                v-if="file.uploadProgress !== undefined && file.uploadProgress < 100"
                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg"
            >
              <span class="text-white text-xs font-medium">{{ file.uploadProgress }}%</span>
            </div>

            <!-- Error overlay -->
            <div
                v-if="file.error"
                class="absolute inset-0 bg-red-500 bg-opacity-80 flex items-center justify-center rounded-lg"
                :title="file.error"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <!-- File size -->
          <div class="text-xs text-gray-500 text-center mt-1">
            {{ formatFileSize(file.size) }}
          </div>
        </div>
      </div>

      <!-- Error message -->
      <div
          v-if="hasErrors"
          class="mt-2 text-xs text-red-600 flex items-start gap-1"
      >
        <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Некоторые файлы не были загружены</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PendingFile } from '~/features/LiveChat/types'
import { formatFileSize } from '~/features/LiveChat/types'

interface Props {
  files: PendingFile[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  remove: [id: string]
  clearAll: []
}>()

// Проверка наличия ошибок
const hasErrors = computed(() => {
  return props.files.some(file => file.error)
})

// Обрезать имя файла
const truncateFileName = (name: string, maxLength: number): string => {
  if (name.length <= maxLength) return name

  const extension = name.split('.').pop() || ''
  const nameWithoutExt = name.substring(0, name.lastIndexOf('.'))
  const truncated = nameWithoutExt.substring(0, maxLength - extension.length - 3)

  return `${truncated}...${extension}`
}
</script>

<style scoped>
/* Custom scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Slide up animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* Line clamp utility */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>