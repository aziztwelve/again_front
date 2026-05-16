# Задача: Акции (Promotions) — Nuxt Shop

**Статус:** Реализовано  
**Дата:** 2026-04-28

## Описание

На фронте (корзина + чекаут) реализована логика:
1. Проверка применимых акций при изменении корзины
2. Отображение блока акции с выбором подарка или промокода
3. Блокировка промокода при активной акции с `allow_promo_codes = false`
4. Передача данных акции при оформлении заказа

---

## Файлы

### Store
| Файл | Описание |
|------|---------|
| `stores/promotion.js` | `usePromotionStore` — состояние и действия для акций |

**Состояние (`usePromotionStore`):**

| Поле | Описание |
|------|---------|
| `promotions` | Список применимых акций |
| `activePromotion` | Выбранная акция (объект) |
| `selectedGiftProductId` | ID выбранного подарка |
| `useDiscountInstead` | Пользователь выбрал промокод/скидку вместо подарка |

**Методы:**

| Метод | Описание |
|-------|---------|
| `checkApplicable(items, total)` | POST `/api/public/promotions/check-applicable` — загрузить применимые акции |
| `selectGift(promotionId, giftProductId)` | Выбрать конкретный подарок из акции |
| `selectDiscount(promotionId)` | Выбрать промокод/скидку вместо подарка |
| `getDataForOrder()` | Получить `{ promotion_id, gift_product_id, use_discount_instead }` для передачи в заказ |
| `reset()` | Сбросить состояние (при очистке корзины, после оформления) |

### Компоненты

| Файл | Описание |
|------|---------|
| `components/Cart/Promotion.vue` | Блок акции в корзине: выбор подарка или промокода/скидки |
| `components/Cart/Promocode.vue` | Блок промокода с логикой блокировки при активной акции |

### Страницы

| Файл | Описание |
|------|---------|
| `pages/cart.vue` | Подключает `usePromotionStore`, вызывает `checkApplicable` при монтировании и при изменении корзины |
| `pages/checkout.vue` | Берёт данные через `getDataForOrder()` и отправляет вместе с заказом |

---

## Логика в корзине

### Когда проверяются акции

```js
// pages/cart.vue
onMounted(() => {
  promotionStore.checkApplicable(cartItems, cartTotal);
});

// При изменении корзины (watch или computed):
watch(cartItems, () => {
  promotionStore.checkApplicable(cartItems, cartTotal);
});
```

### Блок Promotion.vue

Отображается если `promotionStore.promotions.length > 0`.

**Сценарии:**

1. `allow_promo_codes = false` — только подарок:
   - Показывается список gift_products
   - Пользователь выбирает один → `selectGift(promotionId, giftProductId)`

2. `allow_promo_codes = true` — выбор:
   - Кнопка "Выбрать подарок" → показывает список подарков
   - Кнопка "Использовать промокод/скидку" → `selectDiscount(promotionId)`

### Блок Promocode.vue

Если промокод заблокирован (`promotionStore.activePromotion && !promotionStore.useDiscountInstead && !promotionStore.activePromotion.allow_promo_codes`):
- Поле промокода задизейблено
- Показывается сообщение "Промокод недоступен при активной акции"

---

## Данные для оформления заказа

```js
// pages/checkout.vue
const orderData = {
  // ... другие поля ...
  ...promotionStore.getDataForOrder()
};
// getDataForOrder() возвращает:
// { promotion_id: 1, gift_product_id: 5, use_discount_instead: false }
// или:
// { promotion_id: 1, use_discount_instead: true }
// или:
// {} — если акция не выбрана
```

---

## Компонент Checkout/Total.vue

В `pages/checkout.vue` используется как `<CheckoutTotal :with-button="withButton" />`.

- Prop `withButton: boolean` (default `false`) — показывать ли кнопку "Оформить заказ" внутри компонента
- Значение `withButton` передаётся в дочерний `<CartTotal :with-button="withButton" />`
- Ранее был баг: `:with-button="false"` было захардкожено вместо `:with-button="withButton"` — исправлено

---

## API

| Метод | URL | Назначение |
|-------|-----|-----------|
| `GET` | `/api/public/promotions` | Список активных акций (для информирования) |
| `POST` | `/api/public/promotions/check-applicable` | Проверить применимые акции для текущей корзины |

**Важно:** путь начинается с `/public/` (не просто `/promotions/check-applicable`).

**POST `/api/public/promotions/check-applicable`**
```json
// Request Body
{
  "items": [
    { "product_id": 1, "quantity": 2, "price": 1500.00 }
  ],
  "total": 3000.00
}

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Купи на 3000₽ — получи подарок",
      "description": "...",
      "allow_promo_codes": false,
      "min_purchase_amount": "3000.00",
      "priority": 10,
      "gift_products": [
        { "id": 5, "name": "Подарочный крем", "price": "500.00", "quantity": 1, "image": "..." }
      ]
    }
  ]
}
```

---

## Чек-лист проверки

- [ ] Добавить товар-триггер в корзину → блок акции появился
- [ ] `allow_promo_codes = false` → виден только выбор подарка, поле промокода заблокировано
- [ ] `allow_promo_codes = true` → можно выбрать подарок или промокод/скидку
- [ ] При выборе "Промокод / скидка" → поле промокода становится доступным
- [ ] Убрать товар-триггер из корзины → блок акции исчезает
- [ ] Перейти в чекаут → данные акции передаются вместе с заказом
- [ ] Оформить заказ с подарком → заказ создаётся, в составе есть позиция с `is_gift = true`
- [ ] Оформить заказ со скидкой вместо подарка → `use_discount_instead = true`, подарок не добавляется
