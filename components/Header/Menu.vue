<template>
  <ul class="menu">
    <li
        v-for="(item, key) in menuItems"
        :key="key"
        class="menu__item"
        :class="{ 'menu__item--children': item.sublist && item.sublist.length }"
    >
      <NuxtLink :to="item.link" class="menu__link" @click="clickMenuItem">
        {{ item.title }}
        <span class="menu__link-icon" v-if="item.sublist && item.sublist.length">
          <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.4" d="M5 5L9.33013 0.5H0.669873L5 5Z" fill="#545454"/>
          </svg>
        </span>
      </NuxtLink>
      <ul class="menu__sub" v-if="item.sublist && item.sublist.length > 0">
        <li
            v-for="(subItem, subKey) in item.sublist"
            :key="subKey"
            class="menu__item"
            :class="{ 'menu__item--children': subItem.sublist && subItem.sublist.length }"
        >
          <NuxtLink :to="subItem.link" class="menu__link" @click="clickMenuItem">
            {{ subItem.title }}
            <span class="menu__link-icon" v-if="subItem.sublist && subItem.sublist.length">
              <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4" d="M5 5L9.33013 0.5H0.669873L5 5Z" fill="#545454"/>
              </svg>
            </span>
          </NuxtLink>

          <!-- Третий уровень -->
          <ul class="menu__sub menu__sub--nested" v-if="subItem.sublist && subItem.sublist.length > 0">
            <li v-for="(nestedItem, nestedKey) in subItem.sublist" :key="nestedKey" class="menu__item">
              <NuxtLink :to="nestedItem.link" class="menu__link" @click="clickMenuItem">
                {{ nestedItem.title }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import {useApi} from '~/composables/useApi'

const mobileMenuStore = useMobileMenuStore()

type MenuLinkItem = {
  link: string
  title: string
  sublist?: MenuLinkItem[]
}

export interface MenuCategory {
  id: number
  name: string
  slug: string
  parent_id?: number | null
  children?: MenuCategory[]
}

export interface MenuCategoriesResponse {
  success: boolean
  data: MenuCategory[]
}

// Загружаем категории из API
const {data: categories} = await useAsyncData(
    'catalog-menu-categories',
    async () => {
      const {data, error} = await useApi<MenuCategoriesResponse>('/public/catalog/menu-categories')

      if (error.value) {
        console.error('Ошибка загрузки категорий меню:', error.value)
        return []
      }

      return data.value?.data || []
    },
    {
      server: true,
      lazy: false,
    }
)

// Рекурсивная функция для построения меню
const buildCategoryMenu = (category: MenuCategory): MenuLinkItem => {
  const menuItem: MenuLinkItem = {
    link: `/catalog?category=${category.slug}`,
    title: category.name,
  }

  if (category.children && category.children.length > 0) {
    menuItem.sublist = category.children.map(child => buildCategoryMenu(child))
  }

  return menuItem
}

// Формируем меню
const menuItems = computed(() => {
  // Подменю каталога - начинаем с "Все товары"
  const catalogSublist: MenuLinkItem[] = [
    {
      link: '/catalog',
      title: 'Все товары'
    }
  ]

  // Добавляем категории из API рекурсивно
  if (categories.value?.length) {
    categories.value.forEach((cat: MenuCategory) => {
      catalogSublist.push(buildCategoryMenu(cat))
    })
  }

  // Возвращаем полное меню
  return [
    {
      link: '/',
      title: 'Главная'
    },
    {
      link: '#',
      title: 'Каталог',
      sublist: catalogSublist
    },
    {
      link: '#',
      title: 'Информация для клиентов',
      sublist: [
        {
          link: '/delivery',
          title: 'Доставка и оплата',
        },
        {
          link: '/returns',
          title: 'Обмен и возврат',
        },
        {
          link: '/care',
          title: 'Уход и использование',
        },
        {
          link: '/sertificates',
          title: 'Сертификаты',
        },
        {
          link: '/selection',
          title: 'Подбор по впитываемости и по размеру',
        },
      ]
    },
    {
      link: '/faq',
      title: 'Отвечаем на ваши вопросы'
    },
    {
      link: '/articles',
      title: 'Полезное'
    },
    {
      link: '/contacts',
      title: 'Контакты'
    },
  ]
})

const clickMenuItem = (event: any) => {
  const item = event.target
  const liItem = item.closest('li')

  if (liItem.classList.contains('menu__item--children')) {
    event.preventDefault()
    // Находим только прямое дочернее подменю (не вложенное)
    const subList = liItem.querySelector(':scope > .menu__sub')
    if (subList) {
      liItem.classList.toggle('_active')
    }
  } else {
    mobileMenuStore.close()
  }
}
</script>

<style scoped lang="scss">
.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu__item {
  position: relative;

  &:hover {
    & > .menu__link {
      color: rgba(203, 11, 19, .8);

      & .menu__link-icon path {
        fill: rgba(203, 11, 19, .8);
      }
    }
  }

  @media (max-width: $tablet) {
    width: 100%;
  }
}

@media (any-hover: hover) {
  .menu__item--children:hover {
    & > .menu__sub {
      transform: translateX(0);
      opacity: 1;
      z-index: 998;
      pointer-events: auto;
    }
  }
}

@media (max-width: $tablet) {
  .menu__item--children._active {
    & > .menu__sub {
      grid-template-rows: 1fr;
      height: auto;
      opacity: 1;
      padding-top: 2.3rem;
      pointer-events: auto;
    }
  }
}

.menu__link {
  display: flex;
  align-items: center;
  justify-content: space-between; /* ключ */
  gap: .6rem;
  width: 100%;                  /* ключ */
}

.menu__link-icon {
  flex: 0 0 auto;               /* ключ: не сжимать и не переносить */
  margin-left: 0;               /* можно убрать, раз есть gap */

  & path {
    transition: var(--tr-regular);
  }

  @media (max-width: $tablet) {
    position: absolute;
    right: 0;
    top: 1rem;
  }
}

.menu__sub {
  position: absolute;
  left: 0;
  padding: 1.9rem 1.8rem 2.3rem;
  border-radius: var(--br-regular);
  box-shadow: 0 7px 15px 0 rgba(0, 0, 0, 0.1), 0 28px 28px 0 rgba(0, 0, 0, 0.09), 0 63px 38px 0 rgba(0, 0, 0, 0.05), 0 112px 45px 0 rgba(0, 0, 0, 0.01), 0 175px 49px 0 rgba(0, 0, 0, 0);
  z-index: -1;
  white-space: nowrap;
  background: var(--fg-white);
  transform: translateX(-100%);
  opacity: 0;
  transition: var(--tr-regular);
  pointer-events: none;

  & .menu__item {
    margin-bottom: 1.2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  @media (max-width: $tablet) {
    position: relative;
    top: 0;
    left: 0;
    transform: none;
    opacity: 0;
    z-index: 1;
    grid-template-rows: 0;
    height: 0;
    transition: all 0.4s;
    overflow: hidden;
    box-shadow: none;
    padding: 0 0 0 2.2rem;
    border-radius: 0;
  }
}

.menu__sub--nested {

  @media (max-width: $tablet) {
    padding-left: 4.4rem;
  }
}


/* ===== DESKTOP: 3-й уровень открываем СПРАВА ===== */
@media (any-hover: hover) {
  /* родитель 2-го уровня уже position:relative через .menu__item */
  .menu__sub--nested {
    position: absolute;
    top: 0;
    left: 100%;              /* справа от 2-го уровня */
    transform: translateX(10px); /* чуть отступ и анимация */
    opacity: 0;
    pointer-events: none;
    z-index: 999;

    /* внешний вид как у 2-го уровня */
    padding: 1.4rem 1.6rem;
    border-radius: var(--br-regular);
    box-shadow: 0 7px 15px 0 rgba(0, 0, 0, 0.1),
    0 28px 28px 0 rgba(0, 0, 0, 0.09),
    0 63px 38px 0 rgba(0, 0, 0, 0.05),
    0 112px 45px 0 rgba(0, 0, 0, 0.01),
    0 175px 49px 0 rgba(0, 0, 0, 0);
    background: var(--fg-white);
    white-space: nowrap;
    transition: var(--tr-regular);
  }

  /* показываем 3-й уровень при наведении на пункт 2-го уровня */
  .menu__sub > .menu__item--children:hover > .menu__sub--nested {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
  }
}


</style>