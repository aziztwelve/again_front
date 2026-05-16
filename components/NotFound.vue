<template>
  <div class="not__found">
    <div class="not__found-text" :class="{ 'fz-h2': isTitle }">{{ text }}</div>
    <NuxtLink class="not__found-btn btn _left" v-if="to" :to="to" @click="emit( 'clickToButton' )">В каталог</NuxtLink>
  </div>
</template>

<script setup lang="ts">
withDefaults( defineProps<{
  text?: string,
  isTitle?: boolean,
  to?: string
}>(), {
  text: 'Пока здесь пусто',
  isTitle: false,
} );

const emit = defineEmits(['clickToButton']);
</script>


<style scoped lang="scss">
.not__found {
  &-btn {
    margin-top: 1.5rem;
  }
}
</style>