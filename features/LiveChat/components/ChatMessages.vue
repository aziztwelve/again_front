<template>
  <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-2"
  >
    <!-- Empty state -->
    <div
        v-if="messages.length == 0"
        class="h-full flex flex-col items-center justify-center text-gray-500"
    >
      <svg
          class="w-12 h-12 mb-2 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
      >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <p class="text-md">Напишите свой вопрос</p>
<!--      <p class="text-md">Напишите первое сообщение</p>-->
    </div>

    <!-- Messages list -->
    <div v-else class="space-y-3">
      <ChatMessageItem
          v-for="message in messages"
          :key="message.id"
          :message="message"
          @delete="handleDelete"
          @retry="handleRetry"
      />
    </div>

    <!-- Scroll anchor -->
    <div ref="messagesEnd" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import type { Message } from '~/features/LiveChat/types/chat'
import ChatMessageItem from './ChatMessageItem.vue'

const props = defineProps<{
  messages: Message[]
}>()

const emit = defineEmits<{
  delete: [id: string | number]
  retry: [id: string | number]
}>()

const messagesContainer = ref<HTMLElement>()
const messagesEnd = ref<HTMLElement>()

// Auto-scroll к новому сообщению
const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
  nextTick(() => {
    messagesEnd.value?.scrollIntoView({ behavior })
  })
}

// Следим за изменением сообщений
watch(
    () => props.messages.length,
    () => {
      scrollToBottom('smooth')
    }
)

// Скроллим при монтировании
onMounted(() => {
  scrollToBottom('auto')
})

const handleDelete = (id: string | number) => {
  emit('delete', id)
}

const handleRetry = (id: string | number) => {
  emit('retry', id)
}


</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>