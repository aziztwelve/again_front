<template>
  <!--  {{pending}}-->
  <div class="success">
    <div class="success__container container">
      <div class="success__content">
        <div class="success__block">
          <div class="success__block-title _hide_mobile fz-h2">Заказ сформирован!</div>
          <div class="success__list">
            <div class="success__item">Ваш заказ №{{ data.order.id }} принят</div>
            <div class="success__item">Дата оформления: {{ getDateFormat().formattedDate(data.order.created_at) }}</div>
            <div class="success__item">Сумма: {{ getFormatPrice().formattedPrice(data.order.total_amount) }} ₽</div>
            <div class="success__item">Статус: <span class="success__status">{{ getStatus(data.order.status).label }}</span>
            </div>
          </div>
          <div class="success__buttons">
            <a href="#" class="btn _border">Перейти к оплате</a>
            <!--            <a href="#" class="btn _border _gray">Повторить заказ</a>-->
          </div>
          <div class="success__messengers">
            <div class="success__messengers-title">Получать уведомления<br> в мессенджерах</div>
            <div class="success__messengers-list">
              <!-- Telegram -->
              <a
                  href="https://t.me/again8help_bot"
                  class=""
                  target="_blank"
                  rel="noopener"
                  aria-label="Telegram"
              >
                <img src="/icons/chat/telegram.svg" alt="Telegram" width="30" height="29" />
              </a>

              <!-- VK -->
              <a
                  href="https://vk.me/public228837691?ref=590197ba2f669a6f7ea29870%3Aru"
                  class=""
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
            <div class="success__item">Способ оплаты: ____________________</div>
            <div class="success__item">Способ доставки: ____________________</div>
            <div class="success__item">Адрес доставки: ____________________</div>
            <div class="success__item">Получатель: {{ data.order.client.full_name }}</div>
            <div class="success__item">Номер телефона: {{ data.order.client.phone }}</div>
<!--            <div class="success__item">Почта: {{ data.order.client.email }}</div>-->
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">

definePageMeta({
  title: 'Заказ сформирован!',
});


const route = useRoute();

const {data} = await useApi(`/orders/${route.query.id}`)

</script>


<style scoped lang="scss">

</style>