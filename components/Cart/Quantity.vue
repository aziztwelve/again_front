<template>
  <Quantity
    :value="value"
    :is-null-access="isNullAccess"
  />
</template>

<script setup lang="ts">
defineProps<{
  value: number,
  isNullAccess: boolean
}>();
</script>

<style scoped lang="scss">

</style>