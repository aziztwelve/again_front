<template>
  <button class="product__actions-cart btn" @click="emitAddToCart">В корзину</button>
</template>

<script setup lang="ts">
import type {Product} from "~/types/catalog";
import {GIFT_CERTIFICATE} from "~/constants";

const props = withDefaults( defineProps<{
  quantity: number,
  product: Product,
  variation?: object | null,
  color?: object | null,
}>(), {
  quantity: 1,
  variation: null,
  color: null
} );

const cartStore = useCartStore();
const { addToCart } = cartStore;
const emit = defineEmits(['addToCart']);

const emitAddToCart = () => {

  addToCart( props.product, props.quantity, props.variation, props.color );
  emit( "addToCart" );
}
</script>


<style scoped lang="scss">

</style>