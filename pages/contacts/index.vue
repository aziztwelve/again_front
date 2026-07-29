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
            <div class="contacts__socials-item">
              <a href="https://vk.me/public228837691?ref=590197ba2f669a6f7ea29870%3Aru" class="contacts__socials-link  contacts__socials-link--vk" target="_blank">
                <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.44367 0.109889C6.21871 0.211241 5.93399 0.461241 5.85314 0.626781C5.77933 0.772052 5.80393 0.937592 5.91641 1.03219C5.95859 1.07273 6.09568 1.13016 6.21871 1.16394C6.51397 1.24165 6.68621 1.39705 6.76354 1.65043C6.96741 2.35313 6.90765 4.25516 6.66863 4.56935C6.62294 4.63016 6.60536 4.63016 6.50694 4.58962C6.11677 4.43421 5.04468 2.82273 4.44713 1.4984C4.08508 0.690971 3.99369 0.565971 3.67734 0.427457C3.49807 0.349754 3.49104 0.349754 2.00418 0.349754H0.506774L0.334538 0.437592C0.236117 0.484889 0.12012 0.576106 0.07794 0.640295C-0.0450862 0.809214 -0.020481 1.13692 0.137696 1.48151C1.59995 4.63692 3.39613 7.35313 4.74239 8.45448C5.84963 9.36327 6.85493 9.80246 8.22579 9.97813C8.7179 10.0423 9.83216 10.0457 10.0817 9.98151C10.5457 9.85989 10.6863 9.64367 10.7566 8.93084C10.8093 8.37002 10.9535 7.95448 11.1292 7.843C11.2065 7.7957 11.2241 7.79908 11.3717 7.86665C11.5651 7.95786 11.7373 8.11665 12.4579 8.8734C13.0273 9.47475 13.2874 9.68759 13.6214 9.83962C14.0221 10.0221 14.0889 10.0288 15.8007 10.0288C17.2559 10.0288 17.393 10.0221 17.5231 9.96462C17.8113 9.83962 17.9976 9.53894 17.9976 9.20111C17.9976 8.67746 17.5125 8.02881 16.1487 6.73489C15.6601 6.26867 15.2348 5.83962 15.2031 5.77543C15.1293 5.63354 15.1539 5.49502 15.291 5.28557C15.3508 5.19773 15.7585 4.66057 16.2014 4.08962C17.3719 2.57948 17.7199 2.04232 17.9238 1.45786C18.0819 1.00178 17.9906 0.636916 17.6812 0.481511C17.4035 0.342998 17.2137 0.329484 15.5125 0.339619C13.9272 0.349754 13.8991 0.349754 13.7549 0.424079C13.5405 0.535565 13.4175 0.701106 13.2312 1.14029C12.6512 2.50516 11.9131 3.70111 11.2558 4.35313L10.964 4.64029L10.8796 4.5457C10.8339 4.49502 10.7777 4.39705 10.7601 4.32611C10.7355 4.2484 10.7215 3.60313 10.7215 2.593C10.7215 1.09638 10.718 0.967998 10.6512 0.721376C10.5703 0.413943 10.4649 0.268673 10.2364 0.140295L10.0712 0.0457002L8.34882 0.0355651L6.62645 0.0288084L6.44367 0.109889Z" fill="#545454"/>
                </svg>
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

    & path {
      fill: #fff;
    }
  }
}
</style>
