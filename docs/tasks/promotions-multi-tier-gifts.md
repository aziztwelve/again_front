# Задача: Несколько подарков на чекауте (накопительные акции) — Nuxt Shop

**Статус:** РЕАЛИЗОВАНО (2026-06-26). Витрина переведена на мультиакционную
модель `promotions[]`; `nuxt build` проходит без ошибок. Backend-часть —
см. `lara_admin/docs/tasks/promotions-multi-tier-gifts.md`. API отдаёт
`is_stackable` и принимает `promotions[]`.
**Дата:** 2026-06-24 (реализация фронта — 2026-06-26)
**Связано с backend:** `lara_admin/docs/tasks/promotions-multi-tier-gifts.md`
**Обновляет:** `again_front/docs/tasks/promotions.md` (текущая версия устарела — см. §6)

---

## 0. Что сделано (2026-06-26)

- [x] `stores/promotion.js` — мультиакционная модель: `appliedPromotions`
  вместо одиночной `activePromotion`; выбор подарка/цвета/размера по каждой
  акции (ключ цвета/размера `${promotionId}:${giftId}` — для дублей подарков
  Q3); `allowPromoCodes` — агрегат (промокод разрешён, только если ВСЕ акции
  разрешают); `isGiftSelectionComplete` — по всем акциям; `getDataForOrder()`
  → `{ promotions: [...] }`; `checkApplicable()`/`reset()` сохранили сигнатуру
  (зовут `cart.js` и страницы). Умный `rebuildSelections`: при падении суммы
  ниже порога акция выпадает, её выбор чистится, остальные сохраняются.
- [x] `components/Cart/PromotionItem.vue` (новый) — блок одной акции.
- [x] `components/Cart/Promotion.vue` — контейнер-цикл по `appliedPromotions`.
- [x] `components/Cart/Promocode.vue` — блокировка по агрегированному
  `allowPromoCodes` с перечислением запрещающих акций.
- [x] `composables/useCheckoutSubmit.ts` — шлёт `payload.promotions`; убирает
  `promo_code`, только если `!allowPromoCodes` (подарки и промокод
  сосуществуют, когда все акции разрешают — как на бэке).
- [x] `types/order.ts` — `promotions[]` в `CheckoutPayload`.

> Изменение семантики промокода: раньше выбор подарка скрывал поле промокода.
> Теперь подарки и промокод сосуществуют, если все применённые акции разрешают
> промокоды; поле блокируется только когда хотя бы одна запрещает (соответствует
> backend §3.4 и §4.2 этой спеки).

---

## 1. Что хочет бизнес

На странице `/checkout` клиент должен получать **несколько подарков
одновременно** — по одному (или больше) от каждой подходящей акции, в
зависимости от суммы заказа:

| Акция | Условие | Подарок |
|-------|---------|---------|
| Акция №10 | заказ ≥ 1000 ₽ | Подарок 1 |
| Акция №13 | заказ ≥ 4000 ₽ | Подарок 2 |

- Заказ 1500 ₽ → Подарок 1.
- Заказ 4500 ₽ → Подарок 1 **и** Подарок 2.

---

## 2. Как работает сейчас (и почему «надо доработать»)

Логика выбора подарка на витрине **уже есть**, но рассчитана на **одну** акцию:

1. `pages/checkout/index.vue` → `CheckoutTotal` → `CartTotal` →
   **`components/Cart/Promotion.vue`** — единственный блок акции.
2. Стор `stores/promotion.js`:
   - `checkApplicable()` получает список акций, но берётся **только первая**:
     `activePromotion.value = data.value.data[0]` (самая приоритетная).
   - `gift_products` активной акции — это **альтернативы**: клиент выбирает
     **один** подарок (с цветом/размером, если есть варианты).
   - `getDataForOrder()` возвращает **одиночные** поля:
     `{ promotion_id, gift_product_id, gift_product_variant_id, use_discount_instead }`.
3. `useCheckoutSubmit.ts::buildPayload()` — `Object.assign(payload,
   getDataForOrder())`, то есть в заказ уходит **одна** акция.

> Итог: даже если по сумме заказа подходят несколько акций, клиент видит и
> получает подарок **только от одной** (самой приоритетной). «Несколько
> подарков» сейчас = «выбери один из нескольких», а не «получи несколько».

---

## 3. Целевое поведение (модель стекирования)

Согласовано в backend-спеке (Подход A: стекирование нескольких акций):

- Витрина работает со **списком применённых акций**, а не с одной.
- Каждая применённая акция показывается отдельным блоком; в каждом клиент
  выбирает **один** подарок из её `gift_products` (как сейчас, но на акцию).
- Итоговый набор подарков = по одному выбранному от каждой применённой акции.
- Промокод/скидка разрешены, только если **все** применённые акции имеют
  `allow_promo_codes = true` (агрегированный вердикт).
- В заказ уходит **массив** `promotions: [ { promotion_id, gift_product_id,
  gift_product_variant_id, use_discount_instead }, ... ]`.

### Зависимость от backend (блокирующая)

Фронт нельзя завершить раньше backend. Нужны:
1. `POST /api/public/promotions/check-applicable` возвращает **итоговый
   набор** применённых акций (с учётом `is_stackable` + `priority`) — чтобы
   фронт просто отрисовал все из ответа, не дублируя логику стекирования.
   Каждый элемент дополнить полем `is_stackable`.
2. `POST /api/public/orders` принимает массив `promotions[]` (с обратной
   совместимостью со старым одиночным форматом).

---

## 4. Изменения на фронте (`again_front`)

### 4.1. Стор `stores/promotion.js`

Переписать с «одной активной акции» на «список применённых акций».

**Состояние:**
| Было | Стало |
|------|-------|
| `activePromotion` (один объект) | `appliedPromotions` (массив акций из ответа) |
| `selectedGift` (один) | `selectedGiftByPromotionId: { [promotionId]: giftId }` |
| `selectedGiftVariantByGiftId: { [giftId]: variantId }` | `selectedGiftVariantByKey: { [`${promotionId}:${giftId}`]: variantId }` |
| `selectedGiftColorByGiftId` | `selectedGiftColorByKey: { [`${promotionId}:${giftId}`]: colorId }` |
| `userChoice` (один gift/discount) | `userChoiceByPromotionId: { [promotionId]: 'gift'|'discount' }` |

> **Важно (Q3 — дубли разрешены):** один и тот же товар-подарок может прийти от
> двух акций, поэтому ключи выбора варианта/цвета должны включать
> `promotionId`, а не только `giftId` (иначе выбор для одной акции затрёт другой).

**Computed:**
- `hasPromotion` → `appliedPromotions.length > 0`.
- `allowPromoCodes` → `appliedPromotions.every(p => p.allow_promo_codes)` (если
  список пуст → `true`).
- `isGiftSelectionComplete` → для **каждой** применённой акции, где
  `userChoice !== 'discount'`, выбран подарок и (если нужен) вариант.
- Новый хелпер `useDiscountInsteadForPromotion(promotionId)`.

**Actions:**
- `checkApplicable(items, total)` — сохранять **весь** `data` в
  `appliedPromotions`; автоселект первого подарка и (если есть) цвета **для
  каждой** акции; чистка устаревших выборов по новым ключам; защита от race
  condition (`requestId`) — сохранить.
- `selectGift(promotionId, gift)`, `selectGiftColor(promotionId, gift, colorId)`,
  `selectGiftVariant(promotionId, gift, variant)`, `selectDiscount(promotionId)`
  — все per-promotion.
- `getDataForOrder()` → возвращать `{ promotions: [ ... ] }`:
  ```js
  {
    promotions: appliedPromotions
      .filter(p => /* акция реально применяется */ true)
      .map(p => ({
        promotion_id: p.id,
        use_discount_instead: userChoiceByPromotionId[p.id] === 'discount',
        gift_product_id: <выбранный для p.id>,
        gift_product_variant_id: <вариант, если есть>,
      })),
  }
  ```
- `reset()` — очистить все новые мапы.

### 4.2. Компоненты

- **`components/Cart/Promotion.vue`** — превратить в контейнер: цикл
  `v-for="promotion in promotionStore.appliedPromotions"` по новому
  под-компоненту.
- **`components/Cart/PromotionItem.vue`** (новый) — текущая разметка одного
  блока акции (выбор подарок/скидка, список подарков, цвет→размер), но все
  обращения к стору — через `promotion.id`. По сути перенос текущего шаблона
  `Cart/Promotion.vue` с параметризацией по акции.
- **`components/Cart/Promocode.vue`** — блокировку промокода завязать на
  агрегированный `promotionStore.allowPromoCodes` (если хоть одна применённая
  акция запрещает и по ней выбран подарок → поле заблокировано).

### 4.3. Сабмит заказа

- **`composables/useCheckoutSubmit.ts::buildPayload()`** — вместо
  `Object.assign(payload, getDataForOrder())` класть `payload.promotions =
  getDataForOrder().promotions`. Логику «удалить `promo_code`, если взят
  подарок» пересобрать на агрегированный вердикт: удалять `promo_code`, только
  если хотя бы одна применённая акция с выбранным подарком запрещает промокоды.
- Шаг валидации «выберите вариант для подарка» — оставить, но проверять
  `isGiftSelectionComplete` по всем акциям; скролл к первому незаполненному
  блоку `.cart__promotion-item`.

### 4.4. Типы

- `types/order.ts` — добавить в `CheckoutPayload`:
  ```ts
  promotions?: Array<{
    promotion_id: number;
    use_discount_instead: boolean;
    gift_product_id?: number;
    gift_product_variant_id?: number;
  }>;
  ```

### 4.5. Страницы

- `pages/checkout/index.vue` и `pages/cart/index.vue` — менять не нужно:
  `checkApplicable()` уже вызывается при монтировании и в `watch` на корзину.
  Проверить только, что UI корректно отрисует несколько блоков.

---

## 5. Затрагиваемые файлы

| Файл | Действие |
|------|---------|
| `stores/promotion.js` | мультиакционная модель состояния (основная работа) |
| `components/Cart/Promotion.vue` | контейнер-цикл по акциям |
| `components/Cart/PromotionItem.vue` | **новый** — блок одной акции |
| `components/Cart/Promocode.vue` | блокировка по агрегированному вердикту |
| `composables/useCheckoutSubmit.ts` | отправка `promotions[]`, валидация по всем |
| `types/order.ts` | `promotions[]` в `CheckoutPayload` |
| `docs/tasks/promotions.md` | актуализировать (см. §6) |

---

## 6. Актуализация документации

`again_front/docs/tasks/promotions.md` описывает **старое** API стора
(`selectGift(promotionId, giftProductId)`, `selectedGiftProductId`,
`useDiscountInstead` как поле) — оно не совпадает с текущим кодом
(`selectedGift`, выбор цвет→размер, `userChoice`). После реализации обновить под
мультиакционную модель.

---

## 7. Краевые случаи (фронт)

- Сумма опустилась ниже порога одной из акций (юзер уменьшил корзину) →
  акция выпадает из `appliedPromotions`, её выбор подарка чистится, остальные
  сохраняются (не сбрасывать выбор оставшихся!).
- Подарок с вариантами, но ни одного в наличии → блок предлагает выбрать
  другой подарок этой акции (как сейчас), и `isGiftSelectionComplete` = false.
- Один и тот же товар-подарок в двух акциях → два независимых выбора
  (ключи с `promotionId`).
- Промокод + несколько акций → поле промокода доступно только если все
  применённые акции разрешают (агрегированный вердикт), иначе — заблокировано
  с пояснением.
- Race condition при быстром изменении корзины → сохранить защиту по
  `requestId` (применять только ответ последнего запроса).

---

## 8. Чек-лист проверки

- [ ] Заказ ≥ порога только Акции №10 → один блок, один подарок.
- [ ] Заказ ≥ порога обеих акций → два блока, выбор подарка в каждом.
- [ ] Выбор подарка/цвета/размера в одной акции не влияет на другую.
- [ ] Дубль товара-подарка в двух акциях → два независимых выбора.
- [ ] В заказ уходит `promotions: [...]` с корректными полями по каждой акции.
- [ ] Создан заказ → в составе несколько позиций `is_gift = true`.
- [ ] Промокод заблокирован, если хотя бы одна применённая акция запрещает.
- [ ] Уменьшение корзины ниже порога → лишняя акция исчезает, выбор остальных
      сохраняется.
- [ ] Старый одиночный формат заказа всё ещё принимается бэком (переходный
      период).
- [ ] Защита от race condition при быстром изменении корзины работает.
