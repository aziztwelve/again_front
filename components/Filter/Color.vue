<template>
    <div class="colors__list">
      <div
          v-for="color in colors"
          :key="color.id"
          class="colors__item"
          :class="{
            '_white': isWhiteColor(color.code),
            '_print': isPrintColor(color.code),
          }"
          :style="isPrintColor(color.code) ? {} : { '--color': color.code }"
      >
        <input
            :id="`filter-color-${color.id}`"
            type="radio"
            class="colors__input"
            name="color"
            :value="color.id"
            @change="change( color.id )"
        >
        <label :for="`filter-color-${color.id}`" class="colors__label">
          <span v-if="!isPrintColor(color.code)"></span>
          <img
              v-else
              :src="`/img_colors_print/${color.name}.jpg`"
              :alt="color.name"
              class="colors__print-img"
          >
        </label>
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

const isPrintColor = (code: string) => {
  return code?.toLowerCase().includes('print');
}
</script>

<style scoped lang="scss">
.colors__item .colors__label {
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}

.colors__item .colors__input:checked + .colors__label {
  border-color: #343434;
  box-shadow: 0 0 0 .2rem var(--fg-white), 0 0 0 .4rem #343434;
  transform: scale(1.08);
  position: relative;
  z-index: 1;
}

.colors__item._print {
  --color: #3a3a3a;

  .colors__label {
    border: .2rem solid #ccc;
    overflow: hidden;
  }
}

.colors__print-img {
  display: block;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}

</style>
