<template>
  <div class="modal-gift-card ">
    <div class="modal-gift-card__title modal__title">
      🎁 Данные подарочной карты
    </div>

    <div class="modal-gift-card__description">
      Заполните информацию о том, кому и как отправить подарочную карту
    </div>

    <div class="modal-gift-card__form form">

      <!-- Тип карты -->
      <div class="form__field">
        <label class="form__label">Тип карты:</label>
        <div class="form__radios">
          <FormRadio
              key="1"
              name="card_type1"
              title="💳 Электронная"
              text="Доставка на email"
              :checked="purchaseStore.purchaseData.type === 'electronic'"
              @click="updateField('type', 'electronic')"
          />
          <FormRadio
              key="2"
              name="card_type2"
              title="🎴 Пластиковая"
              text="Физическая карта с доставкой курьером"
              :disabled="true"
              :checked="purchaseStore.purchaseData.type === 'plastic'"
              @click="updateField('type', 'plastic')"
          />
        </div>
      </div>

      <!-- ЭЛЕКТРОННАЯ КАРТА -->
      <template v-if="purchaseStore.purchaseData.type === 'electronic'">

        <!-- Кому отправить -->
        <div class="form__field">
          <label class="form__label">Кому отправить карту:</label>
          <div class="form__radios">
            <FormRadio
                name="recipient_type"
                title="Себе"
                :checked="purchaseStore.purchaseData.recipient_type === 'self'"
                @click="updateField('recipient_type', 'self')"
            />
            <FormRadio
                name="recipient_type"
                title="Другому человеку"
                :checked="purchaseStore.purchaseData.recipient_type === 'someone'"
                @click="updateField('recipient_type', 'someone')"
            />
          </div>
        </div>

        <!-- От кого -->
        <FormInput
            placeholder="Введите ваше имя*"
            :model-value="purchaseStore.purchaseData.sender_name"
            @update:modelValue="updateField('sender_name', $event)"
            :error="errors.sender_name"
            row-class="_15"
        />

        <!-- Блок получателя (если дарим другому) -->
        <template v-if="purchaseStore.purchaseData.recipient_type === 'someone'">
          <FormInput
              placeholder="Имя получателя*"
              :model-value="purchaseStore.purchaseData.recipient_name"
              @update:modelValue="updateField('recipient_name', $event)"
              :error="errors.recipient_name"
              row-class="_15"
          />

          <FormInput
              v-if="purchaseStore.purchaseData.delivery_channel === 'email'"
              type="email"
              placeholder="Email получателя*"
              :model-value="purchaseStore.purchaseData.recipient_email"
              @update:modelValue="updateField('recipient_email', $event)"
              :error="errors.recipient_email"
              row-class="_15"
          />

          <FormPhone
              v-if="purchaseStore.purchaseData.delivery_channel === 'telegram'"
              name="recipient_phone"
              placeholder="Телефон получателя*"
              :model-value="purchaseStore.purchaseData.recipient_phone"
              @update:modelValue="updateField('recipient_phone', $event)"
              :error="errors.recipient_phone"
              row-class="_15"
          />
        </template>

        <!-- Поздравительное сообщение -->
        <FormTextarea
            placeholder="Поздравительное сообщение (необязательно)"
            :model-value="purchaseStore.purchaseData.message"
            @update:modelValue="updateField('message', $event)"
            row-class="_15"
        />
        <div class="form__counter">
          {{ purchaseStore.purchaseData.message.length }} / 500 символов
        </div>

        <!-- Канал доставки -->
        <div class="form__field">
          <label class="form__label">Канал доставки:</label>
          <div class="form__radios">
            <FormRadio
                name="delivery_channel"
                title="📧 Email"
                :checked="purchaseStore.purchaseData.delivery_channel === 'email'"
                @click="updateField('delivery_channel', 'email')"
            />
<!--            <FormRadio-->
<!--                name="delivery_channel"-->
<!--                title="💬 Telegram"-->
<!--                :checked="purchaseStore.purchaseData.delivery_channel === 'telegram'"-->
<!--                @click="updateField('delivery_channel', 'telegram')"-->
<!--            />-->
          </div>
        </div>

        <!-- Когда отправить -->
        <div class="form__field">
          <label class="form__label">Когда отправить:</label>
          <div class="form__radios">
            <FormRadio
                name="delivery_type"
                title="⚡ Сразу после оплаты"
                :checked="purchaseStore.purchaseData.delivery_type === 'immediate'"
                @click="updateField('delivery_type', 'immediate')"
            />
            <FormRadio
                name="delivery_type"
                title="📅 Запланировать отправку"
                :checked="purchaseStore.purchaseData.delivery_type === 'scheduled'"
                @click="updateField('delivery_type', 'scheduled')"
            />
          </div>
        </div>

        <!-- Дата и время (если запланировано) -->
        <template v-if="purchaseStore.purchaseData.delivery_type === 'scheduled'">
          <div class="form__row-grid">
            <FormDatepicker
                name="scheduled_date"
                placeholder="Дата отправки*"
                :model-value="purchaseStore.purchaseData.scheduled_date"
                @update:modelValue="updateField('scheduled_date', $event)"
                :error="errors.scheduled_date"
            />
            <FormInput
                type="time"
                placeholder="Время*"
                :model-value="purchaseStore.purchaseData.scheduled_time"
                @update:modelValue="updateField('scheduled_time', $event)"
                :error="errors.scheduled_time"
                row-class="_15"
            />

          </div>
          <div class="form__timezone-hint">
            ⏰ Время указывается по Москве (MSK, UTC+3)
          </div>

<!--          <FormSelect-->
<!--              name="timezone"-->
<!--              placeholder="Часовой пояс"-->
<!--              :list="timezones"-->
<!--              :selectedId="getSelectedTimezoneId()"-->
<!--              @getSelectedValue="updateTimezone"-->
<!--              row-class="_15"-->
<!--          />-->
        </template>

      </template>

      <!-- ПЛАСТИКОВАЯ КАРТА -->
      <template v-else-if="purchaseStore.purchaseData.type === 'plastic'">

        <div class="form__placeholder">
          <div class="placeholder__icon">🎴</div>
          <h4 class="placeholder__title">Пластиковые карты</h4>
          <p class="placeholder__text">
            Физическая подарочная карта будет доставлена курьером вместе с вашим заказом.
            Код активации будет на обратной стороне карты.
          </p>
          <p class="placeholder__note">
            💡 Укажите адрес доставки в соответствующем разделе при оформлении заказа.
          </p>
        </div>

        <!-- От кого (для пластиковой тоже нужно) -->
        <FormInput
            placeholder="От кого (ваше имя)*"
            :model-value="purchaseStore.purchaseData.sender_name"
            @update:modelValue="updateField('sender_name', $event)"
            :error="errors.sender_name"
            row-class="_15"
        />

        <!-- Поздравительное сообщение (опционально) -->
        <FormTextarea
            placeholder="Поздравительное сообщение (будет напечатано на открытке)"
            :model-value="purchaseStore.purchaseData.message"
            @update:modelValue="updateField('message', $event)"
            row-class="_15"
        />
        <div class="form__counter">
          {{ purchaseStore.purchaseData.message.length }} / 500 символов
        </div>

      </template>

      <!-- Ошибки валидации -->
      <div v-if="validationErrors.length > 0" class="form__errors">
        <p class="error-title">⚠️ Пожалуйста, исправьте ошибки:</p>
        <ul>
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <!-- Кнопка -->
      <div class="form__button">
        <button
            class="modal-callback__btn btn _loader _wide"
            @click="save"
        >
          Сохранить и продолжить
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useGiftCardPurchaseStore } from '~/stores/giftCardPurchase';
import { FormInput, FormPhone, FormTextarea, FormRadio, FormDatepicker, FormSelect } from '#components';

const purchaseStore = useGiftCardPurchaseStore();
const modal = useModal();
const errors = ref({});
const validationErrors = ref([]);

// Список часовых поясов
const timezones = ref([
  { id: 1, name: 'Москва (MSK, UTC+3)', code: 'Europe/Moscow' },
  // { id: 2, name: 'Калининград (UTC+2)', code: 'Europe/Kaliningrad' },
  // { id: 3, name: 'Самара (UTC+4)', code: 'Europe/Samara' },
  // { id: 4, name: 'Екатеринбург (UTC+5)', code: 'Asia/Yekaterinburg' },
  // { id: 5, name: 'Омск (UTC+6)', code: 'Asia/Omsk' },
  // { id: 6, name: 'Красноярск (UTC+7)', code: 'Asia/Krasnoyarsk' },
  // { id: 7, name: 'Иркутск (UTC+8)', code: 'Asia/Irkutsk' },
  // { id: 8, name: 'Якутск (UTC+9)', code: 'Asia/Yakutsk' },
  // { id: 9, name: 'Владивосток (UTC+10)', code: 'Asia/Vladivostok' },
  // { id: 10, name: 'Магадан (UTC+11)', code: 'Asia/Magadan' },
  // { id: 11, name: 'Камчатка (UTC+12)', code: 'Asia/Kamchatka' },
]);

const updateField = (field: string, value: any) => {
  purchaseStore.updateField(field, value);

  // Очищаем ошибки при изменении
  if (errors.value[field]) {
    errors.value[field] = '';
  }
  if (validationErrors.value.length > 0) {
    validationErrors.value = [];
  }
};

const updateTimezone = (data: any) => {
  purchaseStore.updateField('timezone', data.code);
};

const getSelectedTimezoneId = () => {
  const found = timezones.value.find(tz => tz.code === purchaseStore.purchaseData.timezone);
  return found ? found.id : 1;
};

const save = () => {
  const result = purchaseStore.validate();

  if (!result.valid) {
    validationErrors.value = result.errors;
    return;
  }

  // Закрываем модалку
  modal.closeModal();
};

// Загрузка при монтировании
onMounted(() => {
  purchaseStore.loadFromStorage();
});
</script>

<style scoped lang="scss">
.modal-gift-card {

  max-width: 50rem;
  margin: 0 auto;

  &__title {
    margin-bottom: 1rem;
    font-size: 3rem;
    line-height: 120%;
    text-align: center;

    @media (max-width: $mobile) {
      font-size: 2.4rem;
    }
  }

  &__description {
    text-align: center;
    color: #666;
    margin-bottom: 2.5rem;
    font-size: 1.4rem;
    line-height: 1.5;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    & .form__button {
      margin-top: 1rem;
    }
  }
}

.form__field {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form__label {
  font-size: 1.4rem;
  font-weight: 500;
  color: #3F3F3F;
}

.form__radios {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form__row-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
  }
}

.form__counter {
  text-align: right;
  font-size: 1.2rem;
  color: #666;
  margin-top: -1rem;
}

.form__placeholder {
  padding: 3rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%);
  border: 2px dashed rgba(255, 215, 0, 0.3);
  border-radius: 1.2rem;
  margin-bottom: 1rem;
}

.placeholder__icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.placeholder__title {
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: #3F3F3F;
}

.placeholder__text {
  margin: 0 0 1rem 0;
  font-size: 1.4rem;
  color: #666;
  line-height: 1.6;
}

.placeholder__note {
  margin: 0;
  font-size: 1.3rem;
  color: #FFB800;
  font-weight: 500;
  padding: 1rem;
  background: rgba(255, 184, 0, 0.1);
  border-radius: 0.6rem;
}

.form__errors {
  padding: 1.5rem;
  background: rgba(211, 47, 47, 0.1);
  border-left: 3px solid #d32f2f;
  border-radius: 0.6rem;

  .error-title {
    margin: 0 0 1rem 0;
    font-weight: 600;
    color: #d32f2f;
    font-size: 1.4rem;
  }

  ul {
    margin: 0;
    padding-left: 2rem;

    li {
      color: #d32f2f;
      font-size: 1.3rem;
      margin-bottom: 0.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>