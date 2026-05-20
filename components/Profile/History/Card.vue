<template>
  <div class="profile-history__item">
    <div class="profile-history__item-main">
      <div class="profile-history__item-media" v-if="order.items.length > 0">
        <img :src="getImage( order.items[0].main_image?.path ?? '' )" alt="">
      </div>
      <div class="profile-history__item-content">
        <div class="profile-history__item-col">
          <div class="profile-history__item-number">Номер заказа: {{ order.order_number }}</div>
          <div class="profile-history__item-title">Box Again</div>
          <div class="profile-history__item-delivery">
            <div class="profile-history__item-count _mobile">{{ order.items.length }} штук</div>
            <span>Доставка</span>
          </div>
        </div>
        <div class="profile-history__item-col">
          <div class="profile-history__item-date">Дата заказа: {{ getDateFormat().formattedDate( order.created_at ) }}</div>
          <div class="profile-history__item-count">Количество: {{ order.items.length }}</div>
        </div>
        <div class="profile-history__item-bottom">
          <button class="profile-history__item-repeat">Повторить заказ</button>
          <component
              :is="viewLink ? NuxtLink : 'button'"
              :to="viewLink || undefined"
              class="profile-history__item-view"
          >
            <span>
              <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.27942 0.781288C5.03228 1.00655 2.9747 2.20704 1.29621 4.27561C0.958318 4.69043 0.933594 4.73987 0.933594 4.96239C0.933594 5.17117 0.9748 5.24259 1.35665 5.70686C3.18897 7.93476 5.52951 9.15723 7.9662 9.15723C10.4331 9.15723 12.7819 7.91553 14.6362 5.63268C14.9741 5.21787 14.9988 5.16842 14.9988 4.94591C14.9988 4.73713 14.9576 4.6657 14.5757 4.20144C12.7269 1.95156 10.3672 0.73184 7.914 0.753817C7.69423 0.756564 7.40853 0.767552 7.27942 0.781288Z" fill="black"/>
              </svg>
            </span>
            <span>Информация о доставке</span>
          </component>
        </div>
      </div>
    </div>
    <div class="profile-history__item-last">
      <div class="profile-history__item-date _mobile">Дата заказа: {{ getDateFormat().formattedDate( order.created_at ) }}</div>
      <div class="profile-history__item-status"><p>Статус заказа</p> <span>{{ getStatus( order.status ).label }}</span></div>
      <div class="profile-history__item-price price">
        <div class="price__new">{{ getFormatPrice().formattedPrice( order.total_amount ) }} ₽</div>
<!--        <div class="price__old">10 900 ₽</div>-->
      </div>
    </div>
    <div class="profile-history__item-bottom _mobile">
      <button class="profile-history__item-repeat">Повторить заказ</button>
      <component
          :is="viewLink ? NuxtLink : 'button'"
          :to="viewLink || undefined"
          class="profile-history__item-view"
      >
          <span>
            <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.27942 0.781288C5.03228 1.00655 2.9747 2.20704 1.29621 4.27561C0.958318 4.69043 0.933594 4.73987 0.933594 4.96239C0.933594 5.17117 0.9748 5.24259 1.35665 5.70686C3.18897 7.93476 5.52951 9.15723 7.9662 9.15723C10.4331 9.15723 12.7819 7.91553 14.6362 5.63268C14.9741 5.21787 14.9988 5.16842 14.9988 4.94591C14.9988 4.73713 14.9576 4.6657 14.5757 4.20144C12.7269 1.95156 10.3672 0.73184 7.914 0.753817C7.69423 0.756564 7.40853 0.767552 7.27942 0.781288Z" fill="black"/>
            </svg>
          </span>
        <span>Информация о доставке</span>
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Order} from "~/types/orders";
// `NuxtLink` доступен глобально в шаблоне, но для `<component :is>` нам нужен
// прямой импорт через #components.
import { NuxtLink } from '#components';

const props = defineProps<{
  order: Order
}>();

// «Информация о доставке» — ссылка на единую публичную страницу заказа
// `/orders/{view_token}`. Если у заказа в БД нет view_token (например,
// старые записи), оставляем кнопку без перехода — поведение как было до
// рефактора.
const viewLink = computed(() =>
    props.order.view_token ? `/orders/${props.order.view_token}` : null,
);
</script>

<style scoped lang="scss">
.profile-history__item {
  display: flex;
  justify-content: space-between;

  --fz-small: 1.3rem;
  margin-bottom: 3rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: $tablet) {
    flex-wrap: wrap;
  }

  @media (max-width: $mobile) {
    --fz-small: 1rem;
  }
}

.profile-history__item-media {
  min-width: 11.3rem;
  height: 11.3rem;
  position: relative;
  margin-right: 2.1rem;

  & img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-position: center;
    object-fit: cover;
  }

  @media (max-width: $mobile) {
    min-width: 6.5rem;
    height: 6.5rem;
  }
}

.profile-history__item-main {
  display: flex;
  align-items: flex-start;
}

.profile-history__item-content {
  display: flex;
  flex-wrap: wrap;
}

.profile-history__item-col {
  min-width: 18rem;
  max-width: 100%;
  margin-right: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:last-child {
    margin-right: 0;
  }

  @media (max-width: $mobile) {
    min-width: auto;
    margin-right: 0;
  }
}

.profile-history__item-number {
  font-size: var(--fz-small);
  color: #616161;
  opacity: .3;
  margin-bottom: .8rem;
  line-height: 145%;
}

.profile-history__item-title {
  font-size: 1.8rem;
  font-weight: 300;
  margin-bottom: .8rem;
  line-height: 100%;
}

.profile-history__item-delivery {
  display: flex;
  align-items: center;

  & span {
    font-size: var(--fz-small);
    color: var(--fg-regular);
    opacity: .3;
    line-height: 145%;
  }
}

.profile-history__item-date {
  font-size: var(--fz-small);
  color: #616161;

  &._mobile {
    display: none;
  }

  @media (max-width: $mobile) {
    display: none;

    &._mobile {
      display: block;
    }
  }
}

.profile-history__item-count {
  font-size: var(--fz-small);
  color: #616161;

  &._mobile {
    display: none;
  }

  @media (max-width: $mobile) {
    display: none;

    &._mobile {
      display: block;
      margin-right: 1.5rem;
    }
  }
}

.profile-history__item-bottom {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 1rem;

  &._mobile {
    display: none;
  }

  @media (max-width: $mobile) {
    display: none;

    &._mobile {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  }
}

.profile-history__item-repeat {
  padding: 1.2rem 3.5rem;
  font-size: 1.2rem;
  line-height: 100%;
  color: #4B4B4B;
  border: .068rem solid #4B4B4B;
  border-radius: 2.5rem;

  @media (max-width: $mobile) {
    width: 24.6rem;
    min-height: 4rem;
  }
}

.profile-history__item-view {
  display: flex;
  align-items: center;
  margin-left: 1.5rem;
  text-decoration: none;
  color: inherit;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;

  & span:first-child {
    min-width: 4rem;
    height: 4rem;
    border-radius: 50%;
    border: .068rem solid #4B4B4B;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & span:last-child {
    font-size: 1.2rem;
    font-weight: 500;
    opacity: .4;
    color: #4B4B4B;
    margin-left: 1.2rem;

    @media (max-width: $mobile) {
      display: none;
    }
  }
}

.profile-history__item-last {
  min-width: fit-content;

  @media (max-width: $mobile) {
    min-width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
  }
}

.profile-history__item-status {
  display: flex;
  align-items: center;
  font-size: var(--fz-small);

  & p {
    font-size: var(--fz-small);
  }

  & span {
    color: #5BB33C;
    margin-left: 2.8rem;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      right: calc(100% + .5rem);
      top: 50%;
      transform: translate(0, -50%);
      width: .6rem;
      height: .6rem;
      border-radius: 50%;
      background-color: #5BB33C;
    }
  }

  @media (max-width: $mobile) {
    justify-content: flex-end;

    & p {
      display: none;
    }
  }
}

.profile-history__item-price {
  justify-content: flex-end;
  margin-top: 2.3rem;

  @media (max-width: $mobile) {
    margin-top: 0;
  }
}

</style>
