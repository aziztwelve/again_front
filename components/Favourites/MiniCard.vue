<template>
  <div class="mini-cart__item">
    <div class="mini-cart__item-main">
      <div class="mini-cart__item-media">
        <picture class="mini-cart__item-media__pic img--cover">
          <img
              :src="getImage( product.main_image?.path ? product.main_image?.path : '' )"
              class="mini-cart__item-media__img"
              :alt="product.name"
          >
        </picture>
        <button class="mini-cart__item-fav" @click="favouritesStore.toggleFavourites( product )">
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.108 0C8.841 0 7.707 0.593258 7 1.50337C6.293 0.593258 5.159 0 3.892 0C1.743 0 0 1.68539 0 3.76854C0 4.57079 0.133 5.31236 0.364 6C1.47 9.37079 4.879 11.3865 6.566 11.9393C6.804 12.0202 7.196 12.0202 7.434 11.9393C9.121 11.3865 12.53 9.37079 13.636 6C13.867 5.31236 14 4.57079 14 3.76854C14 1.68539 12.257 0 10.108 0Z" fill="#CB0B13"/>
          </svg>
        </button>
      </div>
      <div class="mini-cart__item-content">
        <NuxtLink :to="to" class="mini-cart__item-content__top">
          <div class="cart-item__title">{{ product.name }}</div>
        </NuxtLink>
        <div class="mini-cart__item-content__bottom">
          <button class="mini-cart__item-fav _mobile" @click="favouritesStore.toggleFavourites( product )">
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.108 0C8.841 0 7.707 0.593258 7 1.50337C6.293 0.593258 5.159 0 3.892 0C1.743 0 0 1.68539 0 3.76854C0 4.57079 0.133 5.31236 0.364 6C1.47 9.37079 4.879 11.3865 6.566 11.9393C6.804 12.0202 7.196 12.0202 7.434 11.9393C9.121 11.3865 12.53 9.37079 13.636 6C13.867 5.31236 14 4.57079 14 3.76854C14 1.68539 12.257 0 10.108 0Z" fill="#CB0B13"/>
            </svg>
          </button>
          <div class="price" v-if="product.price">
            <div class="price__new">{{ getFormatPrice().getNormalPrice( product.price, product.old_price ) }} ₽</div>
            <div class="price__old" v-if="product.old_price">{{ product.old_price }} ₽</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mini-cart__item-last">
      <template v-if="product.stock_quantity > 0">
        <Quantity
            :value="1"
            :with-title="false"
            @get-quantity="getQuantity"
        />
        <button
            v-if="product.price"
            class="mini-cart__item-btn"
            @click="cartStore.addToCart( product, quantity )"
        >
          в корзину
        </button>
      </template>
      <template v-else>
        <div class="mini-cart__item-not">Нет в наличии</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Product} from "~/types/catalog";

const props = defineProps<{
  product: Product
}>();

const cartStore = useCartStore();
const favouritesStore = useFavouritesStore();

const quantity = ref( 1 );
const getQuantity = ( value: number ) => {
  quantity.value = value;
}

const to = computed( () => {
  return {
    name: 'catalog-slug',
    params: {
      slug: props.product.id
    }
  }
} )
</script>

<style scoped lang="scss">

</style>