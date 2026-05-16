<template>
  <div class="profile-sales__item">
    <div class="profile-sales__item-media">
      {{item.image_url}}
      <picture class="profile-sales__item-pic">
        <img :src="item.image_url ?? '/icons/promo-code/default.png'"
             class="profile-sales__item-img"
             alt=""
        >
      </picture>
    </div>
    <div class="profile-sales__item-title" v-if="item.code">{{ item.code }}</div>
    <div class="profile-sales__item-text" v-if="item.description">{{ item.description }}</div>
    <div class="profile-sales__item-info">
      <p><strong>Дата окончания: </strong> {{ getDate(item) }}</p>
      <p><strong>Тип: </strong> {{ discountType[item.discount_type] }}</p>
      <p><strong>Сумма: </strong> {{ getFormatPrice().formattedPrice(item.discount_amount) }}
        {{ discountCurrency[item.discount_type] }}</p>
    </div>
    <!--    <div class="profile-sales__item-alert">Скидка 25% на первый заказ</div>-->
    <button
        class="profile-sales__item-btn btn _border _thin"
        :class="{ '_active': buttonActive }"
        @click="copyClick">
      {{ buttonTitle }}
    </button>
  </div>
</template>

<script setup lang="ts">
import copy from 'copy-to-clipboard';
import {discountCurrency, discountType, type Sale} from "~/types/sales";

const props = defineProps<{
  item: Sale
}>();

const buttonActive = ref(false);
const buttonTitle = ref('Скопировать');

const copyClick = () => {
  //navigator.clipboard.writeText( props.item.code );
  copy(props.item.code);
  buttonTitle.value = 'Скопирован';
  buttonActive.value = true;

  setTimeout(() => {
    buttonTitle.value = 'Скопировать';
    buttonActive.value = false;
  }, 1500)
}


const getDate = (item: Sale) => {

  const date = item.notified_at
      ? addDays(item.notified_at, 6)
      : item.expires_at
          ? item.expires_at
          : null;

  if (date) {
    return getDateFormat().formattedDate(date)
  } else {
    return '';
  }
}

function addDays(dateString: string, days: number) {
  const date = new Date(dateString.replace(" ", "T"));
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 19).replace("T", " ");
}

</script>

<style scoped lang="scss">
.profile-sales__item {
  max-width: 26.9rem;

  @media (max-width: $mobile) {
    max-width: 100%;
  }
}

.profile-sales__item-media {
  margin-bottom: 1.6rem;
}

.profile-sales__item-pic {
  min-height: 30rem;
  position: relative;

  @media (max-width: $mobile) {
    min-height: 27.4rem;
  }
}

.profile-sales__item-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: var(--br-regular);
}

.profile-sales__item-title {
  font-size: 1.8rem;
  line-height: 100%;
  font-weight: 300;
  margin-bottom: .5rem;

  @media (max-width: $mobile) {
    font-size: 1.6rem;
  }
}

.profile-sales__item-text {
  max-width: 23.5rem;
  font-size: 1.3rem;
  line-height: 140%;
  opacity: .5;
  margin-bottom: 1.3rem;

  @media (max-width: $mobile) {
    font-size: 1.2rem;
  }
}

.profile-sales__item-alert {
  font-weight: 700;
  color: var(--fg-red);
  line-height: 100%;
}

.profile-sales__item-btn {
  width: 100%;
  margin-top: 2.3rem;

  @media (max-width: $mobile) {
    margin-top: 2rem;
    text-transform: uppercase !important;
  }

  &._active {
    background: var(--fg-green) !important;
    color: var(--fg-white) !important;
    border-color: var(--fg-green);
  }
}

.profile-sales__item-info {
  --fz-regular: 1.4rem;
  margin-top: 1rem;
}
</style>