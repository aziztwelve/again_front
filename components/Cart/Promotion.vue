<template>
  <div v-if="promotionStore.hasPromotion" class="cart__promotion">
    <div
        v-if="promotionStore.appliedPromotions.length > 1"
        class="cart__promotion-multi-title"
    >
      Ваши подарки по акциям
    </div>

    <PromotionItem
        v-for="promotion in promotionStore.appliedPromotions"
        :key="promotion.id"
        :promotion="promotion"
    />

    <!-- Общее сообщение стора (например, попытка взять скидку у запрещающей акции) -->
    <div v-if="promotionStore.message" class="cart__promotion-message" :class="promotionStore.messageClass">
      {{ promotionStore.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePromotionStore } from '~/stores/promotion';
import PromotionItem from '~/components/Cart/PromotionItem.vue';

const promotionStore = usePromotionStore();
</script>

<style scoped lang="scss">
.cart__promotion {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.cart__promotion-multi-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #2F2F2F;
}

.cart__promotion-message {
  padding: 0.8rem 1rem;
  border-radius: 0.6rem;
  font-size: 1.2rem;

  &.warning {
    color: #f57c00;
    background: rgba(245, 124, 0, 0.1);
    border-left: 3px solid #f57c00;
  }

  &.error {
    color: #d32f2f;
    background: rgba(211, 47, 47, 0.1);
    border-left: 3px solid #d32f2f;
  }

  &.success {
    color: #2e7d32;
    background: rgba(46, 125, 50, 0.1);
    border-left: 3px solid #2e7d32;
  }
}
</style>
