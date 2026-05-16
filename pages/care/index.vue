<template>
  <Breadcrumbs />
  <div class="care page-padding">
    <div class="care__container container">
      <div class="care__content">
        <div class="care-block__header block__header _left _30">
          <h1 class="block__header-title fz-h2--mobile">Использование и&nbsp;уход за бельем</h1>
        </div>
        <div class="care__list">
          <div class="care__list-item">
            <div class="care__list-icon">
              <img src="/img/icons.again/icon-gradus.svg" alt="">
            </div>
            <div class="care__list-text">Стирка белья только на 30-40 градусах в обычной стиральной машине</div>
          </div>
          <div class="care__list-item">
            <div class="care__list-icon">
              <img src="/img/icons.again/icon-soak.svg" alt="">
            </div>
            <div class="care__list-text">Рекомендуется замочить белье до&nbsp;стирки на 30 минут </div>
          </div>
          <div class="care__list-item">
            <div class="care__list-icon">
              <img src="/img/icons.again/icon-dry.svg" alt="">
            </div>
            <div class="care__list-text">Сушить только в естественном виде, ластовицей наружу </div>
          </div>
          <div class="care__list-item">
            <div class="care__list-icon">
              <img src="/img/icons.again/icon-not-dry.svg" alt="">
            </div>
            <div class="care__list-text">Нельзя сушить белье на батарее</div>
          </div>
        </div>
      </div>
      <div class="care__form">
        <div class="care__form-text">Напиши нам в WhatsApp, и мы ответим  на любой ваш вопрос перед покупкой</div>
        <a href="https://wa.me/79991178888" class="btn care__form-btn" target="_blank">Написать в WhatsApp</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta( {
  title: 'Уход',
} )
</script>

<style scoped lang="scss">
.care__container {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: $tablet) {
    flex-wrap: wrap;
  }
}

.care-block__header {
  @media (max-width: $mobile) {
    justify-content: flex-start;
    margin-bottom: 2.2rem;
    max-width: 16.4rem;
  }
}

.care__content {
  max-width: 46.2rem;

  @media (max-width: $tablet) {
    width: 100%;
  }
}

.care__list {
  max-width: 40rem;

  @media (max-width: $tablet) {
    max-width: none;
  }
}

.care__list-item {
  display: flex;
  align-items: center;
  margin-bottom: 3.18rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: $mobile) {
    margin-bottom: 2rem;
  }
}

.care__list-icon {
  min-width: 3.9rem;
  height: 3.9rem;
  border-radius: .769rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: .077rem solid #292D32;
}

.care__list-text {
  margin-left: 2.38rem;
}

.care__form {
  padding: 3.6rem 7.7rem 3.1rem;
  border-radius: 4.2rem;
  background: var(--bg-gray-item);
  max-width: 58.5rem;

  @media (max-width: $tablet) {
    margin-top: 3rem;
  }

  @media (max-width: $mobile) {
    padding: 2rem 1rem 3rem;
    border-radius: 2rem;
    width: 100%;
  }
}

.care__form-text {
  text-align: center;
  font-size: 2.2rem;
  line-height: 150%;
  margin-bottom: 2.5rem;

  @media (max-width: $mobile) {
    font-size: 1.8rem;
    max-width: 29.6rem;
    margin: 0 auto 1.5rem;
  }
}

</style>