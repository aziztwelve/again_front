<template>
  <div class="checkout-gift-trigger"
       v-if="cartStore.hasGiftCertificateInCart">
<!--    <div class="checkout-gift-trigger__icon">🎁</div>-->
    <div class="checkout-gift-trigger__content">
      <h3 class="checkout-gift-trigger__title">Данные подарочной карты</h3>
      <p class="checkout-gift-trigger__text" v-if="!isDataFilled">
        Укажите, кому и как отправить подарочную карту после оплаты
      </p>
      <p class="checkout-gift-trigger__text " v-else>
        ✅ Данные заполнены
      </p>
    </div>
    <button
        class="checkout-gift-trigger__button btn _border _gray _dark"
        @click="openModal"
    >
      {{ isDataFilled ? 'Изменить' : 'Заполнить' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useGiftCardPurchaseStore } from '~/stores/giftCardPurchase';
import { ModalsGiftCardData } from '#components';
import {useCartStore} from "~/stores/cart";

const purchaseStore = useGiftCardPurchaseStore();
const cartStore = useCartStore()
const modal = useModal();

const isDataFilled = computed(() => {
  return !!purchaseStore.purchaseData.sender_name;
});

const openModal = () => {
  modal.openModal(ModalsGiftCardData);
};

// Expose метод валидации для родителя
defineExpose({
  validate: () => {
    const result = purchaseStore.validate();
    return result.valid;
  }
});

onMounted(() => {
  purchaseStore.loadFromStorage();
});
</script>

<style scoped lang="scss">
.checkout-gift-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 193, 7, 0.05) 100%);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 1.2rem;
  margin-bottom: 2rem;
  max-width: 50rem;

  @media (max-width: $mobile) {
    flex-direction: column;
    text-align: center;
  }
}

.checkout-gift-trigger__icon {
  font-size: 4rem;
  line-height: 1;
  flex-shrink: 0;

  @media (max-width: $mobile) {
    font-size: 3rem;
  }
}

.checkout-gift-trigger__content {
  flex: 1;
}

.checkout-gift-trigger__title {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: #3F3F3F;

  @media (max-width: $mobile) {
    font-size: 1.6rem;
  }
}

.checkout-gift-trigger__text {
  margin: 0;
  font-size: 1.4rem;
  color: #666;
  line-height: 1.5;

  &.success {
    color: #2e7d32;
    font-weight: 500;
  }

  @media (max-width: $mobile) {
    font-size: 1.3rem;
  }
}

.checkout-gift-trigger__button {
  flex-shrink: 0;
  min-width: 12rem;


  @media (max-width: $mobile) {
    width: 100%;
  }
}
</style>