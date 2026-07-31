<template>
  <Breadcrumbs />
  <div class="contacts page-padding">
    <div class="contacts__container container">
      <div class="contacts__content">
        <div class="contacts-block__header block__header _left _30">
          <h1 class="block__header-title">Контакты</h1>
        </div>
        <div class="contacts__menu contacts-menu">
          <NuxtLink to="/returns" class="contacts-menu__item">
            <div class="contacts-menu__item-icon">
              <img src="/img/contacts.again/icon-1.svg" alt="">
            </div>
            <div class="contacts-menu__item-text">Как вернуть или обменять товар</div>
          </NuxtLink>
          <NuxtLink to="/selection" class="contacts-menu__item">
            <div class="contacts-menu__item-icon">
              <img src="/img/contacts.again/icon-2.svg" alt="">
            </div>
            <div class="contacts-menu__item-text">Как выбрать размер и впитываемость</div>
          </NuxtLink>
          <NuxtLink to="/profile/history" class="contacts-menu__item">
            <div class="contacts-menu__item-icon">
              <img src="/img/contacts.again/icon-3.svg" alt="">
            </div>
            <div class="contacts-menu__item-text">Отследить заказ</div>
          </NuxtLink>
        </div>
        <div class="contacts__socials">
          <div class="contacts__socials-title">Ссылки на соц. сети</div>
          <div class="contacts__socials-list">
            <div class="contacts__socials-item">
              <a href="https://vk.com/again8ru" class="contacts__socials-link contacts__socials-link--vk-group" target="_blank" rel="noopener noreferrer" aria-label="VK">
                <span>VK</span>
              </a>
            </div>
            <div class="contacts__socials-item">
              <a href="https://www.instagram.com/again8.ru" class="contacts__socials-link contacts__socials-link--instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <span>IG</span>
              </a>
            </div>
            <div class="contacts__socials-item">
              <a href="https://t.me/againdev_test_bot" class="contacts__socials-link contacts__socials-link--tg" target="_blank">
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.0228 0.866896C15.9435 0.889082 14.6884 1.36768 13.2336 1.92552C11.7788 2.48336 8.60608 3.69729 6.18139 4.62596C3.7567 5.55463 1.6553 6.35969 1.50634 6.41991C1.00555 6.62276 0.777344 6.83195 0.777344 7.09819C0.777344 7.26935 0.856582 7.38028 1.0626 7.49121C1.20206 7.56728 4.88822 8.74001 5.02451 8.75268C5.04987 8.75585 6.99913 7.55143 9.35726 6.07443C11.7122 4.6006 13.6868 3.37082 13.7439 3.33913C13.8707 3.27574 14.0703 3.26306 14.1274 3.32011C14.1591 3.35181 14.1559 3.37399 14.1211 3.43421C14.0957 3.47542 12.5109 4.91122 10.6029 6.62276L7.13225 9.73841L7.01815 11.3422C6.95476 12.2233 6.89137 13.0791 6.88186 13.2376L6.85967 13.5323H6.99913C7.25269 13.5323 7.40166 13.4151 8.44443 12.4167L9.42699 11.4753L11.3065 12.8509C12.5458 13.7605 13.2463 14.2518 13.3604 14.2994C13.4745 14.3437 13.6076 14.3691 13.7407 14.3691C14.0735 14.3723 14.27 14.2265 14.4348 13.8493C14.4665 13.77 15.0624 11.0538 15.7534 7.81133C16.9927 1.99842 17.0117 1.91284 16.999 1.61174C16.9895 1.33916 16.9768 1.28844 16.8912 1.15215C16.7232 0.879574 16.3683 0.7623 16.0228 0.866896Z" fill="#545454"/>
                </svg>
              </a>
            </div>
            <div class="contacts__socials-item">
              <a href="https://max.ru/id4707052811_bot" class="contacts__socials-link contacts__socials-link--max" target="_blank" rel="noopener noreferrer" aria-label="MAX">
                <img src="/icons/chat/max.svg" alt="MAX" width="18" height="18">
              </a>
            </div>
          </div>
        </div>
      </div>
      <ContactsForm />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta( {
  title: 'Контакты',
} )
</script>

<style scoped lang="scss">
.contacts__container  {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  @media (max-width: $tablet) {
    flex-wrap: wrap;
  }
}

.contacts-block__header {
  margin-bottom: 2.5rem;
}

.contacts__socials {
  margin-top: 4rem;

  &-title {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  &-list {
    display: flex;
    align-items: center;
  }

  &-item {
    margin-right: 1rem;

    &:last-child {
      margin-right: 0;
    }
  }

  &-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: #24A1DE;

    &--max {
      background: #5365e8;
    }

    &--tg {
      background: #24A1DE;
    }

    &--vk {
      background: #4C75A3;
    }

    &--vk-group {
      background: #4C75A3;
    }

    &--instagram {
      background: #d62976;
    }

    & path {
      fill: #fff;
    }
  }
}
</style>
