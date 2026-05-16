<template>
  <div class="footer__documents">
    <div class="footer__documents-title">Документы</div>
    <ul class="footer__documents-list">
      <li><NuxtLink to="/personal-data-consent">Обработка персональных данных</NuxtLink></li>
      <li><NuxtLink to="/oferta">Публичная оферта</NuxtLink></li>
      <li><NuxtLink to="/policy">Политика конфиденциальности</NuxtLink></li>
      <li><NuxtLink to="/marketing-consent">Получение рекламных и информационных рассылок</NuxtLink></li>
    </ul>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.footer__documents {
  margin-left: 11.8rem;

  @media (max-width: $tablet) {
    margin-left: 4rem;
  }

  @media (max-width: $mobile) {
    margin-top: 2.8rem;
    margin-left: 0;
    width: 100%;
  }
}

.footer__documents-title {
  font-size: 1rem;
  opacity: .5;
  color: var(--fg-white);
  height: 1.4rem;
  margin-bottom: 1rem;

  @media (max-width: $mobile) {




  }
}

.footer__documents-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.8rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  li a {
    color: rgba(255, 255, 255, .85);
    display: inline-block;
    line-height: 160%;

    @media (any-hover: hover) {
      &:hover {
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>