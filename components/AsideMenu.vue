<template>
  <Teleport to="#teleports">
    <div class="aside-menu" :class="{ '_active': isActive ? isActive : false }" data-aside-block="">
      <div class="aside-menu__block">
        <div class="aside-menu__head">
          <div class="aside-menu__head-left">
            <div class="aside-menu__title fz-h2" v-if="props.title">{{ props.title }}</div>
            <div class="aside-menu__counter" v-if="props.counter !== undefined && props.counter !== null && props.counter !== ''">
              {{ props.counter }}
            </div>
          </div>
          <button class="aside-menu__close aside-menu--close" @click="asideMenuStore.close()">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.3" d="M16 1L1 16" stroke="#191919"/>
              <path opacity="0.3" d="M1 1L16 16" stroke="#191919"/>
            </svg>
          </button>
        </div>

        <component :is="view" v-model="model"></component>

      </div>
      <div class="aside-menu__bg aside-menu--close"></div>
    </div>
  </Teleport>

</template>

<script setup lang="ts">
const model = ref({});
const asideMenuStore = useAsideMenuStore();
const { isActive, view, props } = storeToRefs(asideMenuStore);
</script>

<style scoped lang="scss">

</style>
