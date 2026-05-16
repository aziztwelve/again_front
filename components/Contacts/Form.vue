<template>
  <div class="contacts__form form">
    <div class="contacts__form-title fz-h2">Задайте свой вопрос,<br> и мы свяжемся с Вами</div>
    <div class="form__inputs">
      <template v-for="( item, key ) in form" :key="key">
        <component
            v-if="key !== 'phone' && item.template"
            :is="item.template"
            :name="key"
            :placeholder="item.placeholder"
            :error="item.error"
            row-class="_18"
            v-model="item.value"
        />

        <!-- Телефон с выбором страны -->
        <FormPhoneWithCountry
            v-else-if="countries"
            :countries="countries.countries"
            :default-country-id="0"
            :placeholder="item.placeholder"
            v-model="item.value"
            :error="item.error"
            row-class="_18"
            @country-changed="handleCountryChange"
        />
      </template>
    </div>
    <div class="form__button">
      <button
          class="contacts__form-btn btn"
          @click="send"
          :disabled="isButtonDisabled"
      >отправить
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
import type {Countries, Country} from "~/types/countries";
import {getMarketingConsentLink, getPrivacyPolicyLink, getOfertaLink} from '~/utils/getPolicyLink';

// Загружаем страны
const {data: countries} = await useCountries();

const form = ref({
  name: {
    template: FormInput,
    value: '',
    placeholder: 'Введите ваше имя',
    error: ''
  },
  email: {
    template: FormInput,
    value: '',
    placeholder: 'Введите вашу email почту',
    error: ''
  },
  phone: {
    template: FormPhoneWithCountry,
    value: '',
    placeholder: 'Введите ваш номер телефона',
    error: '',
    validation: {
      required: true
    }
  },
  message: {
    template: FormTextarea,
    value: '',
    placeholder: 'Задайте свой вопрос',
    error: ''
  }
});

const selectedCountry = ref<Country | null>(null);

const isCheckedPolicy = ref(false);
const isCheckedOferta = ref(false);
const isCheckedMarketing = ref(false);

const isButtonDisabled = ref(true);

watch(isCheckedPolicy, (newValue) => {
  isButtonDisabled.value = !newValue;
});

const modal = useModal();

const handleCountryChange = (country: Country) => {
  selectedCountry.value = country;
};

const send = async () => {
  const {isFormError, validateForm, resetErrors, resetForm} = useFormValidator(form);
  resetErrors();
  validateForm();

  if (isFormError.value) {
    return;
  }

  // Валидация длины телефона
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
      // marketing_consent: isCheckedMarketing.value

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
.contacts__form {
  max-width: 56.6rem;
  padding: 4.9rem 6.9rem 4.3rem 7.1rem;
  background: rgba(237, 234, 232, 5);
  border-radius: 4.2rem;

  @media (max-width: $tablet) {
    margin-top: 3rem;
  }

  @media (max-width: $mobile) {
    padding: 2.7rem 1rem 4.3rem;
    border-radius: 2rem;
    width: 100%;
    max-width: 100%;

    & .form__button {
      margin-top: 1.5rem;
    }
  }
}

.contacts__form-title {
  text-align: center;
  margin-bottom: 2.8rem;
}

.contacts__content {
  @media (max-width: $mobile) {
    width: 100%;
  }
}
</style>