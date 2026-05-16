<template>
  <ClientOnly>
    <div class="header__links">

        <NuxtLink :to="loginUrl" class="header__link _red" @click="clickToMenu">
          <svg class="w-[20px] h-[20px]  max-md:w-[20px] max-md:h-[20px]" viewBox="0 0 14 16" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6.03298 0.0186787C5.48591 0.10621 5.01074 0.268767 4.64499 0.487595C4.07916 0.825214 3.56335 1.3379 3.22573 1.89434C3.05067 2.18194 2.89437 2.58209 2.80684 2.95097C2.71618 3.34173 2.6943 4.12326 2.76307 4.51715C2.96314 5.66755 3.65401 6.6429 4.69501 7.23998C5.72037 7.82769 7.08648 7.87771 8.20875 7.37128C8.58388 7.20247 8.93713 6.943 9.30289 6.58038C10.1219 5.76134 10.4814 4.82976 10.4314 3.67935C10.3845 2.65711 10.0375 1.8537 9.32477 1.13157C8.75582 0.553243 8.04619 0.181236 7.26154 0.0436878C7.01458 -7.77245e-05 6.2393 -0.0157084 6.03298 0.0186787Z"
                fill="#CB0B13"/>
            <path
                d="M3.09485 7.7371C2.70096 7.79649 2.43836 7.87464 2.1195 8.03408C1.50991 8.33418 1.05037 8.83123 0.687743 9.57837C0.231332 10.5193 0 11.6729 0 13.0358C0 13.8611 0.059396 14.155 0.321989 14.6739C0.418898 14.8646 0.518934 14.9928 0.734635 15.2085C1.04099 15.518 1.30671 15.693 1.67872 15.8243C2.19453 16.0119 2.02259 16.0056 6.80241 15.9963L11.1758 15.9869L11.4416 15.9056C11.7792 15.7993 11.9574 15.7212 12.1824 15.5774C12.7045 15.246 13.089 14.7208 13.2547 14.1269C13.3547 13.7549 13.3829 13.3109 13.3485 12.6263C13.1922 9.56274 12.0293 7.83713 10.0504 7.72772C9.62528 7.70583 9.61903 7.70583 8.89065 8.17475C8.32795 8.53425 7.93718 8.71244 7.41825 8.84686C7.02749 8.95003 6.32724 8.95003 5.9396 8.84999C5.38628 8.70619 5.01428 8.53425 4.45158 8.1685C4.24525 8.03408 3.99204 7.87777 3.88262 7.8215C3.70131 7.72772 3.66067 7.71834 3.42934 7.72147C3.28866 7.72459 3.13861 7.73084 3.09485 7.7371Z"
                fill="#CB0B13"/>
          </svg>
        </NuxtLink>


        <button
            class="header__link _red header__cart"
            @click="asideMenuStore.open( MiniCartBlock, {
          title: 'Корзина',
          counter: cartStore.quantity
        } )"
        >
          <span class="header__cart-icon">
            <span class="header__cart-count " v-if="cartStore.quantity > 0">
              {{ cartStore.quantity }}
            </span>
            <svg class="w-[20px] h-[20px] max-md:w-[20px] max-md:h-[20px]" viewBox="0 0 14 18"
                 fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M6.2099 0.235056C5.43608 0.358866 4.71256 0.738037 4.17862 1.30679C3.5054 2.01484 3.21135 2.78866 3.21135 3.84105V4.3363H2.73545C2.43366 4.3363 2.1783 4.35951 2.03127 4.39433C1.38514 4.56457 0.827986 5.14107 0.700306 5.77947C0.653877 6.00387 0 15.6766 0 16.1138C0.00386909 16.6323 0.154764 17.0114 0.51072 17.3984C0.773819 17.6769 1.09495 17.8588 1.45865 17.9362C1.84943 18.0213 11.615 18.0213 12.0058 17.9362C12.3695 17.8588 12.6906 17.6769 12.9537 17.3984C13.3097 17.0114 13.4606 16.6323 13.4644 16.1138C13.4644 15.6766 12.8106 6.00387 12.7641 5.77947C12.6365 5.14107 12.0793 4.56457 11.4332 4.39433C11.2861 4.35951 11.0308 4.3363 10.729 4.3363H10.2531V3.84105C10.2531 2.78866 9.95905 2.01484 9.28583 1.30679C8.84088 0.830896 8.22956 0.471069 7.60277 0.312437C7.24294 0.219578 6.55424 0.180887 6.2099 0.235056ZM7.17717 1.5312C8.00902 1.70531 8.72481 2.39788 8.91826 3.21813C8.94921 3.36128 8.9763 3.65147 8.9763 3.89909V4.3363H6.73222H4.48815V3.89909C4.48815 3.1214 4.67773 2.63002 5.16524 2.14639C5.71852 1.59698 6.43817 1.37644 7.17717 1.5312ZM4.32178 7.72175C4.52297 7.80687 4.58875 7.87652 4.7319 8.14348C4.88667 8.43367 5.28905 8.84766 5.5715 9.00629C5.96614 9.2307 6.24085 9.30034 6.71288 9.30421C7.18878 9.30421 7.35902 9.26552 7.77301 9.0682C8.12897 8.89796 8.54683 8.49557 8.74415 8.12801C8.96856 7.71401 9.25487 7.58246 9.58375 7.74497C9.82363 7.86491 9.95518 8.07771 9.93196 8.30985C9.89714 8.66968 9.34773 9.40868 8.8254 9.80719C8.12123 10.3411 7.20425 10.5965 6.35692 10.492C5.71465 10.4146 5.13042 10.1825 4.63904 9.80719C4.11672 9.40868 3.5673 8.66968 3.53248 8.30985C3.51314 8.08158 3.64082 7.86491 3.86909 7.74884C4.07029 7.64824 4.13219 7.64437 4.32178 7.72175Z"
                  fill="#CB0B13"/>
            </svg>
          </span>
        </button>

        <button
            class="header__link _red header__fav pt-1"
            @click="asideMenuStore.open( FavouritesBlock, {
            title: 'Избранное',
            counter: favouritesStore.countInFavourites()
        } )"
        >
        <span class="header__fav-icon">
          <span class="header__fav-count " v-if="favouritesStore.countInFavourites() > 0">
            {{ favouritesStore.countInFavourites() }}
          </span>
          <svg class="w-[22px] h-[22px] max-md:w-[22px] max-md:h-[22px] " viewBox="0 0 22 22"
               fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15.0707 2.8418C13.4115 2.8418 11.9265 3.64846 11.0007 4.88596C10.0748 3.64846 8.58982 2.8418 6.93065 2.8418C4.11648 2.8418 1.83398 5.13346 1.83398 7.96596C1.83398 9.0568 2.00815 10.0651 2.31065 11.0001C3.75898 15.5835 8.22315 18.3243 10.4323 19.076C10.744 19.186 11.2573 19.186 11.569 19.076C13.7782 18.3243 18.2423 15.5835 19.6907 11.0001C19.9932 10.0651 20.1673 9.0568 20.1673 7.96596C20.1673 5.13346 17.8848 2.8418 15.0707 2.8418Z"
                fill="#CB0B13"/>
          </svg>
        </span>
        </button>

      <button
          class="header__link header__burger burger"
          @click="mobileMenuStore.toggle()"
          :class="{ '_active': mobileMenuStore.isActive }"
      >
          <span class="burger__icon">
            <span class="burger__line"></span>
            <span class="burger__line"></span>
            <span class="burger__line"></span>
          </span>
      </button>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import {FavouritesBlock, MiniCartBlock} from "#components";

const cartStore = useCartStore();
const asideMenuStore = useAsideMenuStore();
const favouritesStore = useFavouritesStore();
const authStore = useAuthStore();
const mobileMenuStore = useMobileMenuStore();

const loginUrl = computed(() => {
  return authStore.isAuthenticated ? '/profile/settings' : '/login';
});

const clickToMenu = () => {
  mobileMenuStore.close();
}
</script>

<style scoped lang="scss">
.header__links {
  display: flex;
  align-items: center;
  justify-content: center;

  & .header__link {
    & path {
      transition: var(--tr-regular);
    }

    @media(any-hover: hover) {
      &:hover {
        background: var(--fg-red);

        & path {
          fill: var(--fg-white);
        }

        .header__cart-count,
        .header__fav-count {
          transform: scale(1.1);
        }
      }
    }

    transition: all 0.3s ease;

    &:active {
      transform: translateY(0);
    }
  }
}

.header__cart-icon,
.header__fav-icon {
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.header__cart-count,
.header__fav-count {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: linear-gradient(135deg, #ff5761 0%, #cb0b13 100%);
  color: white;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(203, 11, 19, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
  transition: transform 0.2s ease;

  // Для чисел больше 9
  &:nth-last-child(n+10) {
    min-width: 20px;
  }

  // Для чисел больше 99
  &:nth-last-child(n+100) {
    min-width: 22px;
    font-size: 10px;
  }
}

// Анимация пульсации для привлечения внимания
@keyframes pulse {
  0% {
    box-shadow: 0 2px 6px rgba(203, 11, 19, 0.3);
  }
  50% {
    box-shadow: 0 2px 12px rgba(203, 11, 19, 0.6);
  }
  100% {
    box-shadow: 0 2px 6px rgba(203, 11, 19, 0.3);
  }
}

// Адаптивность для мобильных устройств
@media (max-width: $mobile) {
  .header__cart-count,
  .header__fav-count {
    min-width: 16px;
    height: 16px;
    font-size: 10px;
    line-height: 16px;
    top: -6px;
    right: -6px;
    border-width: 1.5px;

    &:nth-last-child(n+10) {
      min-width: 18px;
    }

    &:nth-last-child(n+100) {
      min-width: 20px;
      font-size: 9px;
    }
  }
}

// Улучшенные hover-эффекты
.header__link {
  @media(any-hover: hover) {
    &:hover {
      transform: translateY(-1px);
    }
  }
}
</style>