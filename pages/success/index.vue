<template>
  <ClientOnly>
    <div class="success">
      <div class="success__container container">
        <template v-if="pending">
          <div class="success__loader">Загрузка…</div>
        </template>

        <template v-else-if="!order">
          <div class="success__empty">
            <h1>Заказ не найден</h1>
            <p>
              Возможно, ссылка устарела. Если вы оформляли заказ как гость —
              откройте письмо со ссылкой на страницу заказа или вернитесь в
              <NuxtLink to="/cart">корзину</NuxtLink>.
            </p>
          </div>
        </template>

        <template v-else>
          <div class="success__content">
            <div class="success__block">
              <div class="success__block-title _hide_mobile fz-h2">Заказ сформирован!</div>
              <div class="success__list">
                <div class="success__item">Ваш заказ №{{ order.id }} принят</div>
                <div class="success__item">Дата оформления: {{ getDateFormat().formattedDate(order.created_at) }}</div>
                <div class="success__item">Сумма: {{ getFormatPrice().formattedPrice(order.total_amount) }} ₽</div>
                <div class="success__item">
                  Статус: <span class="success__status">{{ getStatus(order.status)?.label || order.status }}</span>
                </div>
              </div>
              <div class="success__buttons">
                <NuxtLink v-if="viewToken" :to="`/orders/${viewToken}`" class="btn _border">
                  Подробности заказа
                </NuxtLink>
              </div>
              <div class="success__messengers">
                <div class="success__messengers-title">
                  Получать уведомления<br> в мессенджерах
                </div>
                <div class="success__messengers-list">
                  <a
                      :href="telegramUrl"
                      target="_blank"
                      rel="noopener"
                      aria-label="Telegram"
                  >
                    <img src="/icons/chat/telegram.svg" alt="Telegram" width="30" height="29" />
                  </a>

                  <a
                      href="https://vk.me/public228837691?ref=590197ba2f669a6f7ea29870%3Aru"
                      target="_blank"
                      rel="noopener"
                      aria-label="VK"
                  >
                    <img src="/icons/chat/vk.svg" alt="VK" width="30" height="29" />
                  </a>
                </div>
              </div>
            </div>
            <div class="success__block">
              <div class="success__block-title fz-h2">Оплата и доставка</div>
              <div class="success__list">
                <div class="success__item">Получатель: {{ recipientName }}</div>
                <div class="success__item">Номер телефона: {{ recipientPhone }}</div>
                <div v-if="recipientEmail" class="success__item">Почта: {{ recipientEmail }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
// Эта страница оставлена для обратной совместимости со старыми сборками
// витрины, которые умели редиректить только на `/success?id=...` после
// успешного оформления заказа. В новой версии checkout по-умолчанию ведёт
// на публичную страницу `/orders/{view_token}` — она работает и для гостя,
// и для авторизованного клиента. Сюда же мы попадаем только если по какой-то
// причине бэк не вернул view_token.
//
// Поведение:
//   • если в query есть `token` — сразу редиректим на /orders/{token};
//   • если есть только `id` и пользователь авторизован — пытаемся подтянуть
//     заказ через `/api/orders/{id}` и показать сводку;
//   • если ничего из этого не подходит — отрисовываем «заказ не найден» с
//     ссылкой обратно в корзину.

definePageMeta({
  title: 'Заказ сформирован!',
});

const route = useRoute();
const authStore = useAuthStore();

// Сценарий A: пришли по новой ссылке `/success?token=...` — просто перебрасываем
// на публичную страницу заказа.
const tokenParam = (route.query.token as string) || '';
if (tokenParam) {
  await navigateTo(`/orders/${tokenParam}`, { replace: true });
}

const idParam = (route.query.id as string) || '';

// Сценарий B: гостю некуда грузить заказ по числовому id, ведём в корзину.
if (!tokenParam && !idParam) {
  await navigateTo('/cart', { replace: true });
}

interface ClientSuccessOrder {
  id: number;
  status: string;
  total_amount: number | string;
  created_at: string;
  view_token?: string | null;
  client?: {
    full_name?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    phone?: string | null;
    email?: string | null;
  } | null;
  email?: string | null;
  address?: {
    recipient_first_name?: string | null;
    recipient_last_name?: string | null;
    recipient_phone?: string | null;
  } | null;
}

// Только для авторизованного клиента: грузим заказ через приватный endpoint.
// Для гостя этот код не срабатывает — мы выше уже редиректнули.
const order = ref<ClientSuccessOrder | null>(null);
const pending = ref(true);

const loadAuthedOrder = async () => {
  if (!idParam || !authStore.token) {
    pending.value = false;
    return;
  }
  const { data } = await useApi<{ order: ClientSuccessOrder }>(`/orders/${idParam}`);
  order.value = data.value?.order ?? null;
  pending.value = false;
};

if (idParam) {
  await loadAuthedOrder();
}

const viewToken = computed(() => order.value?.view_token || tokenParam || null);
const telegramUrl = computed(() =>
    viewToken.value
        ? `tg://resolve?domain=again8help_bot&start=${viewToken.value}`
        : 'https://t.me/again8help_bot',
);

const recipientName = computed(() => {
  const o = order.value;
  if (!o) return '';
  const addr = o.address;
  const addrName = [addr?.recipient_first_name, addr?.recipient_last_name]
      .filter(Boolean)
      .join(' ');
  if (addrName) return addrName;
  if (o.client?.full_name) return o.client.full_name;
  return [o.client?.first_name, o.client?.last_name].filter(Boolean).join(' ');
});

const recipientPhone = computed(() => {
  const o = order.value;
  return o?.address?.recipient_phone || o?.client?.phone || '';
});

const recipientEmail = computed(() => {
  const o = order.value;
  return o?.email || o?.client?.email || '';
});
</script>

<style scoped lang="scss">
.success__loader,
.success__empty {
  padding: 6rem 0;
  text-align: center;
  font-size: 1.6rem;
}

.success__empty h1 {
  font-size: 2.4rem;
  margin: 0 0 1rem;
}
</style>
