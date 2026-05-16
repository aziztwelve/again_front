<template>
  <div class="relative">
    <!-- Hidden file input -->
    <input
        ref="fileInput"
        type="file"
        :accept="acceptedTypes"
        :multiple="multiple"
        class="hidden"
        @change="handleFileSelect"
    />

    <!-- Button -->
    <button
        type="button"
        :disabled="disabled"
        @click="openFilePicker"
        class="w-14 h-14 rounded-lg flex items-center justify-center transition-colors"
        :class="[
          disabled
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
        ]"
        :title="title"
    >
      <!-- Paperclip icon -->
      <svg
          class="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
      >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
        />
      </svg>
    </button>

    <!-- Error tooltip -->
    <Transition name="fade">
      <div
          v-if="error"
          class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-red-500 text-white text-xs rounded-lg whitespace-nowrap shadow-lg"
      >
        {{ error }}
        <div
            class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-red-500"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import type {PendingFile} from '~/features/LiveChat/types'
import {
  validateFile,
  getAttachmentTypeFromMime,
  MAX_FILES_COUNT,
  ALLOWED_FILE_TYPES
} from '~/features/LiveChat/types'

interface Props {
  disabled?: boolean
  multiple?: boolean
  maxFiles?: number
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  multiple: true,
  maxFiles: MAX_FILES_COUNT,
  title: 'Прикрепить файл (JPG, PNG, MP3, WAV, OGG, M4A)'
})

const emit = defineEmits<{
  filesSelected: [files: PendingFile[]]
  error: [message: string]
}>()

const fileInput = ref<HTMLInputElement>()
const error = ref<string>('')

// Accepted file types для input
const acceptedTypes = computed(() => {
  return ALLOWED_FILE_TYPES.join(',')
})

// Открыть диалог выбора файлов
const openFilePicker = () => {
  if (props.disabled) return
  fileInput.value?.click()
}

// Обработка выбора файлов
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])

  // Сбрасываем ошибку
  error.value = ''

  if (files.length === 0) return

  // Проверка количества файлов
  if (files.length > props.maxFiles) {
    showError(`Максимум ${props.maxFiles} файлов за раз`)
    resetInput()
    return
  }

  // Валидация и обработка каждого файла
  const pendingFiles: PendingFile[] = []

  for (const file of files) {
    // Валидация файла
    const validation = validateFile(file)
    if (!validation.valid) {
      showError(validation.error || 'Ошибка валидации файла')
      resetInput()
      return
    }

    // Создаем preview для изображений
    let preview: string | undefined
    if (file.type.startsWith('image/')) {
      preview = await createImagePreview(file)
    }

    // Формируем объект PendingFile
    const pendingFile: PendingFile = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file: file,
      preview: preview,
      type: getAttachmentTypeFromMime(file.type),
      size: file.size,
      name: file.name,
      uploadProgress: 0
    }

    pendingFiles.push(pendingFile)
  }

  // Отправляем файлы родителю
  emit('filesSelected', pendingFiles)

  // Сбрасываем input
  resetInput()
}

// Создание preview для изображения
const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }

    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'))
    }

    reader.readAsDataURL(file)
  })
}

// Показать ошибку
const showError = (message: string) => {
  error.value = message
  emit('error', message)

  // Автоматически скрыть через 3 секунды
  setTimeout(() => {
    error.value = ''
  }, 3000)
}

// Сбросить input
const resetInput = () => {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>