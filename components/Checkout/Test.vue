<template>
  <FormInput name="test" v-model="firstName" />
</template>

<script setup lang="ts">
const firstName = defineModel('firstName')
</script>

<style scoped lang="scss">

</style>