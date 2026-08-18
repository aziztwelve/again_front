<template>
  <CartTotal
      :is-promocode="true"
      :is-border="true"
      :with-button="withButton"
      :with-delivery="true"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  withButton?: boolean
}>(), {
  withButton: false,
});
</script>

<style scoped>

</style>
