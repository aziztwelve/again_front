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
          <button class="profile-history__item-view">
          <span>
            <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.27942 0.781288C5.03228 1.00655 2.9747 2.20704 1.29621 4.27561C0.958318 4.69043 0.933594 4.73987 0.933594 4.96239C0.933594 5.17117 0.9748 5.24259 1.35665 5.70686C3.18897 7.93476 5.52951 9.15723 7.9662 9.15723C10.4331 9.15723 12.7819 7.91553 14.6362 5.63268C14.9741 5.21787 14.9988 5.16842 14.9988 4.94591C14.9988 4.73713 14.9576 4.6657 14.5757 4.20144C12.7269 1.95156 10.3672 0.73184 7.914 0.753817C7.69423 0.756564 7.40853 0.767552 7.27942 0.781288ZM8.58704 2.08067C9.55677 2.28945 10.3699 3.00095 10.727 3.94871C10.8562 4.29209 10.8891 4.49263 10.8864 4.96788C10.8864 5.35523 10.8781 5.44039 10.8149 5.67389C10.5375 6.71505 9.72709 7.52544 8.68594 7.8029C8.45243 7.86608 8.36727 7.87433 7.97993 7.87433C7.50468 7.87707 7.30414 7.84411 6.96075 7.71499C6.013 7.35787 5.31523 6.55846 5.08997 5.575C5.01855 5.26457 5.02679 4.59428 5.10371 4.2866C5.39765 3.11633 6.28771 2.28121 7.4827 2.0532C7.7272 2.0065 8.31783 2.02023 8.58704 2.08067Z" fill="black"/>
              <path d="M7.48758 3.42665C7.20463 3.52005 7.04255 3.62169 6.82827 3.84146C6.51785 4.15463 6.375 4.50626 6.375 4.95404C6.375 5.41555 6.51785 5.76169 6.83926 6.0831C7.16067 6.40451 7.50681 6.54736 7.96832 6.54736C8.4161 6.54736 8.76773 6.40451 9.0809 6.09409C9.41605 5.76444 9.56165 5.42105 9.56165 4.95679C9.56165 4.80844 9.54242 4.62164 9.52044 4.53373C9.38034 3.9953 8.92707 3.54202 8.38863 3.40192C8.14139 3.33874 7.72108 3.34973 7.48758 3.42665Z" fill="black"/>
            </svg>
          </span>
            <span>Информация о доставке</span>
          </button>
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
      <button class="profile-history__item-view">
          <span>
            <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.27942 0.781288C5.03228 1.00655 2.9747 2.20704 1.29621 4.27561C0.958318 4.69043 0.933594 4.73987 0.933594 4.96239C0.933594 5.17117 0.9748 5.24259 1.35665 5.70686C3.18897 7.93476 5.52951 9.15723 7.9662 9.15723C10.4331 9.15723 12.7819 7.91553 14.6362 5.63268C14.9741 5.21787 14.9988 5.16842 14.9988 4.94591C14.9988 4.73713 14.9576 4.6657 14.5757 4.20144C12.7269 1.95156 10.3672 0.73184 7.914 0.753817C7.69423 0.756564 7.40853 0.767552 7.27942 0.781288ZM8.58704 2.08067C9.55677 2.28945 10.3699 3.00095 10.727 3.94871C10.8562 4.29209 10.8891 4.49263 10.8864 4.96788C10.8864 5.35523 10.8781 5.44039 10.8149 5.67389C10.5375 6.71505 9.72709 7.52544 8.68594 7.8029C8.45243 7.86608 8.36727 7.87433 7.97993 7.87433C7.50468 7.87707 7.30414 7.84411 6.96075 7.71499C6.013 7.35787 5.31523 6.55846 5.08997 5.575C5.01855 5.26457 5.02679 4.59428 5.10371 4.2866C5.39765 3.11633 6.28771 2.28121 7.4827 2.0532C7.7272 2.0065 8.31783 2.02023 8.58704 2.08067Z" fill="black"/>
              <path d="M7.48758 3.42665C7.20463 3.52005 7.04255 3.62169 6.82827 3.84146C6.51785 4.15463 6.375 4.50626 6.375 4.95404C6.375 5.41555 6.51785 5.76169 6.83926 6.0831C7.16067 6.40451 7.50681 6.54736 7.96832 6.54736C8.4161 6.54736 8.76773 6.40451 9.0809 6.09409C9.41605 5.76444 9.56165 5.42105 9.56165 4.95679C9.56165 4.80844 9.54242 4.62164 9.52044 4.53373C9.38034 3.9953 8.92707 3.54202 8.38863 3.40192C8.14139 3.33874 7.72108 3.34973 7.48758 3.42665Z" fill="black"/>
            </svg>
          </span>
        <span>Информация о доставке</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Order} from "~/types/orders";

const props = defineProps<{
  order: Order
}>();
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