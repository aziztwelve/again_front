<template>
  <section class="section technology">
    <div class="technology__container container">

      <div class="technology__features technology-features">
        <div class="technology-features__item" style="background-image: url(/img/technology.again/item-1.jpg)">
          <div class="technology-features__item-header">
            <div class="technology-features__item-title">Здоровье</div>
            <div class="technology-features__item-icon">
              <img src="/img/technology.again/icons/icon-1.svg" alt="">
            </div>
          </div>
          <div class="technology-features__item-text">
            <p>Наше белье разработано под контролем врачей. Мы гарантируем вам защиту от герпеса, вагиноза, цистита, молочницы и других женских заболеваний, которые провоцируют тампоны и прокладки.</p>
          </div>
        </div>

        <div class="technology-features__item" style="background-image: url(/img/technology.again/item-2.jpg)">
          <div class="technology-features__item-header">
            <div class="technology-features__item-title">Безопасность</div>
            <div class="technology-features__item-icon">
              <img src="/img/technology.again/icons/icon-2.svg" alt="">
            </div>
          </div>
          <div class="technology-features__item-text">
            <p>Наше белье можно носить без смены до 12 часов и не бояться, что случится протекание даже при самой обильной менструации.</p>
          </div>
        </div>

        <div class="technology-features__item" style="background-image: url(/img/technology.again/item-3.jpg)">
          <div class="technology-features__item-header">
            <div class="technology-features__item-title">Комфорт и эстетика</div>
            <div class="technology-features__item-icon">
              <img src="/img/technology.again/icons/icon-3.svg" alt="">
            </div>
          </div>
          <div class="technology-features__item-text">
            <p>Наши изделия не имеют запаха, не вызывают чувство «прения» и не создают парникового эффекта, обеспечивая максимально комфортную носку в течение дня.</p>
          </div>
        </div>
      </div>

      <!-- Товары после буллетов -->
      <CatalogGrid v-if="products" :list="products.data" class="technology__products" />

      <div class="technology__flex">
        <div class="technology__content">
          <h2 class="technology__content-title">Технология белья&nbsp;AGAIN</h2>
          <div class="technology__content-text">
            <p>Инновационная технология, разработанная акушер-гинекологами: даже при самых обильных выделениях <strong>вы останетесь сухи и&nbsp;защищены благодаря уникальной комбинации четырех слоев и ластовицы.</strong></p>
          </div>
        </div>
        <div class="technology__content-media">
          <picture class="technology__content-media__pic">
            <img src="/img/technology.again/content.png" class="technology__content-media__img" alt="">
          </picture>
        </div>
      </div>

      <div class="technology__advantages technology-advantages">

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type {Product} from "~/types/catalog";

const {data: products} = await useApi<{
  data: Product[]
}>('/public/catalog/products', {
  query: {
    per_page: 4,
    in_stock: 1,
    sort_by: 'display_order',
    sort_order: 'asc',
  }
})
</script>

<style scoped lang="scss">
.technology {
  padding: 5rem 0;

  @media (max-width: $mobile) {
    padding: 1.6rem 0 2.5rem;
  }
}

.technology__products {
  margin-top: 5rem;

  @media (max-width: $mobile) {
    margin-top: 3rem;
  }
}

.technology__flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8rem 0 2.9rem;

  @media (max-width: $tablet) {
    flex-wrap: wrap;
  }

  @media (max-width: $mobile) {
    padding: 5rem 0 0;
  }
}

.technology__content {
  max-width: 40rem;

  @media (max-width: $tablet) {
    max-width: none;
    margin-bottom: 1rem;
    width: 100%;
  }
}

.technology__content-title {
  font-size: var(--fz-h1);
  line-height: var(--fz-h1);
  margin-bottom: 1rem;
  color: var(--fg-black);

  @media (max-width: $mobile) {
    max-width: 24rem;
  }
}

.technology__content-text {
  max-width: 35rem;

  @media (max-width: $tablet) {
    max-width: none;
  }
}

.technology__content-media {
  max-width: 73.3rem;
}

.technology-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.7rem;

  @media (max-width: $tablet) {
    grid-template-columns: 1fr;
  }
}

.technology-features__item {
  min-height: 26.3rem;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 4rem;
  padding: 4rem 2.5rem 2.5rem 3rem;
  background-color: #C2B4A2;

  @media (max-width: $tablet) {
    min-height: auto;
  }

  @media (max-width: $mobile) {
    padding: 1.7rem 1.2rem 3rem 1.5rem;
    border-radius: 2rem;
  }
}

.technology-features__item-header {
  display: flex;
  align-items: center;
}

.technology-features__item-title {
  font-size: var(--fz-h3);
  font-weight: 300;
  font-family: var(--ff-cormorant);
  line-height: 87%;
}

.technology-features__item-text {
  margin-top: 1.2rem;
}

.technology-features__item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 3.7rem;
  height: 3.7rem;
  border: .1rem solid rgba(153, 116, 71, .2);
  border-radius: 1.123rem;
  margin-left: 1.5rem;

  @media (max-width: $mobile) {
    min-width: 3.2rem;
    height: 3.2rem;
    margin-left: 1rem;
    border-radius: 1rem;

    & img {
      max-width: 55%;
    }
  }
}

.technology-features__item-text {
  font-size: 1.5rem;

  & > *:not(:last-child) {
    margin-bottom: 1.8rem;
  }
}
</style>