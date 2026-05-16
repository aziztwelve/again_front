<template>
  <div class="cart-item">
    <div class="cart-item__main">
      <div class="checkbox cart-table__item-checkbox _icon">
        <input type="checkbox" class="checkbox__input" name="items[]" value="">
        <span class="checkbox__icon"></span>
      </div>
      <div class="cart-item__product">
        <div class="cart-item__media">
          <picture class="cart-item__media-pic">
            <img
                :src="getImage( product.main_image?.path ? product.main_image?.path : '' )"
                class="cart-item__media-img"
                :alt="product.name"
            >
          </picture>
        </div>
        <div class="cart-item__content">
          <div class="cart-item__content-top">
            <div class="cart-item__title">{{ product.name }}</div>
            <CartVariants
                class="checkout-cart__item-variables"
                :variant="product.selected_variant"
                :color="product.selected_color"
            />
          </div>
          <div class="cart-item__content-bottom">
            <ClientOnly>
              <button
                  class="cart-item__content-fav add--fav"
                  :class="{ '_active': isFavorite }"
                  @click="favouritesStore.toggleFavourites( product )"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.518 17.3418C10.2346 17.4418 9.76797 17.4418 9.48464 17.3418C7.06797 16.5168 1.66797 13.0752 1.66797 7.24183C1.66797 4.66683 3.74297 2.5835 6.3013 2.5835C7.81797 2.5835 9.15964 3.31683 10.0013 4.45016C10.843 3.31683 12.193 2.5835 13.7013 2.5835C16.2596 2.5835 18.3346 4.66683 18.3346 7.24183C18.3346 13.0752 12.9346 16.5168 10.518 17.3418Z" stroke="#838383" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </ClientOnly>
            <div class="cart-item__price price" v-if="product.price">
              <div class="price__new">{{ getFormatPrice().getNormalPrice( product.price, product.old_price ) }} ₽</div>
              <div class="price__old" v-if="product.old_price">{{ getFormatPrice().formattedPrice( product.old_price ) }} ₽</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Quantity
        class="cart-item__quantity"
        :value="product.quantity"
        :with-title="false"
        @get-quantity="getQuantity"
    />
    <div class="cart-item__last">
      <div class="cart-item__price price" v-if="product.price">
        <div class="price__new">{{ getNormalPrice( product.price, product.old_price ) }} ₽</div>
        <div class="price__old" v-if="product.old_price">{{ formattedPrice( product.old_price ) }} ₽</div>
      </div>
      <button class="cart-item__remove" @click="cartStore.removeFromCart( product.item_key )">
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
      <Quantity
          class="cart-item__quantity _mobile"
          :value="product.quantity"
          :with-title="false"
          @get-quantity="getQuantity"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import type {Product} from "~/types/catalog";

const props = defineProps<{
  product: Product
}>();

const getQuantity = ( value: number ) => {
  console.log( props.product.item_key );
  cartStore.setCartQuantity( props.product.item_key, value );
}

const cartStore = useCartStore();
const favouritesStore = useFavouritesStore();

const isFavorite = computed( () => {
  return favouritesStore.isFavorite( props.product.id )
} );

const { getNormalPrice, formattedPrice } = getFormatPrice();
</script>

<style scoped lang="scss">
.cart-item__content-fav {
  &._active {
    & path {
      fill: var(--fg-red);
      stroke: var(--fg-red);
    }
  }
}
</style>