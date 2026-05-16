<template>
  <div class="footer__contacts">
    <div class="footer__contacts-item">
      <a href="tel:79255523577" class="footer__contacts-link">
        <span class="footer__contacts-title">Номер телефона</span>
        <span class="footer__contacts-value">+7 925 552 35 77</span>
      </a>
    </div>
    <div class="footer__contacts-item">
      <a href="mailto:info@again8.ru" class="footer__contacts-link">
        <span class="footer__contacts-title">Почта</span>
        <span class="footer__contacts-value">info@again8.ru</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.footer__contacts {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: $mobile) {
    order: 2;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8rem;
    margin-top: 1.6rem;
    width: 100%;
    //justify-content: center;
    //align-items: center;
    //display: flex;
    //flex-direction: row;
    //text-align: center;
  }
}

.footer__contacts-item {
  margin-bottom: .8rem;
  text-align: right;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: $mobile) {
    margin-bottom: 0;
    margin-right: 2.6rem;
    //text-align: center;
    text-align: left;

    &:last-child {
      margin-right: 0;
    }
  }
}

.footer__contacts-title {
  display: block;
  font-size: 1.2rem;
  line-height: normal;
  color: rgba(255, 255, 255, .6);
  opacity: .4;

  @media (max-width: $mobile) {
    font-size: 1.2rem;
  }
}

.footer__contacts-value {
  display: block;
  font-size: 1.8rem;
  color: var(--fg-white);

  @media (max-width: $mobile) {
    font-size: 1.4rem;
  }
}

</style>