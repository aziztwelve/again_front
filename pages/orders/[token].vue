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
              </div>
            </div>

            <div v-if="hasMessengerSubscribe" class="order-view__row">
              <div class="order-view__label">Получать уведомления в мессенджерах</div>
              <div class="order-view__value">
                <div class="order-view__messengers">
                  <a
                      :href="`tg://resolve?domain=again8help_bot&start=${order.view_token}`"
                      target="_blank"
                      class="order-view__messenger"
                  >
                    <img src="/icons/chat/telegram.svg" alt="Telegram" width="30" height="29" />
                    <span>Telegram</span>
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
                <a :href="mapUrl(order.delivery_address)" target="_blank" rel="noopener noreferrer">
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
              <div class="order-view__value">{{ order.tracking_number }}</div>
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
                <td data-title="Наименование">{{ item.name }}</td>
                <td data-title="Кол-во">{{ item.quantity }}</td>
                <td data-title="Стоимость">{{ formatPrice(item.total) }} ₽</td>
              </tr>

              <tr v-if="order.discount_amount > 0">
                <td colspan="2">Скидка</td>
                <td>−{{ formatPrice(order.discount_amount) }} ₽</td>
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
definePageMeta({
  title: 'Заказ',
});

interface PublicOrderItem {
  id: number;
  name: string;
  sku: string | null;
  quantity: number;
  unit_price: number;
  total: number;
  image: string | null;
}

interface PublicOrder {
  view_token: string;
  order_number: string;
  created_at: string;
  status: { value: string; label: string | null };
  payment_status: { value: string; label: string | null };
  payment_method: string | null;
  total_amount: number;
  discount_amount: number;
  delivery_cost: number;
  delivery_method: string | null;
  delivery_target: string | null;
  delivery_address: string | null;
  recipient: { name: string | null; phone: string | null; email: string | null };
  items: PublicOrderItem[];
  tracking_number: string | null;
}

const route = useRoute();
const token = route.params.token as string;

const { data, pending } = await useApi<{ success: boolean; order: PublicOrder }>(
    `/public/orders/${token}`,
);

const order = computed<PublicOrder | null>(() => data.value?.order ?? null);

useHead(() => ({
  title: order.value ? `Заказ № ${order.value.order_number}` : 'Заказ',
}));

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  // Актуальные коды (после нормализации)
  card_ru: 'Оплата картой РФ',
  sberpay: 'SberPay, рассрочка, иностранная карта',
  yandex_pay_split: 'Яндекс Пэй и Сплит',
  cash_on_delivery: 'Наличными или картой при получении',
  pickup_payment: 'Оплата в точке самовывоза',
  podeli: 'Подели',
  robokassa_mokka: 'Robokassa X Мокка',
  robokassa_yandex_split: 'Robokassa X Яндекс Сплит',
  // Легаси-коды
  card: 'Оплата картой РФ',
  yookassa: 'Оплата картой РФ',
  online: 'Оплата картой РФ',
  yandex_pay: 'Яндекс Пэй и Сплит',
  split: 'Яндекс Пэй и Сплит',
  cash: 'Наличными или картой при получении',
  cod: 'Наличными или картой при получении',
  sbp: 'SberPay, рассрочка, иностранная карта',
  bank_transfer: 'Оплата картой РФ',
};

const orderStatusLabel = computed(() => order.value?.status?.label || null);
const paymentStatusLabel = computed(() => order.value?.payment_status?.label || null);

const paymentMethodLabel = computed(() => {
  const m = order.value?.payment_method;
  if (!m) return '';
  return PAYMENT_METHOD_LABELS[m] || m;
});

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

const hasMessengerSubscribe = computed(() => !!order.value?.view_token);

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatDateTime = (value: string) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const mapUrl = (addr: string) =>
    `https://yandex.ru/maps/?text=${encodeURIComponent(addr)}`;
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
