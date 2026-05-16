<template>
  <div
      class="relative md:w-28 md:h-28 w-[50px] h-[50px] cursor-pointer"
      @click="handleClick"
  >


    <!-- Фон кнопки -->
    <button
        class="w-full h-full rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center animate-pulse"
        :class="{ 'animate-pulse': hasUnread }"
    >
      <img src="/icons/chat/icon-chat.png" alt="" class="">

    </button>

    <!-- Бейдж с количеством непрочитанных -->
    <div
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 w-10 h-10 max-md:w-8 max-md:max-h-8 rounded-full bg-green-600 text-white text-md max-md:text-md font-bold flex items-center justify-center border-2 border-white"
    >
      {{ unreadCount > 99 ? '99+' : unreadCount }}
    </div>

    <!-- Tooltip -->
    <div
        class="absolute bottom-full right-0 mb-3 bg-gray-900 text-white text-sm px-3 py-2 rounded opacity-0 pointer-events-none transition-opacity duration-300 whitespace-nowrap"
        :class="{ 'opacity-100': isHovered }"
    >
      Онлайн-чат
      <div
          class="absolute top-full right-3 w-2 h-2 bg-gray-900 rotate-45"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLiveChatStore } from '~/features/LiveChat/stores/useLiveChatStore'

const store = useLiveChatStore()
const isHovered = ref(false)

const unreadCount = computed(() => store.unreadCount)
const hasUnread = computed(() => store.hasUnreadMessages)




const handleClick = () => {
  emit('click')
}

const emit = defineEmits<{
  click: []
}>()
</script>