<template>
  <Breadcrumbs />
  <div class="delivery page-padding">
    <div class="delivery__container container">
      <div class="delivery__content">
        <div class="delivery-block__header block__header _left">
          <h1 class="delivery__title block__header-title fz-h2--mobile">Условия доставки и&nbsp;оплаты</h1>
        </div>
        <div class="delivery__card _tablet">
          <picture class="delivery__card-pic">
            <img src="/img/delivery.again/logo.svg" class="delivery__card-img" alt="">
          </picture>
          <div class="delivery__card-title fz-h2">Бесплатная доставка<br> от 5000 ₽ по всей России</div>
        </div>
        <div class="delivery__row">
          <div class="delivery__block _gray">
            <p><strong>Вы можете оформить доставку:</strong></p>
            <ul>
              <li>Курьером (СДЭК или Boxberry)</li>
              <li>Самовывозом  (СДЭК, Boxberry, Почта России)</li>
              <li>Почтомат</li>
            </ul>
            <p>*Если вам требуется доставка за пределы РФ, пожалуйста, уточняйте информацию у наших менеджеров.</p>
          </div>
          <div class="delivery__block">
            <p><strong>Оплата заказа возможна:</strong></p>
            <ul>
              <li>Картой РФ </li>
              <li>SberPay, рассрочка, иностранная карта</li>
              <li>Рассрочка Яндекс СПЛИТ (Visa Mastercard,<br> МИР и частями)</li>
            </ul>
          </div>
        </div>
        <NuxtLink to="/catalog" class="delivery__btn btn">Собрать заказ</NuxtLink>
      </div>
      <div class="delivery__card">
        <picture class="delivery__card-pic">
          <img src="/img/delivery.again/logo.svg" class="delivery__card-img" alt="">
        </picture>
        <div class="delivery__card-title fz-h2">Бесплатная доставка<br> от 5000 ₽ по всей России</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta( {
  title: 'Доставка',
} )
</script>


<style scoped lang="scss">
.delivery__container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.delivery__content {
  max-width: 50.5rem;

  @media (max-width: $tablet) {
    width: 100%;
  }
}

.delivery-block__header {
  max-width: 46.2rem;
  margin: 0 0 3rem;

  @media (max-width: $mobile) {
    margin: 0 0 2rem;
    justify-content: flex-start;
  }
}

.delivery__btn {
  margin: 3.2rem 0 0;
}

.delivery__block {
  margin-bottom: 2.7rem;

  & > * {
    font-size: 1.5rem;
    line-height: 150%;
  }

  & strong {
    font-size: 2rem;
    font-weight: 700;

    @media (max-width: $mobile) {
      font-size: 1.6rem;
    }
  }

  & p {
    color: var(--fg-gray);
    opacity: .5;
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  & p:has(strong) {
    opacity: 1;
  }

  & ul {
    padding-left: 2rem;
    margin-bottom: 1.4rem;
  }

  & li {
    list-style: disc;
  }

  &._gray {
    background: rgba(237, 234, 232, .5);
    border-radius: 4.2rem;
    padding: 2.6rem 2.8rem 3.8rem 4.2rem;

    @media (max-width: $mobile) {
      border-radius: 2rem;
      padding: 1.7rem 2.7rem 2.2rem 1.5rem;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.delivery__btn {
  max-width: 29.8rem;

  @media (max-width: $mobile) {
    max-width: 100%;
    margin: 2.5rem 0 0;
  }
}

.delivery__card {
  min-width: 56.6rem;
  background-image: url("../img/delivery.again/card-bg.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 5.3rem 7.7rem 6rem;
  border-radius: var(--br-regular);
  display: flex;
  flex-direction: column;
  align-items: center;

  &._tablet {
    display: none;
  }

  @media (max-width: $tablet) {
    display: none;

    &._tablet {
      display: flex;
      margin-bottom: 1.6rem;
      min-width: auto;
    }
  }

  @media (max-width: $mobile) {
    padding: 2.8rem 4rem 3.2rem;
  }
}

.delivery__card-title {
  text-align: center;
  color: var(--fg-white);
  margin-top: 3rem;

  @media (max-width: $mobile) {
    margin-top: 1.6rem;
  }
}

@media (max-width: $mobile) {
  .delivery__card-pic {
    max-width: 10.1rem;
  }
}

</style>