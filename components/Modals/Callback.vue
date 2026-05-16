<template>
  <div class="modal-callback__title modal__title">Задайте ваш вопрос</div>
  <div class="modal-callback__form form">
    <FormInput
        placeholder="Введите ваше имя"
        v-model="form.name.value"
        :error="form.name.error"
        row-class="_15"
    />

    <FormPhoneWithCountry
        v-if="countries"
        id="callback"
        :countries="countries.countries"
        :default-country-id="0"
        placeholder="Введите номер телефона*"
        v-model="form.phone.value"
        :error="form.phone.error"
        row-class="_15"
        @country-changed="handleCountryChange"
    />

    <FormInput
        placeholder="Введите вашу email почту"
        v-model="form.email.value"
        :error="form.email.error"
        row-class="_15"
    />

    <FormTextarea
        placeholder="Задайте свой вопрос"
        v-model="form.message.value"
        :error="form.message.error"
        row-class="_15"
    />

    <div class="form__button">
      <button
          class="modal-callback__btn btn _loader _wide"
          @click="send"
          :disabled="isButtonDisabled"
      >
        Отправить
      </button>
    </div>

    <div class="space-y-4">
      <FormCheckbox
          class="form__policy"
          name="privacy_policy"
          :label="getPrivacyPolicyLink()"
          v-model="isCheckedPolicy"
      />

      <FormCheckbox
          class="form__oferta"
          name="oferta"
          :label="getOfertaLink()"
          v-model="isCheckedOferta"
      />

      <FormCheckbox
          class="form__marketing"
          name="marketing_consent"
          :label="getMarketingConsentLink()"
          v-model="isCheckedMarketing"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import {FormInput, FormPhoneWithCountry, FormTextarea, ModalsSuccess} from "#components";
import {useFormValidator} from "~/composables/useFormValidator";
import type {Country} from "~/types/countries";
import {getPrivacyPolicyLink, getOfertaLink, getMarketingConsentLink} from '~/utils/getPolicyLink';

// Загружаем список стран
const {data: countries} = await useCountries();

const form = ref({
  name: {
    value: '',
    error: ''
  },
  phone: {
    value: '',
    error: '',
    validation: {
      required: true
    }
  },
  email: {
    value: '',
    error: ''
  },
  message: {
    value: '',
    error: ''
  }
});

// Храним выбранную страну для валидации
const selectedCountry = ref<Country | null>(null);

const isCheckedPolicy = ref(false);
const isCheckedOferta = ref(false);
const isCheckedMarketing = ref(false);

const isButtonDisabled = ref(true);

watch(isCheckedPolicy, (newValue) => {
  isButtonDisabled.value = !newValue;
});


const modal = useModal();

// Обработчик смены страны
const handleCountryChange = (country: Country) => {
  selectedCountry.value = country;
  console.log('Выбрана страна:', country.name, country.phone_code);
};

const send = async () => {
  const {isFormError, validateForm, resetErrors, resetForm} = useFormValidator(form);
  resetErrors();
  validateForm();

  if (isFormError.value) {
    return;
  }

  // Дополнительная валидация длины телефона
  if (selectedCountry.value) {
    const {validatePhoneLength} = usePhoneMask();
    const isPhoneValid = validatePhoneLength(
        form.value.phone.value,
        selectedCountry.value.phone_code,
        selectedCountry.value.phone_length
    );

    if (!isPhoneValid) {
      form.value.phone.error = `Номер должен содержать ${selectedCountry.value.phone_length} цифр`;
      return;
    }
  }

  const {data, status, error} = await useApi('/contact-requests', {
    body: {
      name: form.value.name.value,
      email: form.value.email.value,
      phone: form.value.phone.value,
      message: form.value.message.value,
      // marketing_consent: isCheckedMarketing.value,

      source: 'website'
    }
  }, 'contact', 'POST');

  if (status.value === 'error' && error?.value?.data?.errors) {
    for (const item in error.value.data.errors) {
      if (form.value[item]) {
        form.value[item].error = error.value.data.errors[item][0];
      }
    }
  } else {
    modal.openModal(ModalsSuccess, {
      title: 'Спасибо!',
      text: 'Ваша заявка отправлена'
    });

    resetErrors();
    resetForm();
  }
};
</script>

<style scoped lang="scss">
.modal-callback {
  &__title {
    margin-bottom: 1.9rem;

    @media (max-width: $tablet) {
      max-width: 30rem;
      margin-left: auto;
      margin-right: auto;
    }
  }

  &__form {
    max-width: 36.7rem;
    margin: 0 auto;

    & .form__button {
      margin-top: 0;
    }
  }
}

.modal-callback__title {
  margin-bottom: 1.9rem;
  font-size: 4rem;
  line-height: 100%;
}
</style>