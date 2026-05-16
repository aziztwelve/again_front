<template>
  <Breadcrumbs />

  <div class="faq-page page-padding">
    <HomeFaq />
  </div>
</template>

<script setup lang="ts">
definePageMeta( {
  title: 'FAQ',
} )
</script>

<style scoped lang="scss">
.faq-page {
  :deep(.faq) {
    border-radius: 0;
  }
}
</style>