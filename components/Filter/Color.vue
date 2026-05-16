<template>
    <div class="colors__list">
      <div class="colors__item" v-for="color in colors" :style="{ '--color': color.code }">
        <input
            type="radio"
            class="colors__input"
            name="color"
            :value="color.id"
            @change="change( color.id )"
        >
        <label for="color" class="colors__label"><span></span></label>
      </div>
    </div>
</template>

<script setup lang="ts">
import type {Color} from "~/types/catalog";

const props = defineProps<{
  colors?: [Color],
}>();

const emit = defineEmits(['selectColor']);
const change = ( value: number|string ) => {
  emit('selectColor', value);
}
</script>

<style scoped lang="scss">

</style>