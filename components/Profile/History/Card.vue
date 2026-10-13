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
              <img :src="getImage(item.image_path || '')" :alt="item.name" loading="lazy" width="64" height="64" @error="imageFallback">
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
  color: var(--fg-regular);
  font-family: var(--ff-text);
  padding: 2.4rem 0;
  border-bottom: 1px solid var(--br-dark);
  &:first-child { padding-top: 0; }
  &:last-child { border-bottom: 0; }
}
.history-order__heading {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  cursor: pointer;
  &::-webkit-details-marker { display: none; }
}
.history-order__number { margin: 0 0 .5rem; font-size: 1.8rem; font-weight: 500; line-height: 1.4; }
.history-order__date { font-size: 1.3rem; color: var(--fg-gray-2); }
.history-order__heading-end { display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap; justify-content: flex-end; }
.history-order__toggle { font-size: 1.2rem; color: var(--fg-gray-2); text-decoration: underline; text-underline-offset: .3rem; }
.history-order__status { padding: .6rem 1.1rem; border-radius: 2rem; font-size: 1.2rem; line-height: 1.4; background: var(--bg-gray-item); color: var(--fg-gray-2); }
.history-order__status--delivered, .history-order__status--approved { background: #edf2ea; color: #49624b; }
.history-order__status--processing, .history-order__status--new { background: #fff4df; color: #7d602a; }
.history-order__status--shipped { background: #eef2fa; color: #435d8b; }
.history-order__status--cancelled, .history-order__status--product_return, .history-order__status--return_payment { background: #f8eeee; color: #954747; }
.history-order__body { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 1.8rem; margin-top: 1.8rem; align-items: start; }
.history-order__receipt, .history-order__delivery { background: var(--fg-white); border: 1px solid var(--br-dark); border-radius: 1.2rem; min-width: 0; }
.history-order__products { list-style: none; margin: 0; padding: 2rem 1.6rem 1rem; display: grid; gap: 2rem; }
.history-order__product { display: grid; grid-template-columns: 6.4rem minmax(0, 1fr) auto; align-items: start; gap: 1.2rem; }
.history-order__image { position: relative; width: 6.4rem; height: 6.4rem; border: 1px solid var(--br-dark); border-radius: .5rem; background: var(--bg-gray-item); }
.history-order__image img { width: 100%; height: 100%; object-fit: contain; border-radius: inherit; }
.history-order__quantity { position: absolute; right: -.5rem; top: -.6rem; min-width: 2rem; height: 2rem; padding: 0 .4rem; display: flex; align-items: center; justify-content: center; background: var(--fg-regular); color: var(--fg-white); border-radius: 1rem; font-size: 1.1rem; }
.history-order__name { display: block; font-size: 1.3rem; font-weight: 500; line-height: 1.5; text-transform: uppercase; color: inherit; text-decoration: none; overflow-wrap: anywhere; }
a.history-order__name:hover { text-decoration: underline; }
.history-order__variant, .history-order__discount { font-size: 1.2rem; color: var(--fg-gray-2); margin-top: .3rem; line-height: 1.5; overflow-wrap: anywhere; }
.history-order__price { display: flex; flex-direction: column; text-align: right; gap: .2rem; font-size: 1.3rem; line-height: 1.5; white-space: nowrap; font-variant-numeric: tabular-nums; }
.history-order__price del { color: var(--fg-gray-2); font-size: 1.2rem; }
.history-order__totals { margin: 0; padding: 1.8rem 1.6rem 0; }
.history-order__totals > div { display: flex; justify-content: space-between; gap: 1.2rem; padding: .4rem 0; font-size: 1.3rem; line-height: 1.5; }
.history-order dt, .history-order dd { margin: 0; }
.history-order__totals dd { white-space: nowrap; font-variant-numeric: tabular-nums; text-align: right; }
.history-order__totals .history-order__total { font-size: 1.8rem; font-weight: 500; border-top: 1px solid var(--br-dark); margin-top: 1rem; padding: 1.4rem 0 1.8rem; }
.history-order__savings { font-size: 1.2rem; color: #49624b; margin: -.8rem 1.6rem 1.8rem; line-height: 1.5; }
.history-order__delivery { margin: 0; }
.history-order__delivery > div { display: grid; grid-template-columns: 7.6rem minmax(0, 1fr); gap: 1rem; padding: 1.5rem 1.4rem; font-size: 1.3rem; line-height: 1.6; border-bottom: 1px solid var(--br-dark); &:last-child { border-bottom: 0; } }
.history-order__delivery dt { color: var(--fg-gray-2); }
.history-order__delivery dd { overflow-wrap: anywhere; }
.history-order__link, .history-order__view, .history-order__checkout { color: inherit; text-decoration: underline; text-underline-offset: .3rem; }
.history-order__tracking-label { display: block; font-size: 1.2rem; color: var(--fg-gray-2); }
.history-order__view { display: inline-block; margin-top: 1.3rem; font-size: 1.2rem; line-height: 1.5; }
.history-order__actions { margin-top: 1.8rem; }
.history-order__repeat { width: 100%; min-height: 4.6rem; border: 1px solid var(--fg-regular); border-radius: .5rem; padding: 1.3rem; background: var(--fg-regular); color: var(--fg-white); font-size: 1.2rem; text-transform: uppercase; letter-spacing: .04em; line-height: 1.5; cursor: pointer; &:hover:not(:disabled) { background: var(--fg-gray-2); } }
.history-order button:disabled { cursor: default; opacity: .5; }
.history-order__hint, .history-order__message, .history-order__missing { margin: 1rem 0 0; font-size: 1.3rem; line-height: 1.6; color: var(--fg-gray-2); }
.history-order__missing { padding: 0 1.6rem; }
.history-order__message--error { color: var(--fg-red); }
.history-order__checkout { display: inline-block; margin-top: 1rem; font-size: 1.3rem; }
.history-order__confirmation { border: 1px solid var(--br-dark); border-radius: .8rem; background: var(--fg-white); padding: 1.4rem; }
.history-order__confirmation p { margin: 0 0 1.2rem; font-size: 1.3rem; line-height: 1.6; }
.history-order__confirmation-buttons { display: flex; flex-wrap: wrap; gap: .8rem; }
.history-order__confirmation-buttons button { min-height: 4.4rem; padding: 1rem 1.2rem; border: 1px solid var(--br-dark); border-radius: .5rem; font-size: 1.2rem; cursor: pointer; &:first-child { background: var(--fg-regular); color: var(--fg-white); } }
@media (max-width: 1100px) and (min-width: 992px), (max-width: 650px) {
  .history-order__body { grid-template-columns: minmax(0, 1fr); gap: 1.2rem; }
}
@media (max-width: $mobile) {
  .history-order { padding: 2rem 0; }
  .history-order__heading { gap: .8rem; align-items: flex-start; }
  .history-order__number { font-size: 1.6rem; }
  .history-order__date { font-size: 1.2rem; }
  .history-order__heading-end { gap: .6rem; flex-direction: column; align-items: flex-end; }
  .history-order__products { padding: 1.8rem 1.4rem 1rem; }
  .history-order__product { grid-template-columns: 5.6rem minmax(0, 1fr) auto; gap: 1rem; }
  .history-order__image { width: 5.6rem; height: 5.6rem; }
  .history-order__delivery > div { padding: 1.3rem 1.4rem; }
}
@media (max-width: 360px) {
  .history-order__product { grid-template-columns: 4.8rem minmax(0, 1fr); gap: .9rem; }
  .history-order__image { width: 4.8rem; height: 4.8rem; grid-row: span 2; }
  .history-order__price { grid-column: 2; flex-direction: row; flex-wrap: wrap; text-align: left; gap: .6rem; }
}
</style>
