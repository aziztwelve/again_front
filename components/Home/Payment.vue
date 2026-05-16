<template>
  <section class="payment">
    <div class="payment__container container">
      <div class="payment-block__header block__header">
        <div class="block__header-title">Доставка и оплата</div>
      </div>
      <div class="payment__grid">
        <div class="payment-item ">


          <div class="payment-item__number">01</div>
          <div class="payment-item__title fz-h3">Оформите заказ</div>
          <p class="payment-item__text">
            Заполните поля в корзине, далее перейдите на&nbsp;страницу оплаты картой любого банка.
          </p>

        </div>

        <div class="payment-item ">


          <div class="payment-item__number">02</div>
          <div class="payment-item__title fz-h3">Оформите заказ</div>
          <p class="payment-item__text">
            Заполните поля в корзине, далее перейдите на&nbsp;страницу оплаты картой любого банка.
          </p>

        </div>

        <div class="payment-item _image">

          <img src="/img/payment.again/image-1.jpg" alt="" class="payment-item__img">


        </div>

      </div>
      <div class="payment__grid-2">
        <div class="payment-item _image">

          <img src="/img/payment.again/image-2.jpg" alt="" class="payment-item__img">


        </div>

        <div class="payment-item ">


          <div class="payment-item__number">03</div>
          <div class="payment-item__title fz-h3">Получите свой заказ</div>
          <p class="payment-item__text">
            Получите заказ службой доставки до пункта выдачи или курьером (выберите в корзине).
          </p>

        </div>

      </div>

      <NuxtLink to="/catalog" class="payment__btn btn">Купить</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.payment {
  padding: 10rem 0 3.5rem;

  @media (max-width: $mobile) {
    padding: 5rem 0 2.5rem;
  }
}

.payment__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 1.5rem;
  row-gap: 2rem;

  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
    row-gap: 1.5rem;
  }
}

.payment__grid-2 {
  display: grid;
  grid-template-columns: 8fr 4fr;
  column-gap: 1.5rem;
  row-gap: 2rem;
  margin-top: 2rem;

  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
    row-gap: 1.5rem;
    margin-top: 1.5rem;
  }
}

.payment__btn {
  margin-top: 3.5rem;

  @media (max-width: $mobile) {
    margin-top: 2rem;
  }
}

.payment-item {
  border-radius: 4rem;
  background: rgba(194, 180, 162, .3);
  position: relative;
  padding: 2rem 5.3rem 3rem 3rem;
  overflow: hidden;

  &._image {
    padding: 0;

    & .payment-item__img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-position: center;
      object-fit: cover;
    }

    @media (max-width: $mobile) {
      display: none;
    }
  }

  @media (max-width: $mobile) {
    padding: 2rem 2.9rem 3rem 1.2rem;
    border-radius: 2rem;
  }
}

.payment-item__number {
  font-size: 7rem;
  color: var(--fg-regular);
  opacity: .1;
  font-weight: 300;
  font-family: var(--ff-cormorant);
  line-height: 87.2%;
  margin-bottom: 2rem;

  @media (max-width: $mobile) {
    font-size: 3.5rem;
    margin-bottom: 1.2rem;
  }
}

.payment-item__title {
  margin-bottom: 1.5rem;
  font-weight: 300;
  line-height: 87.2%;
}

.payment-item__text {
  --fz-regular: var(--fz-1-5);

  @media (max-width: $mobile) {
    --fz-regular: var(--fz-regular);
  }
}
</style>