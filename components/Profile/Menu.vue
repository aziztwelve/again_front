<template>
  <div class="profile-menu">
    <div class="profile-menu__item" v-for="(item, key) in menuItems" :key="key" :class="{ '_logout': item.isLogout }">
      <button
          v-if="item.isLogout"
          class="profile-menu__link"
          :style="{ '--before': `url(${item.icon})` }"
          @click="auth.logout()"
      >
        <span>{{ item.title }}</span>
      </button>

      <NuxtLink
          v-else
          :to="item.link"
          class="profile-menu__link"
          :class="{ '_active': route.path === item.link }"
          :style="{ '--before': `url(${item.icon})` }"
      >
        <span>{{ item.title }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const menuItems = ref( [
  {
    title: 'Избранное',
    link: '/profile/favourites',
    icon: '/img/profile.again/menu/item-1.svg'
  },
  {
    title: 'История заказов',
    link: '/profile/history',
    icon: '/img/profile.again/menu/item-2.svg'
  },
  {
    title: 'Адрес доставки',
    link: '/profile/address',
    icon: '/img/profile.again/menu/item-3.svg'
  },
  {
    title: 'Скидки и бонусы',
    link: '/profile/sales',
    icon: '/img/profile.again/menu/item-4.svg'
  },
  {
    title: 'Контактные данные',
    link: '/profile/settings',
    icon: '/img/profile.again/menu/item-5.svg'
  },
  {
    title: 'Выход',
    link: '/',
    isLogout: true,
    icon: '/img/profile.again/menu/item-6.svg'
  }
] );

const auth = useAuthStore();
</script>

<style scoped lang="scss">
.profile-menu {
  padding: 3.2rem 1.5rem 3.5rem 3.7rem;
  background-color: rgba(237, 234, 232, .5);
  border-radius: 3rem;

  @media (max-width: $tablet) {
    background: none;
    border-radius: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}

.profile-menu__item {
  position: relative;
  margin-bottom: 2.8rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: $tablet) {
    margin-right: .8rem;
    margin-bottom: .6rem;

    &:not(._logout) .profile-menu__link:before {
      display: none;
    }

    &._logout .profile-menu__link {
      min-width: 3rem;
      height: 3rem;
      border-radius: 50%;
      padding: 0;

      &:before {
        width: 1.49rem;
        height: 1.49rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    &._logout .profile-menu__link span {
      display: none;
    }
  }
}

.profile-menu__link {
  display: block;
  padding-left: 3.6rem;
  position: relative;
  font-size: 1.6rem;
  color: #767676;
  font-weight: 400;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0, -50%);
    width: 2.4rem;
    height: 2.4rem;
    background-image: var(--before);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    transition: var(--tr-regular);
    opacity: .6;
  }

  @media(any-hover: hover) {
    &:hover {
      color: #292D32;
      font-weight: 700;

      &:before {
        opacity: 1;
      }
    }
  }

  &._active {
    color: #292D32;
    font-weight: 700;

    &:before {
      opacity: 1;
    }
  }

  @media (max-width: $tablet) {
    padding: .5rem 2rem;
    border: .1rem solid #EAEAEA;
    border-radius: 4rem;
    font-size: 1.4rem;
    font-family: var(--ff-sf-pro);
  }
}

</style>