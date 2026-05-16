<template>


  <div
      class="h-25 bg-gradient-to-r from-red-300 to-red-600 text-white px-4 py-3 flex items-center justify-between border-b border-red-100 "
  >

    <!-- Левая часть: аватар и инфо -->
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <!-- Аватар -->
      <div
          class="w-14 h-14 rounded-full bg-red-400 flex items-center justify-center flex-shrink-0 overflow-hidden"
      >
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>

      <!-- Имя и статус -->
      <div class="min-w-0">
        <h3 class="font-sans text-md truncate text-gray-800">
          {{
            user?.profile?.first_name || user?.profile?.last_name
                ? `${user?.profile?.first_name ?? ''} ${user?.profile?.last_name ?? ''}`
                : 'Клиент'
          }}
        </h3>
        <p class="text-[12px]">
          Онлайн-чат
        </p>
      </div>
    </div>

    <!-- Правая часть: кнопки действий -->
    <div class="flex items-center gap-2 flex-shrink-0">

      <!-- Кнопка закрытия -->
      <button
          class="w-12 h-12 rounded-full hover:bg-red-500 transition-colors flex items-center justify-center"
          @click="handleClose"
          title="Закрыть"
      >
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
              d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Conversation} from '~/features/LiveChat/types/chat'
import Chatsociallinks from "~/features/LiveChat/components/Chatsociallinks.vue";


const authStore = useAuthStore();
const {user} = authStore;

defineProps<{
  conversation: Conversation | null
  isOnline?: boolean
}>()

const emit = defineEmits<{
  close: []
  minimize: []
}>()

const handleClose = () => {
  emit('close')
}

const handleMinimize = () => {
  emit('minimize')
}
</script>