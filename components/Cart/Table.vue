<template>
  <div class="cart__table cart-table">
    <div class="cart-table__head">
      <div class="cart-table__head-main">
        <div class="checkbox cart-table__head-checkbox _icon">
          <input type="checkbox" class="checkbox__input" name="items[]" value="">
          <span class="checkbox__icon"></span>
        </div>
        <div class="cart-table__head-title">товар</div>
      </div>
      <div class="cart-table__head-title">количество</div>
      <div class="cart-table__head-title">цена</div>
    </div>
    <div class="cart-table__body">
      <div class="cart-table__item">
        <CartCard
          v-for="item in cart.cart"
          :key="item.id"
          :product="item"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cart = useCartStore();
</script>

<style scoped lang="scss">
.cart__table {
  margin-top: 2.1rem;
}

.cart-table__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 2.2rem;
  border-bottom: .1rem solid rgba(217, 217, 217, .4);
  margin-bottom: 2.7rem;
}

.cart-table__head-main {
  display: flex;
  align-items: center;

  & .cart-table__head-title {
    margin-left: 1.6rem;
    display: block;
  }
}

.cart-table__head-title {
  font-size: 1.2rem;
  color: #2F2F2F;
  opacity: .4;
  text-transform: uppercase;

  @media (max-width: $mobile) {
    display: none;
  }
}

</style>