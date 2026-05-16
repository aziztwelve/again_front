<template>
  <div class="bg-white border-t border-gray-200">
    <!-- File preview -->
    <FilePreview
        :files="pendingFiles"
        @remove="handleRemoveFile"
        @clearAll="handleClearAllFiles"
    />

    <!-- Input area -->
    <div class="px-4 py-3 flex items-center gap-2">
      <!-- File upload button -->


      <!-- Input field -->
      <input
          v-model="messageText"
          type="text"
          placeholder="Сообщение..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-[15px] placeholder-gray-500"
          :disabled="disabled"
          @keydown.enter="handleSend"
      />


      <FileUploadButton
          :disabled="disabled || loading"
          @files-selected="handleFilesSelected"
          @error="handleFileError"
      />

      <!-- Send button -->
      <button
          class="w-14 h-14 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canSend || loading"
          @click="handleSend"
          title="Отправить (Enter)"
      >
        <svg
            v-if="!loading"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.40564168,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346273 C3.34915502,0.9 2.40564168,0.9 1.77946707,1.4314701 C0.994623095,2.0636948 0.837654326,3.0605983 1.15159189,3.9031824 L3.03521743,10.3441754 C3.03521743,10.5012728 3.19218622,10.6583702 3.50612381,10.6583702 L16.6915026,11.4438571 C16.6915026,11.4438571 17.1624089,11.4438571 17.1624089,12.0760818 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"
          />
        </svg>
        <svg
            v-else
            class="w-5 h-5 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
          />
          <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </button>




    </div>

    <!-- Error notification -->
    <Transition name="slide-down">
      <div
          v-if="fileError"
          class="px-4 py-2 bg-red-50 border-t border-red-200 text-red-600 text-sm flex items-center gap-2"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ fileError }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PendingFile } from '~/features/LiveChat/types'
import FileUploadButton from './File/FileUploadButton.vue'
import FilePreview from './File/FilePreview.vue'

interface Props {
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  send: [content: string, files: PendingFile[]]
}>()

const messageText = ref('')
const pendingFiles = ref<PendingFile[]>([])
const fileError = ref<string>('')

// Можно ли отправить сообщение
const canSend = computed(() => {
  return (messageText.value.trim().length > 0 || pendingFiles.value.length > 0) && !props.disabled
})

// Обработка выбора файлов
const handleFilesSelected = (files: PendingFile[]) => {
  pendingFiles.value.push(...files)

  // Очистить ошибку
  fileError.value = ''
}

// Удалить один файл
const handleRemoveFile = (fileId: string) => {
  pendingFiles.value = pendingFiles.value.filter(f => f.id !== fileId)
}

// Очистить все файлы
const handleClearAllFiles = () => {
  pendingFiles.value = []
}

// Обработка ошибки выбора файла
const handleFileError = (error: string) => {
  fileError.value = error

  // Автоматически скрыть через 5 секунд
  setTimeout(() => {
    fileError.value = ''
  }, 5000)
}

// Отправить сообщение
const handleSend = () => {
  if (!canSend.value || props.loading) return

  const content = messageText.value.trim()
  const files = [...pendingFiles.value]

  // Должен быть либо текст, либо файлы
  if (!content && files.length === 0) return

  // Отправляем
  emit('send', content, files)

  // Очищаем форму
  messageText.value = ''
  pendingFiles.value = []
  fileError.value = ''
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>