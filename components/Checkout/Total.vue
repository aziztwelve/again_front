<template>
  <CartTotal
      :is-promocode="true"
      :is-border="true"
      :with-button="withButton"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  withButton?: boolean
}>(), {
  withButton: false,
});
</script>

<style scoped lang="scss">

</style>
