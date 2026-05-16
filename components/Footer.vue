<template>
  <footer class="footer">
    <div class="footer__container container">
      <div class="footer__top">
        <div class="footer__top-left">
          <div class="footer__main">
            <NuxtLink to="/" class="footer__logo">
              <img src="/img/logo.again/logo-white.svg" alt="">
            </NuxtLink>
            <div class="footer__info">
              ООО ЭГЕЙН<br> ИНН 4707052811<br> ОГРН 1234700025196
            </div>
            <div class="footer__mobile">
              <FooterContacts/>
              <FooterSocials/>
            </div>
          </div>
          <FooterMenu/>
          <FooterDocuments/>
        </div>
        <div class="footer__top-right">
          <FooterContacts/>
          <FooterSocials/>
        </div>
      </div>
      <div class="footer__bottom">

        <div class="footer__bottom-item" style="--text-align: center;">
          <div class="footer__save">Все права защищены</div>
        </div>

      </div>
    </div>
  </footer>

  <AsideMenu/>
  <ModalsDefault/>
  <Cookies/>

</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.footer {
  padding: 2.4rem 0 3.3rem;
  background: var(--bg-footer);
  color: var(--fg-white);
  font-size: var(--fz-secondary);
  line-height: 160%;
}

.footer__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 4rem;

  @media (max-width: $mobile) {
    flex-wrap: wrap;
    margin-bottom: 0;
  }
}

.footer__top-left {
  display: flex;
  align-items: flex-start;

  @media (max-width: $mobile) {
    flex-wrap: wrap;
    width: 100%;
  }
}

.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1.7rem;
  border-top: .1rem solid rgba(217, 217, 217, .2);

  @media (max-width: $mobile) {
    flex-direction: column;
    margin-top: 2.7rem;
    border: none;
    padding-top: 0;
  }
}

.footer__bottom-item {
  width: 33.3333%;
  text-align: var(--text-align);

  @media (max-width: $mobile) {
    width: 100%;
    text-align: center;
    margin-bottom: .3rem;

    &:last-child {
      margin-bottom: 0;
    }

    &:nth-child(2) {
      order: 3;
    }
  }
}

.footer__link {
  color: var(--fg-white);

  &._border {
    text-decoration: underline;
  }

  &._opacity {
    opacity: .3;
  }

  @media (any-hover: hover) {
    &:hover {
      text-decoration: none;
    }
  }
}

.footer__info {
  margin-top: 1.7rem;
  color: rgba(255, 255, 255, .85);
  opacity: .5;

  @media (max-width: $mobile) {
    display: none;
  }
}

.footer__top-right {
  @media (max-width: $mobile) {
    display: none;
  }
}

.footer__main {
  @media (max-width: $mobile) {
    width: 100%;
  }
}

.footer__logo img {
  @media (max-width: $mobile) {
    margin: 0 auto;
  }
}

.footer__mobile {
  display: none;

  @media (max-width: $mobile) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 1.6rem;
  }
}

.footer__save {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.85);
  opacity: .3;
}

</style>