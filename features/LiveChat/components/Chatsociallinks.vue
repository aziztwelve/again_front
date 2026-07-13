<template>
  <div class="flex gap-2 m-4 bg-opacity-0 justify-center items-center flex-col">

    <!-- Кнопка: ЧАТ -->
    <div>

      <button
          type="button"
          @click.stop="emit('openChat')"
          class="w-[55px] h-[55px] rounded-full  text-white flex items-center justify-center transition-all duration-300 hover:scale-110  overflow-hidden p-2"
          title="Онлайн чат"
      >

        <img src="/icons/chat/icon-chat.png" alt="">
      </button>
      <div
          v-if="store.unreadCount > 0"
          class="absolute top-4 -right-1 w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center border-2 border-white"
      >
        {{ store.unreadCount > 99 ? '99+' : store.unreadCount }}

      </div>

    </div>

    <!-- VK -->
    <a
        v-if="vkUrl"
        :href="vkUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="w-[50px] h-[50px] rounded-full   flex items-center justify-center transition-all duration-300 hover:scale-110  overflow-hidden"
        title="Перейти в ВКонтакте"
    >
      <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#1976d2" d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"></path>
        <path fill="#fff"
              d="M35.937,18.041c0.046-0.151,0.068-0.291,0.062-0.416C35.984,17.263,35.735,17,35.149,17h-2.618 c-0.661,0-0.966,0.4-1.144,0.801c0,0-1.632,3.359-3.513,5.574c-0.61,0.641-0.92,0.625-1.25,0.625C26.447,24,26,23.786,26,23.199 v-5.185C26,17.32,25.827,17,25.268,17h-4.649C20.212,17,20,17.32,20,17.641c0,0.667,0.898,0.827,1,2.696v3.623 C21,24.84,20.847,25,20.517,25c-0.89,0-2.642-3-3.815-6.932C16.448,17.294,16.194,17,15.533,17h-2.643 C12.127,17,12,17.374,12,17.774c0,0.721,0.6,4.619,3.875,9.101C18.25,30.125,21.379,32,24.149,32c1.678,0,1.85-0.427,1.85-1.094 v-2.972C26,27.133,26.183,27,26.717,27c0.381,0,1.158,0.25,2.658,2c1.73,2.018,2.044,3,3.036,3h2.618 c0.608,0,0.957-0.255,0.971-0.75c0.003-0.126-0.015-0.267-0.056-0.424c-0.194-0.576-1.084-1.984-2.194-3.326 c-0.615-0.743-1.222-1.479-1.501-1.879C32.062,25.36,31.991,25.176,32,25c0.009-0.185,0.105-0.361,0.249-0.607 C32.223,24.393,35.607,19.642,35.937,18.041z"></path>
      </svg>
    </a>

    <!-- Telegram -->
    <a
        v-if="telegramUrl"
        :href="telegramUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="w-[50px] h-[50px] rounded-full  text-white flex items-center justify-center transition-all duration-300 hover:scale-110  overflow-hidden"
        title="Перейти в Telegram"
    >
      <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#29b6f6" d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"></path>
        <path fill="#fff"
              d="M33.95,15l-3.746,19.126c0,0-0.161,0.874-1.245,0.874c-0.576,0-0.873-0.274-0.873-0.274l-8.114-6.733 l-3.97-2.001l-5.095-1.355c0,0-0.907-0.262-0.907-1.012c0-0.625,0.933-0.923,0.933-0.923l21.316-8.468 c-0.001-0.001,0.651-0.235,1.126-0.234C33.667,14,34,14.125,34,14.5C34,14.75,33.95,15,33.95,15z"></path>
        <path fill="#b0bec5"
              d="M23,30.505l-3.426,3.374c0,0-0.149,0.115-0.348,0.12c-0.069,0.002-0.143-0.009-0.219-0.043 l0.964-5.965L23,30.505z"></path>
        <path fill="#cfd8dc"
              d="M29.897,18.196c-0.169-0.22-0.481-0.26-0.701-0.093L16,26c0,0,2.106,5.892,2.427,6.912 c0.322,1.021,0.58,1.045,0.58,1.045l0.964-5.965l9.832-9.096C30.023,18.729,30.064,18.416,29.897,18.196z"></path>
      </svg>
    </a>


    <!-- Max -->
    <a
        v-if="maxUrl"
        :href="maxUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 overflow-hidden"
        title="Перейти в Max"
    >
      <img src="/icons/chat/max.svg" alt="Max" class="w-[42px] h-[42px] object-contain">
    </a>

    <!-- Email -->
    <a
        href="mailto:help@again8.ru"
        class="w-[48px] h-[48px] rounded-full text-white flex items-center justify-center transition-all duration-300 hover:scale-110 overflow-hidden"
        title="Написать Email"
    >

      <img src="/icons/chat/email.png"
           alt="Email"
           class="w-[68x] h-[68px] object-cover"
      >

    </a>


    <!-- Кнопка: Закрыть меню -->
    <button
        type="button"
        @click="emit('closeMenu')"
        class="w-[45px] h-[45px] rounded-full  flex items-center justify-center transition-all duration-300 hover:scale-110 "
        title="Закрыть"
    >
      <svg class="w-7 h-7 " xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100"
           viewBox="0 0 50 50">
        <path
            d="M 7.7070312 6.2929688 L 6.2929688 7.7070312 L 23.585938 25 L 6.2929688 42.292969 L 7.7070312 43.707031 L 25 26.414062 L 42.292969 43.707031 L 43.707031 42.292969 L 26.414062 25 L 43.707031 7.7070312 L 42.292969 6.2929688 L 25 23.585938 L 7.7070312 6.2929688 z"></path>
      </svg>

    </button>

  </div>
</template>

<script setup lang="ts">
import {useLiveChatStore} from "~/features/LiveChat/stores/useLiveChatStore";
import {onMounted, ref} from "vue";
import {getExternalIdClient} from "~/features/LiveChat/composables/useChatFunctions";
import {useGetMessengerLinks} from "~/features/LiveChat/composables/useChatApi";

const emit = defineEmits<{
  openChat: []
  closeMenu: []
}>()


const store = useLiveChatStore()

// Не показываем кнопки мессенджеров, пока API не вернёт deeplink с токеном.
// Иначе пользователь может успеть открыть бот по ссылке без привязки чата.
const telegramUrl = ref<string | null>(null)
const maxUrl = ref<string | null>(null)
const vkUrl = ref<string | null>(null)

onMounted(async () => {
  try {
    const externalId = await getExternalIdClient()
    const {links} = await useGetMessengerLinks(externalId)
    if (links?.telegram) telegramUrl.value = links.telegram
    if (links?.max) maxUrl.value = links.max
    if (links?.vk) vkUrl.value = links.vk
  } catch (e) {
    // Без токена не даём перейти в бот: при следующем открытии виджета запрос
    // будет повторён, так как компонент создаётся заново.
  }
})

</script>

<style scoped>
/* SVG масштабируются под размер кнопки */
svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
