<template>
  <div class="filter__block filter__price">
    <div class="filter__block-title">{{ title }}</div>
    <div class="filter__block-list">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>();
</script>

<style scoped lang="scss">

</style>