<template>
  <div class="profile-settings__form form">
    <template v-for="( item, key ) in form" :key="key">
      <!-- Дата рождения с подсветкой и блокировкой -->
      <FormDatepicker
          v-if="key === 'birthday'"
          :name="key"
          :placeholder="item.placeholder"
          v-model="item.value"
          :error="item.error"
          :disabled="isBirthdayDisabled"
          :highlight="isBirthdayHighlight"
      />

      <!-- Телефон с выбором страны -->
      <FormPhoneWithCountry
          v-else-if="key === 'phone' && countries"
          :countries="countries.countries"
          :default-country-id="userPhoneCountryId"
          :placeholder="item.placeholder"
          v-model="item.value"
          :error="item.error"
          @country-changed="handleCountryChange"
      />

      <component
          v-else-if="key !== 'phone'"
          :is="item.template"
          :name="key"
          :placeholder="item.placeholder"
          v-model="item.value"
          :error="item.error"
      />
    </template>

    <div class="form__button">
      <button
          class="profile-settings__form-btn btn _border _loader"
          :class="{ '_loading': isLoading }"
          :disabled="isButtonDisabled"
          @click="save"
      >
        Сохранить изменения
      </button>

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
  </div>
</template>

<script setup lang="ts">
import {FormDatepicker, FormInput, FormPhoneWithCountry, ModalsSuccess} from "#components";
import {useFormValidator} from "~/composables/useFormValidator";
import type {Countries, Country} from "~/types/countries";
import {getMarketingConsentLink, getPrivacyPolicyLink, getOfertaLink} from '~/utils/getPolicyLink';

definePageMeta({
  layout: 'profile',
  title: 'Контактные данные',
  middleware: 'auth',
});

// Загружаем страны
const {data: countries} = await useCountries();

const modal = useModal();
const authStore = useAuthStore();
const {user} = authStore;

const form = ref({
  first_name: {
    template: FormInput,
    value: '',
    placeholder: 'Имя',
    error: '',
    validation: {
      required: true
    }
  },
  last_name: {
    template: FormInput,
    value: '',
    placeholder: 'Фамилия',
    error: '',
    validation: {
      required: true
    }
  },
  birthday: {
    template: FormDatepicker,
    value: '',
    placeholder: 'Дата рождения',
    error: '',
    validation: {
      required: true
    }
  },
  phone: {
    template: FormPhoneWithCountry,
    value: '',
    placeholder: 'Телефон',
    error: '',
    validation: {
      required: true
    }
  },
  email: {
    template: FormInput,
    value: '',
    type: 'email',
    placeholder: 'E-mail',
    error: '',
    validation: {
      required: true
    }
  },
});

// Определяем страну пользователя
const userPhoneCountryId = ref(0);
const selectedCountry = ref<Country | null>(null);

// Логика поля ДР: подсветка и блокировка
const isBirthdayDisabled = ref(false);
const isBirthdayHighlight = ref(false);

onMounted(() => {
  form.value.first_name.value = user?.profile?.first_name || '';
  form.value.last_name.value = user?.profile?.last_name || '';
  form.value.birthday.value = user?.profile?.birthday || '';
  form.value.email.value = user.email;

  // ДР: если заполнено — блокируем, если нет — подсвечиваем
  if (user?.profile?.birthday) {
    isBirthdayDisabled.value = true;
  } else {
    isBirthdayHighlight.value = true;
  }

  // Определяем страну по номеру телефона
  if (user?.profile?.phone && countries.value?.countries) {
    const phoneCode = user.profile.phone.match(/^\+\d+/)?.[0];
    if (phoneCode) {
      const foundCountry = countries.value.countries.find(c => c.phone_code === phoneCode);
      if (foundCountry) {
        userPhoneCountryId.value = foundCountry.id;
        selectedCountry.value = foundCountry;

        // Убираем код страны из номера для отображения
        const phoneWithoutCode = user.profile.phone.replace(phoneCode, '').trim();
        form.value.phone.value = phoneCode + ' ' + phoneWithoutCode;
      }
    } else {
      // Если код не найден, используем номер как есть
      form.value.phone.value = user.profile.phone;
    }
  }
});

const isLoading = ref(false);

const isCheckedPolicy = ref(false);
const isCheckedOferta = ref(false);
const isCheckedMarketing = ref(false);

const isButtonDisabled = ref(true);

watch(isCheckedPolicy, (newValue) => {
  isButtonDisabled.value = !newValue;
});

const handleCountryChange = (country: Country) => {
  selectedCountry.value = country;
};

const save = async () => {
  const {isFormError, validateForm, resetErrors} = useFormValidator(form);
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

  isLoading.value = true;
  try {
    const {data, status, error} = await useApi('/clients/update-profile', {
      body: {
        first_name: form.value.first_name.value,
        last_name: form.value.last_name.value,
        phone: form.value.phone.value,
        email: form.value.email.value,
        birthday: getDateFormat().formatDateOutput(form.value.birthday.value)
      }
    }, '', 'PUT');

    if (status.value === 'error' && error?.value?.data?.errors) {
      for (const item in error.value.data.errors) {
        if (form.value[item]) {
          form.value[item].error = error.value.data.errors[item][0];
        }
      }
    } else {
      authStore.updateProfile(form);

      // После сохранения ДР — блокируем поле и убираем подсветку
      if (form.value.birthday.value) {
        isBirthdayDisabled.value = true;
        isBirthdayHighlight.value = false;
      }

      modal.openModal(ModalsSuccess, {
        title: 'Спасибо!',
        text: 'Ваш профиль обновлен'
      });
    }
  } catch (e) {
    console.error('Profile update failed:', e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
.profile-settings__form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 2.2rem;

  & .form__button {
    margin-top: 0;

    @media (max-width: $mobile) {
      & .btn {
        min-height: 5rem;
      }
    }
  }

  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
  }
}

.profile-settings__form-btn {
  width: 100%;
}

.profile-settings__form-policy {
  margin-top: 2rem;
}
</style>