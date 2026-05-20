<template>
  <div v-if="promotionStore.hasPromotion" class="cart__promotion">
    <div class="cart__promotion-header">
      <div class="cart__promotion-icon">🎁</div>
      <div class="cart__promotion-info">
        <div class="cart__promotion-title">{{ promotionStore.activePromotion.name }}</div>
        <div v-if="promotionStore.activePromotion.description" class="cart__promotion-desc">
          {{ promotionStore.activePromotion.description }}
        </div>
      </div>
    </div>

    <!-- Выбор: подарок или промокод/скидка -->
    <div v-if="promotionStore.allowPromoCodes" class="cart__promotion-choice">
      <div class="cart__promotion-choice-label">Выберите бонус:</div>
      <div class="cart__promotion-choice-options">
        <button
            class="cart__promotion-option"
            :class="{ '_active': promotionStore.userChoice === 'gift' }"
            @click="promotionStore.selectGift(promotionStore.giftProducts[0])"
        >
          <span class="cart__promotion-option-icon">🎁</span>
          <span>Подарок</span>
        </button>
        <button
            class="cart__promotion-option"
            :class="{ '_active': promotionStore.userChoice === 'discount' }"
            @click="promotionStore.selectDiscount()"
        >
          <span class="cart__promotion-option-icon">🏷</span>
          <span>Промокод / скидка</span>
        </button>
      </div>
    </div>

    <!-- Если промокоды не разрешены — сообщение -->
    <div v-else class="cart__promotion-no-promo">
      Промокоды и скидки не действуют с этой акцией. Вам доступен подарок!
    </div>

    <!-- Выбор подарка -->
    <div v-if="promotionStore.userChoice === 'gift' && promotionStore.giftProducts.length > 0" class="cart__promotion-gifts">
      <div class="cart__promotion-gifts-label">Выберите подарок:</div>
      <div class="cart__promotion-gifts-list">
        <div
            v-for="gift in promotionStore.giftProducts"
            :key="gift.id"
            class="cart__promotion-gift-wrap"
        >
          <div
              class="cart__promotion-gift"
              :class="{ '_selected': promotionStore.selectedGift?.id === gift.id }"
              @click="promotionStore.selectGift(gift)"
          >
            <div v-if="gift.image" class="cart__promotion-gift-img">
              <img :src="gift.image" :alt="gift.name" />
            </div>
            <div class="cart__promotion-gift-info">
              <div class="cart__promotion-gift-name">{{ gift.name }}</div>
              <div class="cart__promotion-gift-qty">x{{ gift.quantity }}</div>
              <div class="cart__promotion-gift-price">Бесплатно</div>
            </div>
            <div v-if="promotionStore.selectedGift?.id === gift.id" class="cart__promotion-gift-check">✓</div>
          </div>

          <!-- Выбор варианта: шаг 1 — цвет, шаг 2 — размер -->
          <div
              v-if="promotionStore.selectedGift?.id === gift.id && gift.has_variants"
              class="cart__promotion-gift-variants"
          >
            <template v-if="gift.variants && gift.variants.length > 0">

              <!-- Шаг 1: Цвет -->
              <template v-if="uniqueColors(gift).length > 0">
                <div class="cart__promotion-gift-variants-label">Цвет:</div>
                <div class="cart__promotion-gift-colors">
                  <button
                      v-for="color in uniqueColors(gift)"
                      :key="color.id"
                      type="button"
                      class="cart__promotion-gift-color"
                      :class="{ '_selected': promotionStore.selectedGiftColorByGiftId[gift.id] === color.id }"
                      :title="color.name"
                      @click="promotionStore.selectGiftColor(gift, color.id)"
                  >
                    <span
                        class="cart__promotion-gift-color-swatch"
                        :style="{ background: color.code || '#ccc' }"
                    />
                    <span class="cart__promotion-gift-color-name">{{ color.name }}</span>
                  </button>
                </div>
              </template>

              <!-- Шаг 2: Размер (показывается после выбора цвета) -->
              <template v-if="promotionStore.selectedGiftColorByGiftId[gift.id] || uniqueColors(gift).length === 0">
                <div class="cart__promotion-gift-variants-label">Размер:</div>
                <div class="cart__promotion-gift-variants-list">
                  <button
                      v-for="variant in variantsByColor(gift)"
                      :key="variant.id"
                      type="button"
                      class="cart__promotion-gift-variant"
                      :class="{ '_selected': promotionStore.selectedGiftVariantByGiftId[gift.id] === variant.id }"
                      @click="promotionStore.selectGiftVariant(variant)"
                  >
                    {{ variant.name || variant.sku || '—' }}
                  </button>
                </div>
              </template>

              <div
                  v-if="!promotionStore.selectedGiftVariantByGiftId[gift.id]"
                  class="cart__promotion-gift-variants-warn"
              >
                Пожалуйста, выберите вариант для подарка
              </div>
            </template>
            <div v-else class="cart__promotion-gift-variants-empty">
              К сожалению, ни один вариант этого подарка сейчас не доступен.
              Выберите другой подарок.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Сообщение -->
    <div v-if="promotionStore.message" class="cart__promotion-message" :class="promotionStore.messageClass">
      {{ promotionStore.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePromotionStore } from '~/stores/promotion';

const promotionStore = usePromotionStore();

interface GiftVariantColor {
  id: number;
  name: string;
  code?: string | null;
}

interface GiftVariant {
  id: number;
  name?: string | null;
  sku?: string | null;
  color?: GiftVariantColor | null;
}

interface GiftProduct {
  id: number;
  has_variants: boolean;
  variants?: GiftVariant[];
}

const uniqueColors = (gift: GiftProduct) => promotionStore.uniqueColorsForGift(gift);
const variantsByColor = (gift: GiftProduct) => promotionStore.variantsForGiftByColor(gift);
</script>

<style scoped lang="scss">
.cart__promotion {
  margin-top: 2rem;
  padding: 2rem;
  border-radius: 1rem;
  background: rgba(76, 175, 80, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.cart__promotion-header {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
}

.cart__promotion-icon {
  font-size: 2.4rem;
  flex-shrink: 0;
}

.cart__promotion-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2F2F2F;
}

.cart__promotion-desc {
  margin-top: 0.4rem;
  font-size: 1.2rem;
  color: #666;
}

.cart__promotion-choice {
  margin-top: 1.6rem;
}

.cart__promotion-choice-label {
  font-size: 1.3rem;
  font-weight: 500;
  color: #2F2F2F;
  margin-bottom: 0.8rem;
}

.cart__promotion-choice-options {
  display: flex;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
}

.cart__promotion-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1.2rem 1.6rem;
  border-radius: 0.8rem;
  border: 2px solid #e0e0e0;
  background: #fff;
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4CAF50;
  }

  &._active {
    border-color: #4CAF50;
    background: rgba(76, 175, 80, 0.08);
    color: #2e7d32;
  }
}

.cart__promotion-option-icon {
  font-size: 1.6rem;
}

.cart__promotion-no-promo {
  margin-top: 1.2rem;
  padding: 1rem 1.2rem;
  border-radius: 0.6rem;
  font-size: 1.2rem;
  background: rgba(255, 152, 0, 0.08);
  border-left: 3px solid #FF9800;
  color: #e65100;
}

.cart__promotion-gifts {
  margin-top: 1.6rem;
}

.cart__promotion-gifts-label {
  font-size: 1.3rem;
  font-weight: 500;
  color: #2F2F2F;
  margin-bottom: 0.8rem;
}

.cart__promotion-gifts-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.cart__promotion-gift {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  border-radius: 0.8rem;
  border: 2px solid #e0e0e0;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4CAF50;
  }

  &._selected {
    border-color: #4CAF50;
    background: rgba(76, 175, 80, 0.05);
  }
}

.cart__promotion-gift-img {
  width: 5rem;
  height: 5rem;
  border-radius: 0.6rem;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.cart__promotion-gift-info {
  flex: 1;
}

.cart__promotion-gift-name {
  font-size: 1.3rem;
  font-weight: 500;
  color: #2F2F2F;
}

.cart__promotion-gift-qty {
  font-size: 1.1rem;
  color: #888;
  margin-top: 0.2rem;
}

.cart__promotion-gift-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2e7d32;
  margin-top: 0.2rem;
}

.cart__promotion-gift-check {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background: #4CAF50;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: bold;
  flex-shrink: 0;
}

.cart__promotion-gift-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.cart__promotion-gift-variants {
  margin-left: 0.4rem;
  padding: 1rem 1.2rem;
  border-left: 3px solid rgba(76, 175, 80, 0.4);
  background: rgba(76, 175, 80, 0.04);
  border-radius: 0 0.6rem 0.6rem 0;
}

.cart__promotion-gift-variants-label {
  font-size: 1.2rem;
  font-weight: 500;
  color: #2F2F2F;
  margin-bottom: 0.6rem;
}

.cart__promotion-gift-variants-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.cart__promotion-gift-variant {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  border: 1px solid #d0d0d0;
  background: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: #4CAF50;
  }

  &._selected {
    border-color: #4CAF50;
    background: #4CAF50;
    color: #fff;
  }
}

.cart__promotion-gift-variant-swatch {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}

.cart__promotion-gift-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
}

.cart__promotion-gift-color {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem 0.5rem 0.6rem;
  border-radius: 2rem;
  border: 2px solid #e0e0e0;
  background: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: #4CAF50;
  }

  &._selected {
    border-color: #4CAF50;
    background: rgba(76, 175, 80, 0.07);
  }
}

.cart__promotion-gift-color-swatch {
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.cart__promotion-gift-color-name {
  font-size: 1.2rem;
  color: #2F2F2F;
}

.cart__promotion-gift-variants-warn {
  margin-top: 0.6rem;
  font-size: 1.1rem;
  color: #e65100;
}

.cart__promotion-gift-variants-empty {
  font-size: 1.2rem;
  color: #d32f2f;
}

.cart__promotion-message {
  margin-top: 1.2rem;
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
