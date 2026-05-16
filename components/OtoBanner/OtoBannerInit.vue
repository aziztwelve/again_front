<template>
  <div></div>
</template>

<script setup lang="ts">
const { initOtoBanner } = useOtoBanner()

onMounted(() => {
  initOtoBanner()
})
</script>