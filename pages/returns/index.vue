<template>
  <Breadcrumbs />

  <div class="returns page-padding">
    <div class="returns__container container">
      <div class="returns-block__header block__header _left">
        <h1 class="block__header-title fz-h2--mobile">Обмен и возврат</h1>
      </div>
      <div class="returns__alert returns-alert">
        <div class="returns-alert__item">
          <div class="returns-alert__item-icon">
            <img src="/img/icons.again/icon-calendar.svg" alt="">
          </div>
          <div class="returns-alert__item-content">
            <div class="returns-alert__item-title"><strong><span>Обменяем</span> не подошедшие по&nbsp;размеру трусики в течение 7&nbsp;дней</strong> с момента приобретения</div>
            <div class="returns-alert__item-text">
              При условии, что белье не использовалось, в том числе не стиралось
            </div>
          </div>
        </div>

        <div class="returns-alert__item">
          <div class="returns-alert__item-icon">
            <img src="/img/icons.again/icon-barcode.svg" alt="">
          </div>
          <div class="returns-alert__item-content">
            <div class="returns-alert__item-title">При обнаружении дефекта белья или заводского брака белье <strong>можно <span>обменять или вернуть</span></strong></div>
            <div class="returns-alert__item-text">
              Возврат осуществляется в течение 30 дней с момента приобретения
            </div>
          </div>
        </div>

      </div>
      <div class="returns__text">
        <div class="returns__text-col">
          <h3>Процедура возврата</h3>
          <p>Все возвраты осуществляются по письменной заявке на адрес электронной почты info@again8.ru</p>
          <p><strong>В заявке необходимо указать:</strong></p>
          <ul>
            <li>Номер заказа;</li>
            <li>Возвращаемые позиции: название, цвет, размер;</li>
            <li>Причину возврата.</li>
            <li>Реквизиты для возврата (номер карты, номер должен совпадать с картой с которой осуществлялась покупка)</li>
          </ul>
          <p>После рассмотрения заявки (в срок от 2 до 5 рабочих дней) на Вашу электронную почту будут высланы инструкции по отправке белья на наш адрес.</p>
          <a href="https://wa.me/79991178888" class="btn _left" target="_blank">Написать в WhatsApp</a>
        </div>
        <div class="returns__text-col">
          <p><img src="/img/returns.again/main.jpg" alt=""></p>
          <p>В случае обнаружения брака или при ошибке в заказе повторную доставку и все расходы на доставку белья на склад оплачивает AGAIN. В случае обмена из-за неподошедшего размера расходы на доставку берет на себя покупатель.</p>
          <p>Возврат денежных средств производится в течение 15 банковских дней после получения возвращаемых товаров на склад интернет-магазина, после экспертизы*, подтверждающей соблюдение условий возврата.</p>
          <p>*Если экспертиза установит факт нарушения условий возврата, компания пересылает возвращенные товары покупателю Почтой России наложенным платежом (пересылка за счет покупателя).</p>
          <a href="https://wa.me/79991178888" class="btn _left _mobile" target="_blank">Написать в WhatsApp</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta( {
  title: 'Обмен и возврат',
} )
</script>

<style scoped lang="scss">
.returns-block__header {
  margin-bottom: 3.5rem;

  @media (max-width: $mobile) {
    justify-content: flex-start;
    margin-bottom: 2.5rem;
  }
}

.returns__alert {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.9rem;

  @media (max-width: $tablet) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.returns__text {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.9rem;
  line-height: 150%;
  margin-top: 4rem;

  @media (max-width: $mobile) {
    margin-top: 3.5rem;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  & h3 {
    font-family: var(--ff-regular);
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;

    @media (max-width: $mobile) {
      font-size: 1.8rem;
      margin-bottom: 1.3rem;
    }
  }

  & * {
    font-size: var(--fz-1-5);

    @media (max-width: $mobile) {
      font-size: 1.4rem;
    }
  }

  & p {
    margin-bottom: 2rem;
  }

  & strong {
    font-weight: 700;
  }

  & ul,
  & ol {
    margin-top: -1rem;
    padding-left: 2rem;
    margin-bottom: 2rem;

    & li {
      list-style: disc;
    }
  }

  & img {
    width: 100%;
    border-radius: var(--br-regular);
  }

  &._mobile {
    display: none;
  }

  @media (max-width: $mobile) {
    & .btn {
      display: none;

      &._mobile {
        display: flex;
        text-align: center;
      }
    }
  }
}

.returns__text-col:first-child {
  max-width: 49.6rem;
}

</style>