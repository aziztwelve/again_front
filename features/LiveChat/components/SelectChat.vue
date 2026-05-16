<template>
  <div class="">

    <ChatBadge
        v-if="!isOpen && !showMenu"
        @click="showMenu = true"
    />


    <!-- МЕНЮ ВЫБОРА (открывается с анимацией) -->
    <Transition name="slide-fade">
      <div v-if="showMenu && !isOpen"
           class="absolute bottom-0 right-0 max-md:right-[-18px]"
      >

        <Chatsociallinks
            @open-chat="handleOpenChat"
            @close-menu="showMenu = false"
        />

      </div>
    </Transition>


  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import ChatBadge from "~/features/LiveChat/components/ChatBadge.vue";
import Chatsociallinks from "~/features/LiveChat/components/Chatsociallinks.vue";

const showMenu = ref(false)
const isOpen = ref(false)


const emit = defineEmits(["openChat"]);


const handleOpenChat = () => {
  emit("openChat");
}

</script>

<style scoped>
/* Анимация открытия справа */
.slide-fade-enter-active {
  animation: slideInRight 0.3s ease-out;
}

.slide-fade-leave-active {
  animation: slideOutRight 0.3s ease-in;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>