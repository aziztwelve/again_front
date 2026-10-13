<template>
  <details class="history-order" :open="expanded" @toggle="onToggle">
    <summary class="history-order__heading">
      <div>
        <h2 class="history-order__number">Заказ № {{ order.order_number }}</h2>
        <time class="history-order__date" :datetime="order.created_at">{{ date }}</time>
      </div>
      <div class="history-order__heading-end">
        <span class="history-order__status" :class="`history-order__status--${order.status}`">
          {{ order.status_label || 'Статус уточняется' }}
        </span>
        <span class="history-order__toggle">{{ expanded ? 'Свернуть' : 'Развернуть' }}</span>
      </div>
    </summary>

    <div class="history-order__body">
      <section class="history-order__receipt" aria-label="Состав и сумма заказа">
        <ul class="history-order__products">
          <li v-for="item in order.items" :key="item.id" class="history-order__product">
            <div class="history-order__image">
              <img :src="getImage(item.image_path || '')" :alt="item.name" loading="lazy" width="80" height="80" @error="imageFallback">
              <span class="history-order__quantity" :aria-label="`${item.quantity} шт.`">{{ item.quantity }}</span>
            </div>
            <div class="history-order__product-info">
              <NuxtLink v-if="item.product_slug" :to="`/catalog/${item.product_slug}`" class="history-order__name">{{ item.name }}</NuxtLink>
              <span v-else class="history-order__name">{{ item.name }}</span>
              <div class="history-order__variant">{{ [item.variant_name, item.color_name].filter(Boolean).join(' · ') || 'Количество: ' + item.quantity + ' шт.' }}</div>
              <div v-if="item.is_gift" class="history-order__discount">Подарок к заказу</div>
              <div v-else-if="item.discount_total > 0" class="history-order__discount">Скидка −{{ money(item.discount_total) }}</div>
            </div>
            <div class="history-order__price">
              <del v-if="!item.is_gift && item.original_total > item.total">{{ money(item.original_total) }}</del>
              <span>{{ item.is_gift ? 'Подарок' : money(item.total) }}</span>
            </div>
          </li>
        </ul>
        <p v-if="!order.items.length" class="history-order__missing">Состав этого заказа не сохранился.</p>
        <dl class="history-order__totals">
          <div><dt>Товары · {{ order.quantity }} шт.</dt><dd>{{ money(order.subtotal) }}</dd></div>
          <div v-if="order.discount_amount > 0"><dt>Скидка</dt><dd>−{{ money(order.discount_amount) }}</dd></div>
          <div><dt>Доставка</dt><dd>{{ order.delivery_cost === null ? 'Не указана' : order.delivery_cost === 0 ? 'Бесплатно' : money(order.delivery_cost) }}</dd></div>
          <div class="history-order__total"><dt>Итого</dt><dd>{{ money(order.total_amount) }}</dd></div>
          <div v-if="order.gift_card_amount > 0"><dt>Оплачено сертификатом</dt><dd>{{ money(order.gift_card_amount) }}</dd></div>
        </dl>
        <p v-if="order.discount_amount > 0" class="history-order__savings">Вы сэкономили {{ money(order.discount_amount) }}</p>
      </section>

      <div class="history-order__delivery-column">
        <dl class="history-order__delivery">
          <div><dt>Куда</dt><dd>{{ order.delivery_address || 'Адрес не указан' }}</dd></div>
          <div><dt>Доставка</dt><dd>{{ [order.delivery_method, order.delivery_target].filter(Boolean).join(' · ') || 'Способ не указан' }}</dd></div>
          <div><dt>Трек-код</dt><dd>
            <a v-if="trackingUrl && order.tracking_number" :href="trackingUrl" target="_blank" rel="noopener noreferrer" class="history-order__link">{{ order.tracking_number }}<span class="history-order__tracking-label">Отследить доставку</span></a>
            <span v-else>{{ order.tracking_number || 'Пока не присвоен' }}</span>
          </dd></div>
        </dl>
        <NuxtLink v-if="viewLink" :to="viewLink" class="history-order__view">Подробнее о заказе и оплате</NuxtLink>
        <div class="history-order__actions">
          <div v-if="confirmRepeat" class="history-order__confirmation">
            <p>Добавить товары в корзину? Цены, наличие и скидки будут проверены заново. Подарки из прошлого заказа не добавляются.</p>
            <div class="history-order__confirmation-buttons">
              <button type="button" :disabled="reorderingOrder !== null" @click="repeatOrder">{{ isReordering ? 'Добавляем…' : 'Добавить в корзину' }}</button>
              <button type="button" :disabled="reorderingOrder !== null" @click="confirmRepeat = false">Отмена</button>
            </div>
          </div>
          <button v-else type="button" class="history-order__repeat" :disabled="!canRepeat || reorderingOrder !== null" @click="openConfirmation">Повторить заказ</button>
          <p v-if="!canRepeat" class="history-order__hint">Товары из этого заказа больше недоступны для повторения.</p>
          <p v-if="message" class="history-order__message" :class="{ 'history-order__message--error': failed }" :role="failed ? 'alert' : 'status'">{{ message }}</p>
          <NuxtLink v-if="added" to="/checkout" class="history-order__checkout">Перейти к оформлению</NuxtLink>
        </div>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import type { Order } from '~/types/orders';
import type { Product } from '~/types/catalog';
import { mergeHistoryItem, type HistoryCartItem } from '~/utils/orderHistory';

const props = defineProps<{ order: Order }>();
const expanded = ref(true);
const confirmRepeat = ref(false);
const message = ref('');
const failed = ref(false);
const added = ref(false);
const reorderingOrder = useState<number | null>('history-reordering-order', () => null);
const isReordering = computed(() => reorderingOrder.value === props.order.id);
const cartStore = useCartStore();
const authStore = useAuthStore();
const apiBase = useRuntimeConfig().public.DEV_URI;
const canRepeat = computed(() => props.order.items.some(item => !item.is_gift && item.product_id && item.product_slug));
const viewLink = computed(() => props.order.view_token ? `/orders/${props.order.view_token}` : null);
const date = computed(() => {
  const value = new Date(props.order.created_at);
  return Number.isNaN(value.getTime()) ? 'Дата не указана' : new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Moscow',
  }).format(value);
});
const money = (value: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value) + ' ₽';
const trackingUrl = computed(() => {
  try {
    const url = new URL(props.order.tracking_url || '');
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
});
const onToggle = (event: Event) => { expanded.value = (event.target as HTMLDetailsElement).open; };
const imageFallback = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (!img.src.endsWith('/img/default.jpg')) img.src = '/img/default.jpg';
};
const openConfirmation = () => { confirmRepeat.value = true; message.value = ''; added.value = false; };

const repeatOrder = async () => {
  if (reorderingOrder.value !== null) return;
  failed.value = false;
  message.value = '';
  reorderingOrder.value = props.order.id;
  try {
    const items = props.order.items.filter(item => !item.is_gift);
    if (!items.length || items.some(item => !item.product_id || !item.product_slug)) {
      throw new Error('Часть товаров больше недоступна. Выберите подходящие товары в каталоге.');
    }
    const products = new Map<string, Product>();
    await Promise.all([...new Set(items.map(item => item.product_slug!))].map(async slug => {
      try {
        const response = await $fetch<{ data: Product }>(`${apiBase}/public/catalog/products/${encodeURIComponent(slug)}`, {
          credentials: 'include', headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {},
        });
        products.set(slug, response.data);
      } catch { throw new Error('Не удалось проверить товары. Возможно, часть из них снята с продажи. Корзина не изменена.'); }
    }));
    // Stage every line first: a failed stock check must leave the existing cart intact.
    let next = [...cartStore.cart] as HistoryCartItem[];
    for (const item of items) {
      const product = products.get(item.product_slug!)!;
      if (!product?.is_active || product.id !== item.product_id) throw new Error(`Товар «${item.name}» больше недоступен.`);
      next = mergeHistoryItem(next, product, item, crypto.randomUUID());
    }
    cartStore.cart = next;
    cartStore.init();
    confirmRepeat.value = false;
    added.value = true;
    message.value = 'Товары добавлены в корзину по актуальным ценам. Проверьте скидки и доставку при оформлении.';
  } catch (error) {
    failed.value = true;
    message.value = error instanceof Error ? error.message : 'Не удалось повторить заказ. Попробуйте ещё раз.';
  } finally { reorderingOrder.value = null; }
};
</script>

<style scoped lang="scss">
.history-order {
  --history-surface: #faf7f3;
  --history-line: #e4ded8;
  --history-muted: #63656d;
  position: relative;
  margin-bottom: 16px;
  padding: 22px 24px 24px 32px;
  border-radius: 14px;
  background: var(--history-surface);
  color: var(--fg-regular);
  font: 400 14px/1.55 var(--ff-text);
  min-width: 0;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 14px;
    width: 3px;
    background: var(--fg-red);
    border-radius: 2px;
  }
  &:last-child { margin-bottom: 0; }
}
.history-order__heading {
  list-style: none;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  &::-webkit-details-marker { display: none; }
}
.history-order__number {
  margin: 0 0 2px;
  font: 500 24px/1.25 var(--ff-heading);
  overflow-wrap: anywhere;
}
.history-order__date { font-size: 13px; color: var(--history-muted); }
.history-order__heading-end { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; justify-content: flex-end; padding-top: 1px; }
.history-order__toggle { font-size: 13px; color: var(--history-muted); text-decoration: underline; text-underline-offset: 3px; }
.history-order__status { padding: 5px 12px; border-radius: 24px; font-size: 12px; line-height: 1.5; background: #f2ebe1; color: #554d42; }
.history-order__status--delivered, .history-order__status--approved { background: #eaf2e9; color: #34624b; }
.history-order__status--shipped { background: #eaf0f8; color: #435d8b; }
.history-order__status--cancelled, .history-order__status--product_return, .history-order__status--return_payment { background: #fbe7e6; color: #a6202c; }
.history-order__body { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 24px; margin-top: 18px; align-items: start; }
.history-order__receipt { min-width: 0; }
.history-order__products { list-style: none; margin: 0; padding: 0; display: grid; gap: 18px; }
.history-order__product { display: grid; grid-template-columns: 80px minmax(0, 1fr) auto; align-items: start; gap: 12px; }
.history-order__image { position: relative; width: 80px; height: 80px; border-radius: 6px; background: #efeae4; }
.history-order__image img { display: block; width: 100%; height: 100%; object-fit: contain; border-radius: inherit; }
.history-order__quantity { position: absolute; right: -5px; top: -5px; min-width: 20px; height: 20px; padding: 0 4px; display: flex; align-items: center; justify-content: center; background: var(--fg-regular); color: var(--fg-white); border-radius: 12px; font-size: 11px; }
.history-order__name { display: block; font-size: 14px; font-weight: 600; line-height: 1.45; color: inherit; text-decoration: none; overflow-wrap: anywhere; }
a.history-order__name:hover { text-decoration: underline; text-underline-offset: 3px; }
.history-order__variant, .history-order__discount { font-size: 12px; color: var(--history-muted); margin-top: 3px; line-height: 1.5; overflow-wrap: anywhere; }
.history-order__price { display: flex; flex-direction: column; text-align: right; gap: 2px; font-size: 14px; font-weight: 600; line-height: 1.5; white-space: nowrap; font-variant-numeric: tabular-nums; }
.history-order__price del { color: var(--history-muted); font-size: 12px; font-weight: 400; }
.history-order__totals { margin: 18px 0 0; padding: 10px 0 0; border-top: 1px solid var(--history-line); }
.history-order__totals > div { display: flex; justify-content: space-between; gap: 12px; padding: 3px 0; font-size: 13px; line-height: 1.55; color: var(--history-muted); }
.history-order dt, .history-order dd { margin: 0; }
.history-order__totals dd { white-space: nowrap; font-variant-numeric: tabular-nums; text-align: right; }
.history-order__totals .history-order__total { font-size: 21px; font-weight: 600; color: var(--fg-regular); border-top: 1px solid var(--history-line); margin-top: 10px; padding: 10px 0 0; }
.history-order__savings { font-size: 12px; color: #34624b; margin: 2px 0 0; }
.history-order__delivery-column { min-width: 0; padding-left: 20px; border-left: 1px solid var(--history-line); }
.history-order__delivery { margin: 0; }
.history-order__delivery > div { display: grid; grid-template-columns: 76px minmax(0, 1fr); gap: 12px; padding: 12px 0; font-size: 13px; line-height: 1.6; border-bottom: 1px solid var(--history-line); &:first-child { padding-top: 4px; } }
.history-order__delivery dt { color: var(--history-muted); }
.history-order__delivery dd { overflow-wrap: anywhere; }
.history-order__link, .history-order__view, .history-order__checkout { color: inherit; text-decoration: underline; text-underline-offset: 3px; }
.history-order__tracking-label { display: block; font-size: 12px; color: var(--history-muted); }
.history-order__view { display: inline-block; margin-top: 14px; font-size: 12px; line-height: 1.6; }
.history-order__actions { margin-top: 16px; }
.history-order__repeat {
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--fg-red);
  border-radius: 6px;
  padding: 11px 16px;
  background: var(--bg-button-primary);
  color: var(--fg-white);
  font: 400 14px/1.5 var(--ff-text);
  cursor: pointer;
  transition: background-color .2s;
  &:hover:not(:disabled) { background: var(--bg-button-primary-hover); }
}
.history-order button:disabled { cursor: default; opacity: .5; }
.history-order button:focus-visible, .history-order a:focus-visible, .history-order__heading:focus-visible { outline: 2px solid var(--fg-red); outline-offset: 4px; }
.history-order__hint, .history-order__message, .history-order__missing { margin: 10px 0 0; font-size: 13px; line-height: 1.6; color: var(--history-muted); }
.history-order__message--error { color: var(--fg-red); }
.history-order__checkout { display: inline-block; margin-top: 10px; font-size: 13px; }
.history-order__confirmation { border: 1px solid var(--history-line); border-radius: 8px; background: var(--fg-white); padding: 14px; }
.history-order__confirmation p { margin: 0 0 12px; font-size: 13px; line-height: 1.6; }
.history-order__confirmation-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
.history-order__confirmation-buttons button { min-height: 44px; padding: 10px 12px; border: 1px solid var(--history-line); border-radius: 5px; font: 400 13px/1.5 var(--ff-text); cursor: pointer; &:first-child { background: var(--bg-button-primary); color: var(--fg-white); border-color: var(--fg-red); } }
@media (min-width: 992px) and (max-width: 1200px), (max-width: 760px) {
  .history-order__body { grid-template-columns: minmax(0, 1fr); gap: 18px; }
  .history-order__delivery-column { border-left: 0; padding-left: 0; padding-top: 4px; }
  .history-order__product { grid-template-columns: 80px minmax(0, 1fr) auto; }
}
@media (max-width: 575px) {
  .history-order { padding: 18px 16px 20px 24px; border-radius: 12px; }
  .history-order::before { left: 10px; top: 16px; bottom: 16px; width: 2px; }
  .history-order__heading { gap: 10px; }
  .history-order__number { font-size: 22px; }
  .history-order__date { font-size: 12px; }
  .history-order__heading-end { gap: 6px; flex-direction: column; align-items: flex-end; }
  .history-order__toggle { font-size: 12px; }
  .history-order__status { font-size: 11px; padding: 4px 9px; }
  .history-order__product { grid-template-columns: 64px minmax(0, 1fr) auto; gap: 10px; }
  .history-order__image { width: 64px; height: 64px; }
  .history-order__totals .history-order__total { font-size: 20px; }
}
@media (max-width: 390px) {
  .history-order__product { grid-template-columns: 64px minmax(0, 1fr); gap: 8px 10px; }
  .history-order__image { grid-row: span 2; }
  .history-order__price { grid-column: 2; flex-direction: row; flex-wrap: wrap; text-align: left; align-items: baseline; gap: 8px; }
  .history-order__heading { flex-direction: column; }
  .history-order__heading-end { flex-direction: row; align-items: center; justify-content: space-between; width: 100%; }
}
</style>
