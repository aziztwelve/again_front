  <template>
    <Breadcrumbs/>
    <div class="product" v-if="product">
      <div
          class="product__added"
          :class="{ 'product__added--active': isAddedMessageActive }"
      >
        Товар добавлен в корзину
      </div>


      <div class="product__container container">
        <div class="product__top">
          <ProductGallery
              class="product__gallery"
              :product="product"
              :selected-color="selectedColor"
              :selected-size="selectedSize"
          />

          <div class="product__main">
            <ProductHeader
                :sku="product.code"
                :rating="product.avg_rating"
            />
            <h1 class="product__title">{{ product.name }}</h1>


            <ProductPrice
                v-if="getCurrentPrice()"
                :price="getCurrentPrice()"
                :old-price="getCurrentOldPrice()"
            />

            <div class="product__drops" v-if="product.absorbency_level > 0">
              <div class="product__drops-title">Кол-во каплей:</div>
              <div class="product__drops-list">

                <svg width="35" height="53" viewBox="0 0 35 53" fill="none" xmlns="http://www.w3.org/2000/svg"
                     v-for="() in product.absorbency_level">
                  <path
                      d="M17.5 2.44238C17.9642 3.22192 18.5965 4.2922 19.3438 5.5791C20.9647 8.37082 23.1253 12.1781 25.2842 16.2441C27.4447 20.3133 29.5956 24.6268 31.2041 28.4336C32.0084 30.3371 32.6709 32.0998 33.1309 33.6328C33.5953 35.181 33.8339 36.4317 33.834 37.333C33.834 45.0358 26.6503 51.5 17.5 51.5C8.3499 51.4998 1.16699 45.0357 1.16699 37.333C1.16705 36.4317 1.40466 35.181 1.86914 33.6328C2.3291 32.0997 2.99251 30.3372 3.79688 28.4336C5.40542 24.6268 7.55625 20.3133 9.7168 16.2441C11.8757 12.1782 14.0363 8.37079 15.6572 5.5791C16.4043 4.29242 17.0359 3.22186 17.5 2.44238Z"
                      stroke="#CB0B13" stroke-width="2" fill="#CB0B13"/>
                </svg>

                <svg width="35" height="53" viewBox="0 0 35 53" fill="none" xmlns="http://www.w3.org/2000/svg"
                     v-for="() in (6 - product.absorbency_level)"
                >
                  <path
                      d="M17.5 2.44238C17.9642 3.22192 18.5965 4.2922 19.3438 5.5791C20.9647 8.37082 23.1253 12.1781 25.2842 16.2441C27.4447 20.3133 29.5956 24.6268 31.2041 28.4336C32.0084 30.3371 32.6709 32.0998 33.1309 33.6328C33.5953 35.181 33.8339 36.4317 33.834 37.333C33.834 45.0358 26.6503 51.5 17.5 51.5C8.3499 51.4998 1.16699 45.0357 1.16699 37.333C1.16705 36.4317 1.40466 35.181 1.86914 33.6328C2.3291 32.0997 2.99251 30.3372 3.79688 28.4336C5.40542 24.6268 7.55625 20.3133 9.7168 16.2441C11.8757 12.1782 14.0363 8.37079 15.6572 5.5791C16.4043 4.29242 17.0359 3.22186 17.5 2.44238Z"
                      stroke="#CB0B13" stroke-width="2"/>
                </svg>

              </div>
            </div>

            <ProductVariations
                v-if="product.available_variants?.length || product.colors?.length"
                :product="product"
                :variations="product.available_variants"
                :colors="product.colors"
                @get-color="getColor"
                @get-size="getSize"
            />

            <div>
              <Quantity
                  class="product__quantity"
                  v-if="product.price && product.stock_quantity > 0 || product.name == GIFT_CERTIFICATE"
                  @get-quantity="getQuantity"
              />

              <div class="product__actions" v-if="product.stock_quantity > 0">
                <div class="product__actions-buttons">
                  <ProductActionsAddToCart
                      v-if="product.price || product.name == GIFT_CERTIFICATE"
                      :quantity="quantity"
                      :product="product"
                      :variation="selectedSize"
                      :color="selectedColor"
                      @add-to-cart="addToCart"
                  />

                </div>
                <ProductActionsAddToFav :quantity="quantity" :product="product"/>
              </div>


              <div class="product__stock--not" v-else>
                <ProductActionsNotifyRestock
                    :product="product"
                    :variation="selectedSize"
                    :color="selectedColor"
                />
              </div>


              <MarketplaceLinksButtons
                  class="pt-2"
                  v-if="checkLinkMarketplace(product.marketplace_links)"
                  :marketplace-links="product.marketplace_links"
              />


              <div class="product__actions-back">
                <NuxtLink to="/catalog">Вернуться в каталог</NuxtLink>
              </div>

            </div>

          </div>
        </div>

        <ProductDescription v-if="product.description" :text="product.description"/>
        <ProductReviews
            :product-id="product.id"
        />
        <ProductRelated/>
      </div>


    </div>
  </template>

  <script setup lang="ts">
  import type {Product} from '~/types/catalog';
  import MarketplaceLinksButtons from "~/components/Catalog/MarketplaceLinksButtons.vue";
  import {GIFT_CERTIFICATE} from "~/constants";

  const route = useRoute();
  const {data: product} = await useApi<Product>(`/public/catalog/products/${route.params.slug}`)

  if (product.value?.slug && product.value.slug !== String(route.params.slug)) {
    await navigateTo(`/catalog/${product.value.slug}`, {redirectCode: 301});
  }


  function checkLinkMarketplace(links: Record<string, any>): boolean {
    if (!links || typeof links !== 'object') return false;
    return Object.values(links).some(link => link !== null && link !== '');
  }

  const isAddedMessageActive = ref(false);

  const quantity = ref(1);
  const getQuantity = (value: number) => {
    quantity.value = value;
  }

  const selectedColor: Ref = ref(null);
  const selectedSize: Ref = ref(null);

  const getColor = (value: object) => {
    selectedColor.value = value;
  }

  const getSize = (value: object) => {
    selectedSize.value = value;

  }

  const addToCart = () => {
    isAddedMessageActive.value = true;

    setTimeout(() => {
      isAddedMessageActive.value = false;
    }, 1500);
  }


  const getCurrentPrice = () => {
    // Если выбран размер - берём его цену
    if (selectedSize.value?.price) {
      return selectedSize.value.price;
    }
    // Иначе цену продукта
    return product.value?.price;
  }

  const getCurrentOldPrice = () => {
    // Если выбран размер и у него есть old_price - берём его
    if (selectedSize.value?.old_price) {
      return selectedSize.value.old_price;
    }
    // Иначе old_price продукта
    return product.value?.old_price;
  }


  </script>

  <style scoped lang="scss">
  .product__stock--not {
    margin-top: 1.5rem;
  }

  .cart_marketplace_links__btn {
    margin-top: 1rem;
  }


  .product {
    position: relative;

    &__added {
      position: absolute;
      right: 0;
      top: 0;
      background: #4CAF50;
      padding: .8rem 1rem;
      font-size: 1.2rem;
      color: var(--fg-white);
      opacity: 0;
      pointer-events: none;
      transition: var(--tr-regular);

      @media (max-width: $mobile) {
        position: fixed;
        top: auto;
        right: auto;
        left: 0;
        bottom: .5rem;
        width: 100%;
        font-size: 1rem;
      }

      &--active {
        opacity: 1;
      }
    }

    &__drops {
      margin-bottom: 2rem;

      &-title {
        color: #616161;
        opacity: 0.5;
        margin-bottom: .8rem;
      }

      &-list {
        display: flex;
        align-items: center;

        & svg {
          width: 1.5rem;
          height: auto;
          margin-right: .5rem;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  </style>
