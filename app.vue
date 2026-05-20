<template>
  <div class="">
    <Preloader/>
    <NuxtLayout>
      <Top/>
      <Header/>
      <div class="wrapper">
        <NuxtPage/>
      </div>
      <Footer/>
    </NuxtLayout>

    <Livechatwidget/>
  </div>
  <ClientOnly>
    <OtoBannerInit/>
  </ClientOnly>
  <Toast/>
</template>

<script setup lang="ts">
import Livechatwidget from "~/features/LiveChat/components/Livechatwidget.vue";

const {init: cartInit} = useCartStore();
const {init: cookieInit} = useCookieStore();

useBirthdayReminder();

onMounted(() => {
  cartInit();
  cookieInit();
})
</script>