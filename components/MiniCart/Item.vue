<template>
  <div class="mini-cart__item">
    <div class="mini-cart__item-main">
      <div class="mini-cart__item-media">
        <picture class="mini-cart__item-media__pic img--cover">
          <img
              :src="getImage( image )"
              class="mini-cart__item-media__img"
              :alt="title"
          >
        </picture>
      </div>
      <div class="mini-cart__item-content">
        <div class="mini-cart__item-content__top">
          <div class="cart-item__title">{{ title }}</div>
          <div class="cart-item__variables" v-if="selectedColor || selectedVariant">
            <div class="cart-item__variables-item" v-if="selectedColor">{{ selectedColor.name }}</div>
            <div class="cart-item__variables-item" v-if="selectedVariant">{{ selectedVariant.size }}</div>
          </div>
        </div>
        <div class="mini-cart__item-content__bottom">
          <div class="price">
            <div class="price__new">{{ priceFormat.getNormalPrice( Number(price), Number(oldPrice) ) }} ₽</div>
            <div class="price__old" v-if="oldPrice">{{ priceFormat.formattedPrice( oldPrice ) }} ₽</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mini-cart__item-last">
      <button class="mini-cart__item-remove" @click="removeFromCart( itemKey )">
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.3">
            <path d="M14.875 4.236C12.5162 4.00225 10.1433 3.88184 7.7775 3.88184C6.375 3.88184 4.9725 3.95267 3.57 4.09434L2.125 4.236" stroke="#292D32" stroke-width="1.0625" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.01953 3.52074L6.17536 2.59283C6.2887 1.91991 6.3737 1.41699 7.57078 1.41699H9.42661C10.6237 1.41699 10.7158 1.94824 10.822 2.59991L10.9779 3.52074" stroke="#292D32" stroke-width="1.0625" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.3526 6.47412L12.8922 13.607C12.8143 14.7191 12.7505 15.5833 10.7743 15.5833H6.22677C4.25052 15.5833 4.18677 14.7191 4.10885 13.607L3.64844 6.47412" stroke="#292D32" stroke-width="1.0625" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.31641 11.6875H9.67516" stroke="#292D32" stroke-width="1.0625" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.73047 8.85449H10.2721" stroke="#292D32" stroke-width="1.0625" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </svg>
      </button>
      <CartQuantity
        :value="cartStore.getItemQuantity( itemKey )"
        :is-null-access="false"
        @get-quantity="getQuantity"
        @set-quantity-null="setQuantityNullAction"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
import SubmitRemove from "~/components/Modals/SubmitRemove.vue";

const props = defineProps<{
  image: string,
  id: number,
  title: string,
  quantity: number,
  price: string | number,
  oldPrice?: string | number,
  itemKey: string,
  selectedColor?: object,
  selectedVariant?: object,
}>();

const cartStore = useCartStore();
const { removeFromCart } = cartStore;
const modal = useModal();

const getQuantity = ( number: number ) => {
  cartStore.setCartQuantity( props.itemKey, number );
}

const setQuantityNullAction = () => {
  modal.openModal( SubmitRemove, {
    customClass: 'submitremove',
    cartItemKey: props.itemKey
  } )
}

const priceFormat = getFormatPrice();
</script>

<style scoped lang="scss">

</style>