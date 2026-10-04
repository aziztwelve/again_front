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
              <img src="/img/icons.again/icon-soak.svg" alt="">
            </div>
            <div class="care__list-text">Рекомендуется замочить белье до стирки на 30 минут <span>(по желанию)</span></div>
          </div>
          <div class="care__list-item">
            <div class="care__list-icon">
              <img src="/img/icons.again/icon-gradus.svg" alt="">
            </div>
            <div class="care__list-text">Стирка белья только на 30–40 градусах в обычной стиральной машине</div>
          </div>
          <div class="care__list-item">
            <div class="care__list-icon">
              <img src="/img/icons.again/icon-spin.svg" alt="">
            </div>
            <div class="care__list-text">Отжим от 1000 оборотов, так белье быстрее высохнет</div>
          </div>
          <div class="care__list-item">
            <div class="care__list-icon">
              <img src="/img/icons.again/icon-not-dry.svg" alt="">
            </div>
            <div class="care__list-text">Сушить только в естественном виде, ластовицей наружу <span>(нельзя сушить на батарее)</span></div>
          </div>
          <div class="care__list-item">
            <div class="care__list-icon">
              <img src="/img/icons.again/icon-detergent.svg" alt="">
            </div>
            <div class="care__list-text"><strong>Обращаем ваше внимание!</strong> Выбирайте обычные стиральные средства и порошки — лучше не использовать ЭКО/БИО, так как они бывают плохо справляются со стиркой вещей.</div>
          </div>
        </div>
      </div>
      <div class="care__form">
        <div class="care__form-text">Напиши нам в удобный мессенджер, и мы ответим на любой ваш вопрос перед покупкой</div>
        <div class="care__form-actions">
          <a href="https://wa.me/79991178888" class="care__form-btn care__form-btn--whatsapp" target="_blank" rel="noopener noreferrer">
            <img src="/icons/chat/whatsapp.svg" alt="" aria-hidden="true">
            <span>WhatsApp</span>
          </a>
          <a href="https://t.me/again8help_bot" class="care__form-btn care__form-btn--telegram" target="_blank" rel="noopener noreferrer">
            <img src="/icons/chat/telegram.svg" alt="" aria-hidden="true">
            <span>Telegram</span>
          </a>
          <a href="https://max.ru/id4707052811_1_bot" class="care__form-btn care__form-btn--max" target="_blank" rel="noopener noreferrer">
            <img src="/icons/chat/max.svg" alt="" aria-hidden="true">
            <span>MAX</span>
          </a>
        </div>
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

  span {
    white-space: nowrap;
  }
}

.care__form {
  padding: 3.6rem 4rem 3.4rem;
  border-radius: 4.2rem;
  background: var(--bg-gray-item);
  max-width: 58.5rem;

  @media (max-width: $tablet) {
    margin-top: 3rem;
  }

  @media (max-width: $mobile) {
    padding: 2rem 1.2rem;
    border-radius: 2rem;
    width: 100%;
  }
}

.care__form-text {
  text-align: center;
  font-size: 2.2rem;
  line-height: 150%;
  margin-bottom: 2rem;

  @media (max-width: $mobile) {
    font-size: 1.8rem;
    max-width: 29.6rem;
    margin: 0 auto 1.5rem;
  }
}

.care__form-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: .8rem;

  @media (max-width: $mobile) {
    gap: .6rem;
  }
}

.care__form-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .7rem;
  width: 100%;
  min-height: 4.8rem;
  padding: .8rem;
  border: .1rem solid #e1e1e1;
  border-radius: 1.2rem;
  background: #fff;
  color: var(--fg-regular-85);
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;
  transition: var(--tr-regular);

  img {
    width: 2rem;
    height: 2rem;
    flex: 0 0 auto;
  }

  @media (any-hover: hover) {
    &:hover {
      transform: translateY(-.15rem);
      box-shadow: 0 .5rem 1.2rem rgba(0, 0, 0, .1);
    }
  }

  &--whatsapp:hover {
    border-color: #91DD5A;
  }

  &--telegram:hover {
    border-color: #24A1DE;
  }

  &--max:hover {
    border-color: #545454;
  }

  @media (max-width: $tablet) {
    gap: .5rem;
  }

  @media (max-width: $mobile) {
    min-height: 4.4rem;
    padding: .6rem .3rem;
    font-size: 1.05rem;

    img {
      width: 1.6rem;
      height: 1.6rem;
    }
  }
}

</style>
