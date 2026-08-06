<template>
  <div class="order-view">
    <div class="container">
      <template v-if="pending">
        <div class="order-view__loader">Загрузка…</div>
      </template>

      <template v-else-if="!order">
        <div class="order-view__empty">
          <h1>Заказ не найден</h1>
          <p>Ссылка некорректна или заказ был удалён.</p>
        </div>
      </template>

      <template v-else>
        <h1 class="order-view__title">Заказ № {{ order.order_number }}</h1>

        <section class="order-view__section">
          <div class="order-view__h2">Информация о заказе</div>

          <div class="order-view__rows">
            <div class="order-view__row">
              <div class="order-view__label">Дата оформления</div>
              <div class="order-view__value">{{ formatDateTime(order.created_at) }}</div>
            </div>

            <div class="order-view__row">
              <div class="order-view__label">Сумма и статус</div>
              <div class="order-view__value">
                <span class="order-view__price">{{ formatPrice(order.total_amount) }} ₽</span>
                <span v-if="orderStatusLabel" class="order-view__state">{{ orderStatusLabel }}</span>
                <span
                    v-if="paymentStatusLabel"
                    class="order-view__state order-view__state--minor"
                >{{ paymentStatusLabel }}</span>
                <button
                    v-if="canBePaid && isCloudPaymentsOrder"
                    type="button"
                    class="order-view__pay-button"
                    :disabled="isPaymentStarting"
                    @click="startCloudPayments"
                >
                  {{ isPaymentStarting ? 'Открываем оплату…' : 'Оплатить картой' }}
                </button>
                <button
                    type="button"
                    class="order-view__repeat-button"
                    :disabled="isReordering"
                    @click="repeatOrder"
                >
                  {{ isReordering ? 'Добавляем…' : 'Повторить заказ' }}
                </button>
              </div>
            </div>

            <div v-if="hasMessengerSubscribe" class="order-view__row">
              <div class="order-view__label">Получать уведомления в мессенджерах</div>
              <div class="order-view__value">
                <div class="order-view__messengers">
                  <a
                      v-if="messengerLinks.telegram"
                      :href="messengerLinks.telegram"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="order-view__messenger"
                  >
                    <img src="/icons/chat/telegram.svg" alt="Telegram" width="30" height="29" />
                    <span>Telegram</span>
                  </a>
                  <a
                      v-if="messengerLinks.max"
                      :href="messengerLinks.max"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="order-view__messenger"
                  >
                    <img src="/icons/chat/max.svg" alt="Max" width="30" height="29" />
                    <span>Max</span>
                  </a>
                  <a
                      v-if="messengerLinks.vk"
                      :href="messengerLinks.vk"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="order-view__messenger"
                  >
                    <img src="/icons/chat/vk.svg" alt="ВКонтакте" width="30" height="29" />
                    <span>ВКонтакте</span>
                  </a>
                </div>
              </div>
            </div>

            <div v-if="order.payment_method" class="order-view__row">
              <div class="order-view__label">Способ оплаты</div>
              <div class="order-view__value">{{ paymentMethodLabel }}</div>
            </div>

            <div v-if="deliveryMethodLine" class="order-view__row">
              <div class="order-view__label">Способ доставки</div>
              <div class="order-view__value">{{ deliveryMethodLine }}</div>
            </div>

            <div v-if="order.delivery_address" class="order-view__row">
              <div class="order-view__label">Адрес доставки</div>
              <div class="order-view__value">
                <a
                    :href="mapUrl(order.delivery_address)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="order-view__address-link"
                >
                  {{ order.delivery_address }}
                </a>
              </div>
            </div>

            <div v-if="recipientLine" class="order-view__row">
              <div class="order-view__label">Получатель</div>
              <div class="order-view__value">{{ recipientLine }}</div>
            </div>

            <div v-if="order.recipient?.email" class="order-view__row">
              <div class="order-view__label">Email</div>
              <div class="order-view__value">{{ order.recipient.email }}</div>
            </div>

            <div v-if="order.tracking_number" class="order-view__row">
              <div class="order-view__label">Трек-номер</div>
              <div class="order-view__value">
                <a v-if="order.delivery_tracking?.tracking_url" :href="order.delivery_tracking.tracking_url" target="_blank" rel="noopener noreferrer" class="order-view__address-link">
                  {{ order.tracking_number }} · Отследить доставку
                </a>
                <template v-else>{{ order.tracking_number }}</template>
              </div>
            </div>
            <div v-if="order.delivery_tracking?.status" class="order-view__row">
              <div class="order-view__label">Статус доставки</div>
              <div class="order-view__value">{{ yandexStatusLabel(order.delivery_tracking.status) }}</div>
            </div>
          </div>
        </section>

        <section class="order-view__section">
          <div class="order-view__h2">Состав заказа</div>

          <table class="order-view__table">
            <thead>
              <tr>
                <th>Наименование</th>
                <th>Кол-во</th>
                <th>Стоимость</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.items" :key="item.id">
                <td data-title="Наименование">
                  {{ item.name }}
                  <span v-if="item.is_gift" class="order-view__gift-badge">🎁 Подарок</span>
                </td>
                <td data-title="Кол-во">{{ item.quantity }}</td>
                <td data-title="Стоимость">
                  <template v-if="item.is_gift">
                    <span class="order-view__gift-free">Бесплатно</span>
                  </template>
                  <template v-else-if="item.discount > 0">
                    <span class="order-view__price-original">{{ formatPrice((item.price + item.discount) * item.quantity) }} ₽</span>
                    <span class="order-view__price-discounted">{{ formatPrice(item.price * item.quantity) }} ₽</span>
                  </template>
                  <template v-else>
                    {{ formatPrice(item.price * item.quantity) }} ₽
                  </template>
                </td>
              </tr>

              <tr v-if="order.items_discount > 0">
                <td colspan="2">Скидка</td>
                <td>−{{ formatPrice(order.items_discount) }} ₽</td>
              </tr>

              <tr v-if="order.promo_discount > 0">
                <td colspan="2">
                  Промокод<template v-if="order.promo_code?.code"> {{ order.promo_code.code }}</template>
                </td>
                <td>−{{ formatPrice(order.promo_discount) }} ₽</td>
              </tr>

              <tr v-if="order.delivery_cost > 0">
                <td colspan="2">Доставка</td>
                <td>{{ formatPrice(order.delivery_cost) }} ₽</td>
              </tr>

              <tr class="order-view__total-row">
                <td colspan="2">Итого:</td>
                <td>{{ formatPrice(order.total_amount) }} ₽</td>
              </tr>
            </tbody>
          </table>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PublicOrder, PublicOrderResponse } from '~/types/order';
import { getPaymentMethodLabel } from '~/constants/payment';
import { getExternalIdClient } from '~/features/LiveChat/composables/useChatFunctions';
import { useGetMessengerLinks } from '~/features/LiveChat/composables/useChatApi';
import type { MessengerLinks } from '~/features/LiveChat/composables/useChatApi';

definePageMeta({
  title: 'Заказ',
});

const route = useRoute();
const token = route.params.token as string;

const { data, pending } = await useApi<PublicOrderResponse>(
    `/public/orders/${token}`,
);

const order = computed<PublicOrder | null>(() => data.value?.order ?? null);
const cartStore = useCartStore();
const { show: showToast } = useToast();
const isReordering = ref(false);
const isPaymentStarting = ref(false);
const messengerLinks = ref<MessengerLinks['links']>({});

// Обновляем токен текущей сессии сразу после оформления заказа. Поэтому
// deeplink из виджета на этой странице несёт именно этот order_id, даже если
// пользователь открывает меню мессенджеров позднее.
onMounted(async () => {
  try {
    const externalId = await getExternalIdClient();
    const response = await useGetMessengerLinks(externalId, token);
    messengerLinks.value = response.links ?? {};
  } catch {
    // Виджет повторит запрос при открытии; страница заказа остаётся доступной.
  }
});

useHead(() => ({
  title: order.value ? `Заказ № ${order.value.order_number}` : 'Заказ',
}));

const orderStatusLabel = computed(() => order.value?.status?.label || null);
const paymentStatusLabel = computed(() => order.value?.payment_status?.label || null);
const canBePaid = computed(() => ['pending', 'failed'].includes(order.value?.payment_status?.value ?? ''));
const isCloudPaymentsOrder = computed(() => order.value?.cloudpayments_available === true);

const paymentMethodLabel = computed(() => getPaymentMethodLabel(order.value?.payment_method));

const deliveryMethodLine = computed(() => {
  const m = order.value?.delivery_method;
  const t = order.value?.delivery_target;
  if (m && t && m !== t) return `${m} (${t})`;
  return m || t || '';
});

const recipientLine = computed(() => {
  const r = order.value?.recipient;
  if (!r) return '';
  return [r.name, r.phone].filter(Boolean).join(' ');
});

const hasMessengerSubscribe = computed(() => Object.keys(messengerLinks.value).length > 0);

const formatPrice = (value: number) =>
    new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

const formatDateTime = (value: string) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const yandexStatusLabel = (status: string) => ({
  created: 'Заявка создана',
  courier_assigned: 'Курьер назначен',
  picked_up: 'Заказ передан в доставку',
  delivered: 'Заказ доставлен',
  returning: 'Оформляется возврат',
  cancelled: 'Доставка отменена',
  failed: 'Не удалось оформить доставку',
}[status] ?? status);

const mapUrl = (addr: string) =>
    `https://yandex.ru/maps/?text=${encodeURIComponent(addr)}`;

type CloudPaymentsWidget = {
  start: (params: Record<string, unknown>) => Promise<unknown>;
  oncomplete?: (result: { status?: string }) => void;
};

const loadCloudPaymentsWidget = (): Promise<void> => new Promise((resolve, reject) => {
  if ((window as any).cp?.CloudPayments) {
    resolve();
    return;
  }

  const existing = document.querySelector<HTMLScriptElement>('script[data-cloudpayments-widget]');
  if (existing) {
    existing.addEventListener('load', () => resolve(), { once: true });
    existing.addEventListener('error', () => reject(new Error('Не удалось загрузить форму оплаты.')), { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://widget.cloudpayments.ru/bundles/cloudpayments.js';
  script.async = true;
  script.dataset.cloudpaymentsWidget = 'true';
  script.onload = () => resolve();
  script.onerror = () => reject(new Error('Не удалось загрузить форму оплаты.'));
  document.head.appendChild(script);
});

const startCloudPayments = async () => {
  if (!order.value || isPaymentStarting.value) return;
  isPaymentStarting.value = true;

  try {
    const { data: intent, error } = await useApi<{ success: boolean; message?: string; payment?: Record<string, unknown> }>(
        `/public/orders/${token}/cloudpayments/intent`,
        { method: 'POST', body: {} },
    );
    if (error.value || !intent.value?.success || !intent.value.payment) {
      throw new Error(intent.value?.message || 'Не удалось подготовить оплату.');
    }

    await loadCloudPaymentsWidget();
    const widget = new (window as any).cp.CloudPayments() as CloudPaymentsWidget;
    // useFetch возвращает реактивный Proxy. Виджет сохраняет параметры в
    // history.pushState(), который умеет клонировать только обычные данные.
    // Превращаем ответ API в plain JSON, иначе браузер выбрасывает DataCloneError.
    const paymentParams = JSON.parse(JSON.stringify(intent.value.payment)) as Record<string, unknown>;
    widget.oncomplete = async (result) => {
      if (result?.status === 'success') {
        showToast('Платёж принят. Обновляем статус заказа…');
        await refreshNuxtData();
        await navigateTo(`/orders/${token}`, { replace: true });
      }
    };
    await widget.start(paymentParams);
  } catch (error: any) {
    showToast(error?.message || 'Не удалось открыть форму оплаты. Попробуйте ещё раз.');
  } finally {
    isPaymentStarting.value = false;
  }
};

const repeatOrder = async () => {
  const items = order.value?.items.filter((item) => !item.is_gift && item.product_id) ?? [];

  if (!items.length) {
    showToast('В этом заказе нет товаров, которые можно добавить в корзину.');
    return;
  }

  isReordering.value = true;

  try {
    await cartStore.setEmptyCart();

    for (const item of items) {
      const price = Number(item.price || 0);
      const oldPrice = price + Number(item.discount || 0);
      const variant = item.product_variant_id
          ? { id: item.product_variant_id, name: item.variant_name, price, old_price: oldPrice }
          : null;
      const color = item.color_id ? { id: item.color_id, name: item.color_name } : null;

      await cartStore.addToCart({
        id: item.product_id,
        name: item.product_name || item.name,
        price,
        old_price: oldPrice,
      }, item.quantity, variant, color);
    }

    await navigateTo('/checkout');
  } catch {
    showToast('Не удалось повторить заказ. Попробуйте ещё раз.');
  } finally {
    isReordering.value = false;
  }
};
</script>

<style scoped lang="scss">
.order-view {
  padding: 4rem 0 6rem;
  color: #1a1a1a;
  font-family: 'Mulish', sans-serif;
}

.container {
  max-width: 96rem;
  margin: 0 auto;
  padding: 0 2rem;
}

.order-view__loader,
.order-view__empty {
  text-align: center;
  padding: 6rem 0;
  font-size: 1.6rem;
}

.order-view__empty h1 {
  font-size: 2.4rem;
  margin: 0 0 1rem;
}

.order-view__title {
  font-size: 2.8rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 3rem;
}

.order-view__section {
  padding: 2rem 0;
}

.order-view__h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.order-view__rows {
  display: grid;
  gap: 1.2rem;
}

.order-view__row {
  display: grid;
  grid-template-columns: 26rem 1fr;
  gap: 2rem;
  padding: 0.6rem 0;
  font-size: 1.4rem;
  line-height: 1.4;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }
}

.order-view__label {
  color: #7a7a7a;
}

.order-view__value {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.order-view__price {
  font-weight: 600;
}

.order-view__pay-button,
.order-view__repeat-button {
  border: 0;
  font: inherit;
  cursor: pointer;
}

.order-view__pay-button {
  padding: 0.8rem 1.4rem;
  border-radius: 0.4rem;
  background: #f1e8d5;
  color: #1a1a1a;
  font-weight: 600;
}

.order-view__repeat-button {
  padding: 0;
  background: transparent;
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.2em;

  &:disabled {
    cursor: wait;
    opacity: 0.55;
  }
}

.order-view__address-link {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.order-view__price-original {
  text-decoration: line-through;
  color: #aaa;
  font-size: 0.9em;
  margin-right: 0.4rem;
}

.order-view__price-discounted {
  font-weight: 600;
  color: #c0392b;
}

.order-view__gift-badge {
  display: inline-block;
  margin-left: 0.6rem;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: #fde8e8;
  color: #c0392b;
  font-size: 1.1rem;
  font-weight: 600;
  vertical-align: middle;
}

.order-view__gift-free {
  font-weight: 600;
  color: #c0392b;
}

.order-view__state {
  padding: 0.2rem 0.8rem;
  border-radius: 999px;
  background: #f2f2f2;
  font-size: 1.2rem;

  &--minor {
    background: #fff5d4;
  }
}

.order-view__messengers {
  display: flex;
  gap: 1.4rem;
  align-items: center;
}

.order-view__messenger {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: inherit;

  img {
    width: 24px;
    height: 24px;
  }
}

.order-view__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.4rem;

  thead th {
    text-align: left;
    padding: 1rem 1.2rem;
    border-bottom: 1px solid #ddd;
    font-weight: 500;
    color: #7a7a7a;
  }

  tbody td {
    padding: 1.2rem;
    border-bottom: 1px solid #eee;
  }

  tbody tr:nth-child(odd) td {
    background: #fafafa;
  }

  td:nth-child(2),
  td:nth-child(3),
  th:nth-child(2),
  th:nth-child(3) {
    text-align: right;
    white-space: nowrap;
  }

  .order-view__total-row td {
    font-weight: 700;
    font-size: 1.6rem;
    background: #fff;
  }

  @media (max-width: 767px) {
    thead {
      display: none;
    }

    tbody tr {
      display: grid;
      grid-template-columns: 1fr;
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
      background: transparent !important;
    }

    tbody td {
      border: none;
      padding: 0.4rem 0;
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      background: transparent !important;

      &::before {
        content: attr(data-title);
        color: #7a7a7a;
      }

      &[colspan]::before {
        content: '';
      }
    }
  }
}
</style>
