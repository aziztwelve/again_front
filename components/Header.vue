<template>
  <header class="header" :class="{ '_fixed': isFixed }">
    <div class="header__container container">
      <div class="header__top">
        <NuxtLink to="/" class="header__logo">
          <img src="/img/logo.again/logo.svg" alt="">
        </NuxtLink>
        <div class="header__top-left">
          <HeaderSocials/>
          <button
              class="header__call"
              @click="modal.openModal( ModalsCallback )"
          >
            Связаться с нами
          </button>
        </div>
        <div class="header__top-right">
          <HeaderSearch/>
          <HeaderActions/>
        </div>
      </div>
    </div>
  </header>

    <div class="header__bottom" :class="{ '_active': mobileMenuStore.isActive }">
      <div class="container">
        <HeaderMenu class="header__menu"/>
        <div class="header__mobile">
          <button class="header__call" @click="modal.openModal( ModalsCallback )">Связаться с нами</button>
          <HeaderSocials/>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import {ModalsCallback} from "#components";

const mobileMenuStore = useMobileMenuStore();
const modal = useModal();

const isFixed = ref(false)

const handleScroll = () => {
  isFixed.value = window.scrollY > 100
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--fg-white);
  transform: translateZ(0);

  @media (max-width: $mobile) {
    position: fixed;
    left: 0;
    top: 3.3rem;
    width: 100%;
    transition: var(--tr-regular);

    &._fixed {
      top: 0;
    }
  }
}

.header__bottom {
  transition: var(--tr-regular);
}

.header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .1rem;
    background: var(--fg-gray);
    opacity: .07;
  }

  @media (max-width: $mobile) {
    margin-left: var(--m-m-container);
    margin-right: var(--m-m-container);
    padding-left: 1rem;
  }
}

.header__top-left {
  display: flex;
  align-items: center;

  @media (max-width: $tablet) {
    display: none;
  }
}

.header__logo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: $tablet) {
    position: relative;
    left: 0;
    top: 0;
    transform: translate(0);
  }
}

:global(.header__link) {
  min-width: 5.4rem;
  min-height: 5.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: .1rem solid rgba(84, 84, 84, .1);

  &._red {
    border-color: rgba(203, 11, 19, .2);
  }

  @media (max-width: $mobile) {
    min-width: 3.7rem;
    min-height: 3.7rem;
  }
}

.header__call {
  width: 20rem;
  height: 5.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  line-height: 3rem;
  border: .1rem solid var(--fg-gray-2);

  @media(any-hover: hover) {
    &:hover {
      background: var(--fg-gray-2);
      color: var(--fg-white);
    }
  }
}

.header__top-right {
  display: flex;
  align-items: center;
}

.header__logo {
  @media (max-width: $mobile) {
    max-width: 4.6rem;
  }
}

.header__menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 3rem !important;
  padding-top: 2.6rem !important;

  @media (max-width: $tablet) {
    :deep(li) {
      margin-bottom: 2.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    :deep(a) {
      display: inline-block;
      font-size: 1.4rem;

      &._active {
        text-decoration: underline;
        color: var(--fg-red);
        font-weight: 700;
      }
    }
  }
}

.header__mobile {
  display: none;

  @media (max-width: $mobile) {
    display: flex;
    flex-direction: column;
    align-items: center;

    & .header__call {
      width: 100%;
      text-align: center;
      font-size: 1.4rem;
    }
  }
}

@media (max-width: $tablet) {
  .header__bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: var(--fg-white);
    padding: 7rem 2rem 2.8rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transform: translateX(100%);
    opacity: 0;
    transition: var(--tr-regular);

    &._active {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .header__menu {
    flex-direction: column;
    align-items: flex-start;
    margin: 0;
    padding: 0;

    & li {
      margin-bottom: 2.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    & a {
      display: inline-block;
      font-size: 1.4rem;

      &._active {
        text-decoration: underline;
        color: var(--fg-red);
        font-weight: 700;
      }
    }
  }
}

//@media (max-width: $mobile) {
//  .header__bottom {
//    height: calc(100% - 6.9rem);
//  }
//}
</style>