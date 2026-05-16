<template>
  <div>
    <button class="btn _border _gray" @click="emitLoadMore">Показать еще</button>
  </div>
</template>

<script setup lang="ts">
const page = ref( 1 );
const emit = defineEmits(['loadMore']);
const emitLoadMore = () => {
  page.value += 1;
  emit('loadMore', page.value);
}
</script>

<style scoped lang="scss">

</style>