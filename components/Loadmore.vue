<template>
  <div>
    <button class="btn loadmore__button" @click="emitLoadMore">Показать еще</button>
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
.loadmore__button {
  border-color: var(--bg-filter-button);
  background-color: var(--bg-filter-button);
}

</style>
