<template>
  <div class="cart__progress cart-progress">
    <div class="cart-progress__title">
      <span class="cart-progress__text">До бесплатной доставки осталось</span>
      <strong class="cart-progress__price"><span>1.212</span> ₽</strong>
    </div>
    <div class="cart-progress__line">
      <div style="--width: 70%;"></div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.cart-progress {

}

.cart-progress__title {
  display: flex;
  align-items: flex-end;
  font-size: 1.2rem;
  line-height: normal;
  color: #202020;

  @media (max-width: $mobile) {
    font-size: 1rem;
  }
}

.cart-progress__price {
  margin-left: .5rem;
  font-size: 1.6rem;

  @media (max-width: $mobile) {
    font-size: 1.3rem;
  }
}

.cart-progress__line {
  position: relative;
  height: 1rem;
  width: 100%;
  background: #F0F0F0;
  border-radius: 2rem;
  overflow: hidden;
  margin-top: 1.6rem;

  & div {
    width: var(--width);
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: var(--fg-red);
    border-radius: 2rem;
  }

  @media (max-width: $mobile) {
    margin-top: 1rem;
    height: .5rem;
  }
}

</style>