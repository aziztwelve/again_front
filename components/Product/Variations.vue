<template>
  <div class="product__variables product-variables">
    <div class="product-variables__block" data-type="color" v-if="colors?.length">
      <div class="product-variables__header">
        <div class="product-variables__title">Цвет:</div>
      </div>
      <div class="product-variables__values">
        <div
            class="product-variables__color"
            v-for="(color, key) in colors"
            :key="color.id"
            :style="isPrintColor(color.code) ? {} : { '--color': color.code }"
            :class="{
              '_white': color.code === '#FFFFFF',
              '_print': isPrintColor(color.code)
            }"
        >
          <input
              type="radio"
              name="color"
              :value="color.id"
              :checked="selectedColor && selectedColor.id === color.id"
              @change="emitColor(color)"
          >
          <label for="">
            <img
                v-if="isPrintColor(color.code)"
                :src="`/img_colors_print/${color.name}.jpg`"
                :alt="color.name"
                class="product-variables__print-img"
                :class="{ '_active': selectedColor && selectedColor.id === color.id }"
            >
          </label>
        </div>
      </div>
    </div>


    <div class="product-variables__block" data-type="size" v-if="sizes && sizes.length > 0 ">

      <div v-if="product?.name != GIFT_CERTIFICATE">
        <div class="product-variables__header">
          <div class="product-variables__title">Размер:</div>
          <button
              class="product-variables__link"
              @click="modal.openModal( ModalsSizes, { customClass: 'sizes' } )">
            Таблица размеров
          </button>
        </div>
        <div class="product-variables__values">
          <div class="product-variables__size" v-for="(size, key) in sizes" :key="size.id">
            <input
                type="radio"
                name="size"
                :value="size.id"
                :checked="selectedSize && selectedSize.id === size.id"
                :disabled="size.quantity === 0"
                @change="emitSize(size)"
            >
            <label>{{ size.size }}</label>
          </div>
        </div>
      </div>


      <div v-else>

        <div class="product-variables__header">
          <div class="product-variables__title">Номинал:</div>
        </div>

        <div class="product-variables__values">
          <div class="product-variables__size"
               v-for="(size, key) in sizes.sort((a,b) => a.price - b.price)"
               :key="size.id">
            <input
                type="radio"
                name="size"
                :value="size.id"
                :checked="selectedSize && selectedSize.id === size.id"
                :disabled="size.quantity === 0"
                @change="emitSize(size)"
            >
            <label>{{ getNormPrice(size.price) }}</label>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import type {AvailableVariation, Color, Product} from '~/types/catalog';
import {ModalsSizes} from '#components';
import {getFormatPrice} from "~/utils/getFormatPrice";
import {GIFT_CERTIFICATE} from "~/constants";

const props = defineProps<{
  variations?: AvailableVariation[],
  colors?: Color[],
  product: Product,
}>();

const modal = useModal();
const emit = defineEmits(['getColor', 'getSize']);

const selectedSize = ref<AvailableVariation | null>(null);
const selectedColor = ref<Color | null>(null);

const sizes = computed(() => {
  if (!props.variations || !props.variations.length) return [];

  if (!selectedColor.value) {
    return props.variations.slice();
  }

  const data = props.variations.filter(item => Number(item.color_id) === Number(selectedColor.value!.id));
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  return data.sort((a, b) => {
    const indexA = sizeOrder.indexOf(a.size) === -1 ? Infinity : sizeOrder.indexOf(a.size);
    const indexB = sizeOrder.indexOf(b.size) === -1 ? Infinity : sizeOrder.indexOf(b.size);
    return indexA - indexB;
  });
});

// Проверка, является ли цвет принтом
const isPrintColor = (code: string) => {
  return code && code.toLowerCase().includes('print');
};

onMounted(() => {
  const variations = props.variations ?? [];
  const colors = props.colors ?? [];

  if (variations.length) {
    selectedSize.value = variations[0];

    const matchedColor = colors.find(c => c.id === variations[0].color_id) ?? colors[0] ?? null;
    selectedColor.value = matchedColor ?? null;

    emit('getColor', selectedColor.value);
    emit('getSize', selectedSize.value);
    return;
  }

  if (colors.length) {
    selectedColor.value = colors[0];
    emit('getColor', selectedColor.value);
  }
});

const emitSize = (size: AvailableVariation) => {
  selectedSize.value = size;
  emit('getSize', size);
}


const emitColor = (color: Color) => {
  selectedColor.value = color;
  emit('getColor', color);

  if (selectedSize.value && Number(selectedSize.value.color_id) === Number(color.id)) {
    return;
  }

  const dataForColor = (props.variations ?? []).filter(v => Number(v.color_id) === Number(color.id));
  const newSize = dataForColor.length ? dataForColor[0] : null;

  selectedSize.value = newSize;
  emit('getSize', newSize);
}


const getNormPrice = (price: number | string): string => {
  if (!price) return ''

  const priceNorm = Number(price).toFixed(0);

  return priceNorm.toString();
}

</script>

<style scoped lang="scss">
.product-variables__print-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;


  &._active {
    padding: 2px;
    //border: 2px solid #ff0000;
  }
}

.product-variables__color._print label {
  background: transparent;
  border: 2px solid #9a9a9a;
  overflow: hidden;

  &::after {
    display: none;
  }
}
</style>