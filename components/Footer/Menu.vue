<template>
  <div class="footer__menu">
    <div class="footer__menu-item">
      <div class="footer__menu-title">Страницы</div>
      <ul class="footer__menu-list">
        <li><NuxtLink to="/catalog">Каталог</NuxtLink></li>
        <li><NuxtLink to="/delivery">Доставка и оплата</NuxtLink></li>
        <li><NuxtLink href="/sertificates">Сертификаты</NuxtLink></li>
        <li><NuxtLink to="/contacts">Контакты</NuxtLink></li>
      </ul>
    </div>
    <div class="footer__menu-item">
      <div class="footer__menu-title"></div>
      <ul class="footer__menu-list">
        <li><NuxtLink to="/articles">Статьи</NuxtLink></li>
        <li><NuxtLink to="/returns">Условия обмена и&nbsp;возврата</NuxtLink></li>
        <li><NuxtLink to="/care">Правила ухода и&nbsp;использования</NuxtLink></li>
        <li><NuxtLink to="/faq">Отвечаем на ваши вопросы</NuxtLink></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.footer__menu {
  margin-left: 11.8rem;
  display: flex;
  justify-content: space-between;
  width: 41rem;
  max-width: 100%;

  @media (max-width: $tablet) {
    margin-left: 0;
  }

  @media (max-width: $mobile) {
    margin-top: 2.8rem;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8rem;
  }
}

.footer__menu-title {
  font-size: 1rem;
  opacity: .5;
  color: var(--fg-white);
  height: 1.4rem;
  margin-bottom: 1rem;

  @media (max-width: $mobile) {
    display: none;
  }
}

.footer__menu-list li a {
  color: rgba(255, 255, 255, .85);

  @media (any-hover: hover) {
    &:hover {
      color: rgba(255, 255, 255, 1);
    }
  }
}

</style>